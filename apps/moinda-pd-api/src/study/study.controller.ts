import { CreateStudyDto } from './../dto/create-study.dto';
import { CreateDiaryDto } from '../dto/create-diary.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { UpdateStudyDto } from '../dto/update-study.dto';
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

  // 스터디 목록 R
  @Get()
  async getAllStudy(/** @Query() page: */): Promise<StudyEntity[]> {
    return this.studyService.getAllStudy();
  }

  // 스터디 상세 페이지 R
  @Get('/:id')
  async onGetStudy(@Param(':id') studyId: string): Promise<StudyEntity> {
    return this.studyService.onGetStudy(studyId);
  }

  // 스터디 상세 페이지 U
  @Put('/:id')
  @UseGuards(JwtStrategy)
  async updateStudy(
    @GetUser() user: UserEntity,
    @Param(':id') studyId: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ): Promise<StudyEntity> {
    return this.studyService.updateStudy(user, studyId, updateStudyDto);
  }

  // 내 스터디룸 R
  @Get(':id/room')
  @UseGuards(JwtStrategy)
  async getMyStudyRoom(
    @GetUser() user: UserEntity,
    @Param(':id') studyId: string,
  ): Promise<StudyEntity> {
    return this.studyService.getMyStudyRoom(user, studyId);
  }

  // 스터디 일지 C
  @Post(':id/diary')
  @UseGuards(JwtStrategy)
  async createDiary(
    @GetUser() user: UserEntity,
    @Param(':id') studyId: string,
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<DiaryEntity> {
    return this.studyService.createDiary(user, studyId, createDiaryDto);
  }

  // 스터디 일지 R
  @Get(':id/diary/:diaryid')
  @UseGuards(JwtStrategy)
  async getDiary(
    @GetUser() user: UserEntity,
    @Param(':id') studyId: string,
    @Param(':diaryId') diaryId: string,
    @Query() page,
  ): Promise<DiaryEntity> {
    return this.studyService.getDiary(studyId, diaryId, page);
  }

  // 스터디 일지 U
  @Put(':id/diary/:diaryid')
  @UseGuards(JwtStrategy)
  async updateDiary(
    @GetUser() user: UserEntity,
    @Param(':id') studyId: string,
    @Param(':diaryId') diaryId: string,
  ): Promise<DiaryEntity> {
    return this.studyService.updateDiary(studyId, diaryId);
  }

  // 스터디 일지 D
  @Delete(':id/diary/:diaryid')
  @UseGuards(JwtStrategy)
  async deleteDiary(
    @GetUser() user: UserEntity,
    @Param(':id') studyId: string,
    @Param(':diaryId') diaryId: string,
  ): Promise<DiaryEntity> {
    return this.studyService.deleteDiary(studyId, diaryId);
  }
}
