import {
  Headers,
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../security/auth.guard';

// @UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/refreshAccessToken')
  async refreshToken(@Headers() headers, @Res() res: Response) {
    // access token 만료 시 호출하여 토큰 재발급
    let refreshToken: string = headers.refreshtoken.split(' ')[1];
    let result = await this.authService.refreshToken(refreshToken);
    res.setHeader('authorization', 'Bearer ' + result.accessToken);
    return res.json(result);
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
