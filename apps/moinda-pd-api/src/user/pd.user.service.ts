import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../libs/moinda-pd/src/entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../auth/auth.service';
import { PdReadUserEntity } from '../../../../libs/moinda-pd/src/read/entity/pd.read.user.entity';
import { Repository } from 'typeorm';
import { DB_READ_NAME, USER } from '@app/moinda-pd/constant.model';
import { response } from 'express';
import { UserProviderEnum } from '@app/moinda-pd/entity/enum/user.provider.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService,
    private idService: IdService,
    private readonly jwtService: JwtService,
    @InjectRepository(PdReadUserEntity, DB_READ_NAME)
    private readonly pdReadUserRepository: Repository<PdReadUserEntity>,
  ) {}

  // 이메일로 회원 찾기 : 권용교
  async findOne(email: string): Promise<UserEntity> {
    return await this.pdReadUserRepository.findOne({
      where: { email: email },
    });
  }

  // 회원 Id로 찾기 : 권용교
  async findId(id: string): Promise<UserEntity> {
    return await this.pdReadUserRepository.findOne({
      where: { id: id },
    });
  }

  async findUser(nickname: string) {
    return await this.pdReadUserRepository
      .createQueryBuilder(USER)
      .where({ nickname: nickname })
      .getOne();
  }

  // 닉네임 중복 : 권용교
  async findNick(nickName: string): Promise<UserEntity> {
    const result = await this.pdReadUserRepository.findOne({
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
    const { email, password, nickname, userType, profile_image } =
      createUserDto;

    // 유저 인스턴스 생성
    const signUser = new UserEntity();
    signUser.id = this.idService.getId(signUser);

    try {
      // 일반 회원가입
      const hash = parseInt(this.configService.get<string>('HASHCODE'));
      // 비밀번호 암호화
      signUser.password = await bcrypt.hash(password, hash);
      signUser.email = email;
      signUser.nickname = nickname;
      if (userType) {
        // 카카오 로그인
        signUser.email = email;
        signUser.nickname = nickname;
        signUser.avatarImg = profile_image;
        signUser.provider = userType;
      }
      // 유저 생성
      return await this.userRepository.save(signUser);
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
    loginUserDto: LoginUserDto, // : Promise<{ accessToken: string; refreshToken: string }>
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginUserDto;
    let hash = parseInt(this.configService.get<string>('HASHCODE'));
    let tokenKey = this.configService.get<string>('TOKENKEY');
    let access_expiresIn = this.configService.get<string>('ACCESS_EXPIRESIN');
    let refresh_expiresIn = this.configService.get<string>('REFRESH_EXPIRESIN');
    let findUser: UserEntity = await this.pdReadUserRepository.findOne({
      where: { email: email },
    });

    if (!findUser)
      throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해주세요');

    // 회원가입 유저만 비밀번호로 검증
    if (findUser.provider === UserProviderEnum.LOCAL) {
      const isPasswordValidated: boolean = await bcrypt.compare(
        password,
        findUser.password,
      );

      if (!isPasswordValidated)
        throw new HttpException('비밀번호 불일치', HttpStatus.UNAUTHORIZED);
    }

    let payload: Payload = { email: findUser.email, id: findUser.id };
    let accessToken = this.jwtService.sign(payload, {
      secret: tokenKey,
      expiresIn: access_expiresIn + 's',
    });

    let refreshToken = this.jwtService.sign(
      { id: findUser.id },
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
  async updateRefreshToken(id: string, refreshToken: string) {
    try {
      return await this.userRepository.update(
        { id: id },
        { refreshToken: refreshToken },
      );
    } catch (error) {
      throw new HttpException('refreshToken update Error', 404);
    }
  }

  // read db test
  async testdb() {
    return await this.pdReadUserRepository.find({});
  }
}
