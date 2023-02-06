import { CreateStudyDto } from './../dto/create-study.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { GetUser } from '../decorator/user.decorator';
import { AuthGuard } from '../security/auth.guard';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post()
  @UseGuards(AuthGuard)
  // @UseGuards(JwtStrategy)
  async onCreateStudy(
    @Body(ValidationPipe) createStudyDto: CreateStudyDto,
    @GetUser() user: UserEntity,
  ): Promise<StudyEntity> {
    console.log(user);
    return this.studyService.onCreateStudy(user, createStudyDto);
  }

  @Get(':id')
  async onGetStudy(@Param('id') studyId: string): Promise<StudyEntity> {
    console.log('123', studyId);
    return this.studyService.onGetStudy(studyId);
  }
}
