import {
  Headers,
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../security/auth.guard';
import { UserService } from '../user/pd.user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserProviderEnum } from '@app/moinda-pd/entity/enum/user.provider.enum';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';

// @UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/refreshAccessToken')
  async refreshToken(@Headers() headers, @Res() res: Response) {
    // access token 만료 시 호출하여 토큰 재발급
    let refreshToken: string = headers.refreshtoken.split(' ')[1];
    let result = await this.authService.refreshToken(refreshToken);
    // res.setHeader('authorization', 'Bearer ' + result.accessToken);
    return res.json({ accessToken: 'Bearer ' + result.accessToken });
  }

  // 이메일 인증 : 권용교
  @Post('/nodemailer')
  async emailVerify(@Body('email') email: string): Promise<string> {
    return await this.authService.verifyEmail(email);
  }

  // 카카오 로그인
  @Post('/kakao')
  async kakaoLogin(@Res() res: Response, @Req() req: Request): Promise<any> {
    try {
      const { code } = req.query;
      if (typeof code === 'undefined' || typeof code !== 'string') {
        throw new Error(`kakao data Error`);
      }
      const domain = req.protocol + '://' + req.get('host');

      // 카카오 토큰 조회 후 계정 정보 가져오기
      if (!code || !domain) {
        throw new BadRequestException('카카오 정보가 없습니다.');
      }
      const kakao = await this.authService.kakaoLogin({ code, domain });

      // 카카오 로그인 유저 조회
      let findUser: UserEntity = await this.userService.findOne(
        kakao.kakao_account.email,
      );

      // 등록된 카카오 유저가 아닌 경우 -> 회원가입
      if (findUser === null) {
        let user: CreateUserDto = {
          email: kakao.kakao_account.email,
          password: 'kakao',
          nickname: kakao.properties.nickname,
          userType: UserProviderEnum.KAKAO,
          // profile_image : kakao.properties.profile_image
          profile_image: kakao.properties.thumbnail_image,
        };

        findUser = await this.userService.signup(user);
      }

      // 카카오 유저 데이터로 토큰 생성
      const jwt = await this.userService.validateUser({
        email: findUser.email,
        password: findUser.password,
      });

      // res.cookie('refreshToken', 'Bearer ' + jwt.refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      // });
      res.setHeader('authorization', 'Bearer ' + jwt.refreshToken);

      return res.json({ accessToken: 'Bearer ' + jwt.accessToken });
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  @Post('/naver')
  async naverLogin(@Res() res: Response, @Req() req: Request): Promise<any> {
    const { code, state, error, error_description } = req.query;
    if (typeof code === 'undefined') {
      throw new Error(`naver data Error (${error}) : ${error_description}`);
    }
    const naverToken = await this.authService.getNaverToken({ code, state });
    const naverUserInfo = await this.authService.getNaverUserInfo(naverToken);

    let findUser: UserEntity = await this.userService.findOne(
      naverUserInfo.response.email,
    );

    if (findUser === null) {
      let user: CreateUserDto = {
        email: naverUserInfo.response.email,
        password: 'naver',
        nickname: 'naverUser',
        userType: UserProviderEnum.NAVER,
      };

      findUser = await this.userService.signup(user);
    }

    const jwt = await this.userService.validateUser({
      email: findUser.email,
      password: findUser.password,
    });

    // res.cookie('refreshToken', 'Bearer ' + jwt.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });
    res.setHeader('authorization', 'Bearer ' + jwt.refreshToken);

    return res.json({ accessToken: 'Bearer ' + jwt.accessToken });
  }

  @Post('/google')
  async googleLogin(@Res() res: Response, @Req() req: Request): Promise<any> {
    const { code } = req.query;
    if (typeof code === 'undefined') {
      throw new Error(`google data Error`);
    }
    const url = req.protocol + '://' + req.get('host');
    const gooleToken = await this.authService.getGoogleToken({ code, url });
    const googleTokenValidation = await this.authService.googleTokenValidation(
      gooleToken,
    );
    if (googleTokenValidation.status !== 200) {
      throw new Error('google accesstoken validation error');
    }
    const googleUserInfo = await this.authService.getGoogleUserInfo(gooleToken);

    let findUser: UserEntity = await this.userService.findOne(
      googleUserInfo.email,
    );

    if (findUser === null) {
      let user: CreateUserDto = {
        email: googleUserInfo.email,
        password: 'google',
        nickname: 'googleUser',
        userType: UserProviderEnum.GOOGLE,
        profile_image: googleUserInfo.picture,
      };

      findUser = await this.userService.signup(user);
    }

    const jwt = await this.userService.validateUser({
      email: findUser.email,
      password: findUser.password,
    });

    // res.cookie('refreshToken', 'Bearer ' + jwt.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });
    res.setHeader('authorization', 'Bearer ' + jwt.refreshToken);

    return res.json({ accessToken: 'Bearer ' + jwt.accessToken });
  }

  // AuthGuard test : 권용교
  @Get('/authtest')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: any): any {
    console.log(req.user.id);
    return '성공!';
  }
}
