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
import { MailerService } from '@nestjs-modules/mailer';

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
    private readonly mailerService: MailerService,
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

  async verifyEmail(email: string): Promise<string> {
    let searchUser: UserEntity = await this.usersService.findOne(email);

    if (!!searchUser) {
      throw new HttpException(
        '이미 등록된 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 인증 번호 생성
    let getRandomNum: string = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    await this.mailerService.sendMail({
      to: email,
      from: 'noreplay@gmail.com',
      subject: '안녕하세요 MOINDA에서 메일 인증 코드를 보내드립니다.',
      text: 'text',
      // 임시 템플릿
      html: `
      <div style="font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid green; margin: 100px auto; padding: 30px 0; box-sizing: border-box;">
      <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;">
        <span style="font-size: 15px; margin: 0 0 10px 3px;">MOINDA</span><br />
        <span style="color: green;">메일인증</span> 안내입니다.
      </h1>
      <p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;">
        안녕하세요.<br />
        MOINDA 서비스에 가입해 주셔서 진심으로 감사드립니다.<br />
        아래 <b style="color: green;">'인증 코드'</b>를 회원가입 페이지에 입력해 주세요.<br />
        감사합니다.
      </p>
      <div style="font-size:20px;line-height:26px;margin-top:30px;padding:0 5px" >${getRandomNum}</div>
    </div>`,
    });

    return getRandomNum;
  }
}
