import { Controller, Get, Query } from '@nestjs/common';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('newstudy')
  async getNewStudy() {
    return this.mainService.getNewStudy();
  }

  //   @Get('')
}
