import { UpdateStudyDto } from './../dto/update-study.dto';
import { CreateStudyDto } from './../dto/create-study.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
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
    return this.studyService.onGetStudy(studyId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateStudy(
    @Param('id') studyId: string,
    @Body() updateStudyDto: UpdateStudyDto,
    @GetUser() user: UserEntity,
  ): Promise<StudyEntity> {
    return this.studyService.updateStudy(user, studyId, updateStudyDto);
  }

  //skip = page
  //take = limit
  @Get()
  async studyList(
    @Query('category') category: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<StudyEntity[]> {
    return this.studyService.studyList(page, take, category);
  }
}
