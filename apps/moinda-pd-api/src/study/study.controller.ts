import { CreateStudyDto } from './../dto/create-study.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { User } from '../decorator/user.decorator';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post()
  @UseGuards(JwtStrategy)
  async onCreateStudy(
    @Body() createStudyDto: CreateStudyDto,
    @User() user: UserEntity | undefined,
  ): Promise<StudyEntity> {
    return this.studyService.onCreateStudy(user, createStudyDto);
  }
}
