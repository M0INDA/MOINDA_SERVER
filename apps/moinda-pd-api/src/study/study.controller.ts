import { Body, Controller, Get, Injectable, Req } from '@nestjs/common';
import { UserService } from '../user/pd.user.service';
import { StudyService } from './study.service';

@Controller('study')
export class StudyController {
  constructor(
    private readonly studyService: StudyService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async postStudy(@Body() body, @Req() req) {
    const { title, content, groupImg, category, startDate, endDate } =
      await body;
    const { userId } = await req.user;
  }
}
