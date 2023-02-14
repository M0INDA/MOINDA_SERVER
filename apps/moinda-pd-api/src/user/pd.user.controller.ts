import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UseFilters,
  HttpException,
  HttpStatus,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './pd.user.service';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthGuard } from '../security/auth.guard';

// @UseFilters(InvalidStatusException)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('checkEmail')
  async getEmail(@Body('email') email: string): Promise<boolean> {
    const result = await this.userService.findOne(email);
    if (result)
      throw new HttpException('존재하는 이메일입니다.', HttpStatus.FORBIDDEN);
    return true;
  }

  @Post('checkNick')
  async getNick(@Body('nickname') nickName: string): Promise<boolean> {
    const result = await this.userService.findNick(nickName);
    if (result)
      throw new HttpException('존재하는 닉네임입니다.', HttpStatus.FORBIDDEN);
    return true;
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, nickname } = createUserDto;
    if (!email || !password || !nickname) {
      throw new HttpException('회원가입 데이터 누락', HttpStatus.BAD_REQUEST);
    }
    return this.userService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const jwt = await this.userService.validateUser(loginUserDto);

    // res.cookie('refreshToken', 'Bearer ' + jwt.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });
    res.setHeader('authorization', 'Bearer ' + jwt.refreshToken);
    return res.json({ accessToken: 'Bearer ' + jwt.accessToken });
  }

  @Get('getUserProfile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: any) {
    try {
      const id = req.user.id;

      const userInfo = await this.userService.findId(id);
      const userScore = await userInfo.scores;

      const userProfile = {
        profileImg: userInfo.avatarImg,
        nickname: userInfo.nickname,
        email: userInfo.email,
        userScore: userScore,
      };
      return userInfo;
    } catch (error) {
      throw new HttpException('유저 정보 조회 실패', HttpStatus.NOT_FOUND);
    }
  }

  @Post('withDrawal')
  @UseGuards(AuthGuard)
  async WithDrawal(@Req() req: any) {
    const id = req.user.id;

    // enum으로 바뀌면 상태값만 바꿔주자, 일단 유저 삭제처리
    const result = await this.userService.deleteUser(id);
    return result;
  }
}
