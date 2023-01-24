import {
  HttpStatus,
  HttpException,
  Inject,
  forwardRef,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { UserService } from '../user/pd.user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export interface Payload {
  nickname?: string;
  email?: string;
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // accessToken 유저 정보 조회 : 권용교
  async tokenValidateUser(payload: Payload): Promise<UserEntity | undefined> {
    let { userId } = payload;
    return await this.usersService.findId(userId);
  }

  // access token 재발급 : 권용교
  // access token 만료 시 refresh token을 받아와서 유저 db에 저장된 refresh token이 일치하는지 확인 후 accessToken 재발급
  async refreshToken(refreshToken: string) {
    try {
      let tokenKey = this.configService.get<string>('TOKENKEY');
      let access_expiresIn = this.configService.get<string>('ACCESS_EXPIRESIN');

      let verifyResult = await this.jwtService.verify(refreshToken, {
        secret: tokenKey,
      });

      let findUser = await this.usersService.findId(verifyResult.userId);

      let result = await bcrypt.compare(refreshToken, findUser.refreshToken);

      if (result) {
        let payload: Payload = { email: findUser.email, userId: findUser.id };
        let accessToken = this.jwtService.sign(payload, {
          secret: tokenKey,
          expiresIn: access_expiresIn + 's',
        });
        return { accessToken: accessToken };
      } else {
        throw new HttpException(
          'refresh token forgery error',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'refresh token expired error, plz login',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
