import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../libs/moinda-pd/src/entity/user.entity';
import { UserRepository } from '../../../../libs/moinda-pd/src/repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userReopsitory: UserRepository,
    private configService: ConfigService,
    private idService: IdService,
    private readonly jwtService: JwtService,
  ) {}

  // 이메일로 회원 찾기 : 권용교
  async findOne(email: string): Promise<UserEntity> {
    return await this.userReopsitory.findOneBy({
      email: email,
    });
  }

  // 회원 Id로 찾기 : 권용교
  async findId(userId: string): Promise<UserEntity> {
    return await this.userReopsitory.findOneBy({
      id: userId,
    });
  }

  // 닉네임 중복 : 권용교
  async findNick(nickName: string): Promise<UserEntity> {
    const result = await this.userReopsitory.findOne({
      where: {
        nickname: nickName,
      },
    });
    return result;
  }

  // 회원가입 : 권용교
  // 회원가입 초기 refresh token 값은 null
  // 회원 비밀번호 bcrypt 암호화를 사용하여 데이터베이스에 저장
  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, nickname } = createUserDto;

    const hash = parseInt(this.configService.get<string>('HASHCODE'));
    // 비밀번호 암호화
    const hashPassword: string = await bcrypt.hash(password, hash);

    // 유저 인스턴스 생성
    const signUser = new UserEntity();
    const signUserId = this.idService.getId(signUser);
    try {
      signUser.id = signUserId;
      signUser.email = email;
      signUser.nickname = nickname;
      signUser.password = hashPassword;

      return await this.userReopsitory.save(signUser);
    } catch (error) {
      console.log('ERROR :::::::> ' + error.message);
      throw new HttpException(
        '이메일 혹은 닉네임 중복',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 로그인 : 권용교
  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginUserDto;
    let hash = parseInt(this.configService.get<string>('HASHCODE'));
    let tokenKey = this.configService.get<string>('TOKENKEY');
    let access_expiresIn = this.configService.get<string>('ACCESS_EXPIRESIN');
    let refresh_expiresIn = this.configService.get<string>('REFRESH_EXPIRESIN');
    let findUser: UserEntity = await this.userReopsitory.findOne({
      where: { email: email },
    });

    if (!findUser)
      throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해주세요');

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      findUser.password,
    );

    if (!isPasswordValidated)
      throw new HttpException('비밀번호 불일치', HttpStatus.UNAUTHORIZED);

    let payload: Payload = { email: findUser.email, userId: findUser.id };
    let accessToken = this.jwtService.sign(payload, {
      secret: tokenKey,
      expiresIn: access_expiresIn + 's',
    });

    let refreshToken = this.jwtService.sign(
      { userId: findUser.id },
      {
        secret: tokenKey,
        expiresIn: refresh_expiresIn + 's',
      },
    );

    let updateRefreshToken = await bcrypt.hash(refreshToken, hash);

    // refreshToken 암호화 해아함
    await this.updateRefreshToken(findUser.id, updateRefreshToken);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  // 로그인 시 RefreshToken 업데이트 : 권용교
  async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      return await this.userReopsitory.update(
        { id: userId },
        { refreshToken: refreshToken },
      );
    } catch (error) {
      throw new HttpException('refreshToken update Error', 404);
    }
  }
}
