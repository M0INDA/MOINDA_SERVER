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
import { IdService } from '@app/moinda-pd/service/pd.id.service';

// @UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly idService: IdService,
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
  async kakaoLogin(@Body() body: any, @Res() res: Response): Promise<any> {
    try {
      // 카카오 토큰 조회 후 계정 정보 가져오기
      const { code, domain } = body;
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
        let randomNick: string = this.idService.getId('test');

        let user: CreateUserDto = {
          email: kakao.kakao_account.email,
          password: 'kakao',
          nickname: randomNick,
          userType: UserProviderEnum.KAKAO,
        };

        findUser = await this.userService.signup(user);
      }

      // 카카오 유저 데이터로 토큰 생성
      const jwt = await this.userService.validateUser({
        email: findUser.email,
        password: findUser.password,
      });

      res.cookie('refreshToken', 'Bearer ' + jwt.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      // res.header('Access-Control-Allow-Origin', '*');
      console.log(jwt);
      return res.json({ accessToken: 'Bearer ' + jwt.accessToken });
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  // AuthGuard test : 권용교
  @Get('/authtest')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    // const user: any = req.user;
    console.log(req.body);
    return '성공!';
  }
}
