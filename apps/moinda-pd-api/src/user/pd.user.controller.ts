import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UseFilters,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './pd.user.service';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

// @UseFilters(InvalidStatusException)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('checkEmail')
  async getEmail(@Body('email') email: string): Promise<boolean> {
    const result = await this.usersService.findOne(email);
    if (result)
      throw new HttpException('존재하는 이메일입니다.', HttpStatus.FORBIDDEN);
    return true;
  }

  @Post('checkNick')
  async getNick(@Body('nickname') nickName: string): Promise<boolean> {
    const result = await this.usersService.findNick(nickName);
    if (result)
      throw new HttpException('존재하는 닉네임입니다.', HttpStatus.FORBIDDEN);
    return true;
  }

  @Post('signup')
  signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const { email, password, nickname } = createUserDto;
    if (!email || !password || !nickname) {
      throw new HttpException('회원가입 데이터 누락', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.signup(createUserDto);
  }
}
