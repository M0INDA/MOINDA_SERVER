import {
  HttpStatus,
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpCode,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../libs/moinda-pd/src/entity/user.entity';
import { UserRepository } from '../../../../libs/moinda-pd/src/repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IdService } from '@app/moinda-pd/service/pd.id.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersReopsitory: UserRepository,
    private configService: ConfigService,
    private idService: IdService,
  ) {}

  // 이메일로 회원 찾기 : 권용교
  async findOne(email: string): Promise<UserEntity> {
    return await this.usersReopsitory.findOneBy({
      email: email,
    });
  }

  // 회원 Id로 찾기 : 권용교
  async findId(userId: string): Promise<UserEntity> {
    return await this.usersReopsitory.findOneBy({
      id: userId,
    });
  }

  // 닉네임 중복 : 권용교
  async findNick(nickName: string): Promise<UserEntity> {
    const result = await this.usersReopsitory.findOne({
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

      return await this.usersReopsitory.save(signUser);
    } catch (error) {
      console.log('ERROR :::::::> ' + error.message);
      throw new HttpException(
        '이메일 혹은 닉네임 중복',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 로그인 시 RefreshToken 업데이트 : 권용교
  // async updateRefreshToken(userId: string, refreshToken: string) {
  //   return await this.usersReopsitory.updateRefreshToken(userId, refreshToken);
  // }
}
