import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { AuthGuard } from './../security/auth.guard';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MainService } from './main.service';
import { GetUser } from '../decorator/user.decorator';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('newstudy')
  async getNewStudy() {
    return this.mainService.getNewStudy();
  }

  @Get('bestStudy')
  async getBestStudy(
    @Query('category') category: string,
  ): Promise<StudyEntity[]> {
    return this.mainService.getBestStudy(category);
  }

  @Get('myStudy')
  @UseGuards(AuthGuard)
  async getMyStudy(@GetUser() user: UserEntity) {
    return this.mainService.getMyStudy(user);
  }
}
