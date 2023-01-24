import {
  HttpStatus,
  Headers,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthGuard } from '../security/auth.guard';

// @UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const jwt = await this.authService.validateUser(loginUserDto);

    res.setHeader('authorization', 'Bearer ' + jwt.accessToken);
    res.setHeader('refreshtoken', 'Bearer ' + jwt.refreshToken);
    return res.json(jwt);
  }

  @Post('/refreshAccessToken')
  async refreshToken(@Headers() headers, @Res() res: Response) {
    // access token 만료 시 호출하여 토큰 재발급
    let refreshToken: string = headers.refreshtoken.split(' ')[1];
    let result = await this.authService.refreshToken(refreshToken);
    res.setHeader('authorization', 'Bearer ' + result.accessToken);
    return res.json(result);
  }

  // AuthGuard test : 권용교
  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
