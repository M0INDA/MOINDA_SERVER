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
import axios from 'axios';
import qs from 'qs';

export interface Payload {
  nickname?: string;
  email?: string;
  id: string;
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
    let { id } = payload;
    return await this.usersService.findId(id);
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

      let findUser = await this.usersService.findId(verifyResult.id);

      let result = await bcrypt.compare(refreshToken, findUser.refreshToken);

      if (result) {
        let payload: Payload = { email: findUser.email, id: findUser.id };
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

  async kakaoLogin(options: { code: string; domain: string }): Promise<any> {
    const { code, domain } = options;
    const kakaoKey = this.configService.get<string>('KAKAOKEY');
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      redirect_uri: `${domain}/oauth/callback/kakao`,
      code,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios({
        method: 'POST',
        url: `https://kauth.kakao.com/oauth/token`,
        timeout: 30000,
        headers,
        data: body,
      });

      if (response.status === 200) {
        // Token 을 가져왔을 경우 사용자 정보 조회
        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };

        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });

        console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
        if (responseUserInfo.status === 200) {
          console.log(
            `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
          );
          return responseUserInfo.data;
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async getNaverToken(data) {
    try {
      const { code, state } = data;

      const naverToken = await axios.post(
        'https://nid.naver.com/oauth2.0/token',
        {},
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID_NAVER,
            client_secret: process.env.CLIENT_SECRET_NAVER,
            code: code,
            state: state,
          },
        },
      );
      if (naverToken.status !== 200) throw new Error('네이버 토큰 발급 에러');

      return naverToken.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getNaverUserInfo(data) {
    try {
      const { access_token } = data;

      const userInfo = await axios.post(
        'https://openapi.naver.com/v1/nid/me',
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      if (userInfo.status !== 200) throw new Error('유저 정보가 없습니다.');
      return userInfo.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getGoogleToken(data) {
    try {
      const { code, url } = data;
      const client_id = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE;
      const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET_GOOGLE;
      const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URL_GOOGLE;

      const googleToken = await axios.post(
        'https://oauth2.googleapis.com/token',
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          params: {
            code: code,
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'authorization_code',
            redirect_uri: url + redirect_uri,
          },
        },
      );

      if (googleToken.status !== 200) {
        throw new Error('구글 토근 발급 에러');
      }

      return googleToken.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async googleTokenValidation(data) {
    try {
      const { access_token } = data;

      const result = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${access_token}`,
      );
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getGoogleUserInfo(data) {
    const { access_token } = data;

    try {
      const userInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      if (userInfo.status !== 200) throw new Error('유저 정보가 없습니다.');
      return userInfo.data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
