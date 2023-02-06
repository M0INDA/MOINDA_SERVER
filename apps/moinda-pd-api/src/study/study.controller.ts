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
  Ip,
} from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { UpdateStudyDto } from '../dto/update-study.dto';
import { GetUser } from '../decorator/user.decorator';
import { AuthGuard } from '../security/auth.guard';
import { ViewsDto } from '../dto/views.dto';
import { updateDiaryDto } from '../dto/update-diary.dto';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { StudyRequestDto } from '../dto/request-study.dto';
import { ApproveStatusEnum } from '@app/moinda-pd/entity/enum/aprove.status.enum';

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
  @Get(':id')
  async onGetStudy(
    @Param('id') studyId: string,
    @Ip() ip: ViewsDto,
  ): Promise<StudyEntity> {
    console.log('상세페이지 조회 지나갑니다');
    this.studyService.upViews(studyId, ip);
    return this.studyService.onGetStudy(studyId);
  }

  // 스터디 상세 페이지 U
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateStudy(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ): Promise<StudyEntity> {
    return this.studyService.updateStudy(user, studyId, updateStudyDto);
  }

  // 스터디 참여 요청
  @Post(':id/approve')
  @UseGuards(AuthGuard)
  async studyRequest(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Body() studyRequestDto: StudyRequestDto,
  ): Promise<ApproveEntity> {
    return this.studyService.studyRequest(user, studyId, studyRequestDto);
  }

  // 참여 수락 여부
  @Put(':id/approve/:approveId')
  @UseGuards(AuthGuard)
  async whetherOrNot(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Param('id') approveId: string,
    @Body() approveStatus: ApproveStatusEnum,
  ): Promise<ApproveEntity> {
    return this.studyService.whetherOrNot();
  }

  // 내 스터디룸 R
  @Get(':id/room')
  @UseGuards(AuthGuard)
  async getMyStudyRoom(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
  ): Promise<StudyEntity> {
    return this.studyService.getMyStudyRoom(user, studyId);
  }

  // 스터디 일지 C
  @Post(':id/diary')
  @UseGuards(AuthGuard)
  async createDiary(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<DiaryEntity> {
    return this.studyService.createDiary(user, studyId, createDiaryDto);
  }

  // 스터디 일지 R
  @Get(':id/diary')
  @UseGuards(AuthGuard)
  async getDiary(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
  ): Promise<DiaryEntity[]> {
    return this.studyService.getDiary(user, studyId);
  }

  // 스터디 일지 U
  @Put(':id/diary/:diaryid')
  @UseGuards(AuthGuard)
  async updateDiary(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Param('diaryId') diaryId: string,
    @Body() updateDiaryDto: updateDiaryDto,
  ): Promise<DiaryEntity> {
    return this.studyService.updateDiary(
      user,
      studyId,
      diaryId,
      updateDiaryDto,
    );
  }

  // 스터디 일지 D
  @Delete(':id/diary/:diaryid')
  @UseGuards(AuthGuard)
  async deleteDiary(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Param('diaryId') diaryId: string,
  ): Promise<DiaryEntity> {
    return this.studyService.deleteDiary(user, studyId, diaryId);
  }
}
