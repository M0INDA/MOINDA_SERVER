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
    const kakaoKey = '507de8ce1c4e0e21e7ec2278ea407e01';
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
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
    // try {
    //   /*
    //     grant_type	  String	authorization_code로 고정	O
    //     client_id	    String	앱 REST API 키
    //     redirect_uri	String	인가 코드가 리다이렉트된 URI	O
    //     code	        String	인가 코드 받기 요청으로 얻은 인가 코드	O

    //     POST /oauth/token HTTP/1.1
    //     Host: kauth.kakao.com
    //     Content-type: application/x-www-form-urlencoded;charset=utf-8
    //   */
    //   const response = await axios({
    //     method: 'POST',
    //     url: `https://kauth.kakao.com/oauth/token`,
    //     timeout: 30000,
    //     headers,
    //     data: body,
    //   });

    //   if (response.status === 200) {
    //     // Token 을 가져왔을 경우 사용자 정보 조회
    //     const headerUserInfo = {
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    //       Authorization: 'Bearer ' + response.data.access_token,
    //     };

    //     const responseUserInfo = await axios({
    //       method: 'GET',
    //       url: kakaoUserInfoUrl,
    //       timeout: 30000,
    //       headers: headerUserInfo,
    //     });

    //     console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
    //     if (responseUserInfo.status === 200) {
    //       console.log(
    //         `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
    //       );
    //       return responseUserInfo.data;
    //     } else {
    //       throw new UnauthorizedException();
    //     }
    //   } else {
    //     throw new UnauthorizedException();
    //   }
    // } catch (error) {
    //   console.log(error);
    //   throw new UnauthorizedException();
    // }
    let test = {
      id: 2643471070,
      connected_at: '2023-01-30T05:04:10Z',
      properties: {
        nickname: '권용교',
        profile_image:
          'http://k.kakaocdn.net/dn/bYZ6ZO/btrXmJBn6S2/f6FcaqlsOUTGaNsLvwLMN1/img_640x640.jpg',
        thumbnail_image:
          'http://k.kakaocdn.net/dn/bYZ6ZO/btrXmJBn6S2/f6FcaqlsOUTGaNsLvwLMN1/img_110x110.jpg',
      },
      kakao_account: {
        profile_nickname_needs_agreement: false,
        profile_image_needs_agreement: false,
        profile: {
          nickname: '권용교',
          thumbnail_image_url:
            'http://k.kakaocdn.net/dn/bYZ6ZO/btrXmJBn6S2/f6FcaqlsOUTGaNsLvwLMN1/img_110x110.jpg',
          profile_image_url:
            'http://k.kakaocdn.net/dn/bYZ6ZO/btrXmJBn6S2/f6FcaqlsOUTGaNsLvwLMN1/img_640x640.jpg',
          is_default_image: false,
        },
        has_email: true,
        email_needs_agreement: false,
        is_email_valid: true,
        is_email_verified: true,
        email: 'rdrd1996@kakao.com',
      },
    };
    return test;
  }
}
