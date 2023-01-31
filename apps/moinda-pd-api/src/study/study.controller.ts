import { CreateStudyDto } from './../dto/create-study.dto';
import { CreateDiaryDto } from '../dto/create-diary.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { User } from '../decorator/user.decorator';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { UpdateStudyDto } from '../dto/update-study.dto';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  // 스터디 개설
  @Post('/produce')
  @UseGuards(JwtStrategy)
  async onCreateStudy(
    @Body() createStudyDto: CreateStudyDto,
    @User() user: UserEntity | undefined,
  ): Promise<StudyEntity> {
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
    @User() user: UserEntity,
    @Param(':id') studyId: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ): Promise<StudyEntity> {
    return this.studyService.updateStudy(user, studyId, updateStudyDto);
  }

  // 내 스터디룸 R
  @Get(':id/room')
  @UseGuards(JwtStrategy)
  async getMyStudyRoom(
    @User() user: UserEntity,
    @Param(':id') studyId: string,
  ): Promise<StudyEntity> {
    return this.studyService.getMyStudyRoom(user, studyId);
  }

  // 스터디 일지 C
  @Post(':id/diary')
  @UseGuards(JwtStrategy)
  async createDiary(
    @User() user: UserEntity,
    @Param(':id') studyId: string,
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<DiaryEntity> {
    return this.studyService.createDiary(user, studyId, createDiaryDto);
  }

  // 스터디 일지 R
  @Get(':id/diary/:diaryid')
  @UseGuards(JwtStrategy)
  async getDiary(
    @User() user: UserEntity,
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
    @User() user: UserEntity,
    @Param(':id') studyId: string,
    @Param(':diaryId') diaryId: string,
  ): Promise<DiaryEntity> {
    return this.studyService.updateDiary(studyId, diaryId);
  }

  // 스터디 일지 D
  @Delete(':id/diary/:diaryid')
  @UseGuards(JwtStrategy)
  async deleteDiary(
    @User() user: UserEntity,
    @Param(':id') studyId: string,
    @Param(':diaryId') diaryId: string,
  ): Promise<DiaryEntity> {
    return this.studyService.deleteDiary(studyId, diaryId);
  }
}
