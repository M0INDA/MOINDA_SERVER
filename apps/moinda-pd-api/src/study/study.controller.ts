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
import { ApproveStatusEnum } from '@app/moinda-pd/entity/enum/approve.status.enum';
import { StudyStatusEnum } from '@app/moinda-pd/entity/enum/study.status.enum';
import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { targetTimeSet } from '../dto/targetTime-set.dto';
import { WhetherOrNotDto } from '../dto/whetherOrNot.dto';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  // 스터디 개설 C
  @Post()
  @UseGuards(AuthGuard)
  async onCreateStudy(
    @Body(ValidationPipe) createStudyDto: CreateStudyDto,
    @GetUser() user: UserEntity,
  ): Promise<StudyEntity> {
    console.log(user);
    return this.studyService.onCreateStudy(user, createStudyDto);
  }

  // 추천 스터디 목록 R
  @Get('best')
  async getBestStudy(
    @Param('category') category: CategoryEnum,
  ): Promise<StudyEntity[]> {
    return this.studyService.getBestStudy(category);
  }

  // 최신 스터디 목록 R
  @Get('new')
  async getNewStudy(
    @Param('category') category: CategoryEnum,
  ): Promise<StudyEntity[]> {
    return this.studyService.getNewStudy(category);
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
    // @Body() studyRequestDto: StudyRequestDto,
  ): Promise<ApproveEntity> {
    return this.studyService.studyRequest(user, studyId);
  }

  // 참여 수락 여부
  @Put(':id/approve/:approveId')
  @UseGuards(AuthGuard)
  async whetherOrNot(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Param('approveId') approveId: string,
    @Body() approveStatus: WhetherOrNotDto,
  ): Promise<ApproveEntity> {
    return this.studyService.whetherOrNot(
      user,
      studyId,
      approveId,
      approveStatus,
    );
  }

  // 스터디룸 R
  @Get(':id/room')
  @UseGuards(AuthGuard)
  async getMyStudyRoom(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
  ) {
    return this.studyService.getStudyRoom(user, studyId);
  }

  // 스터디룸 / 스터디 상태 U
  @Put(':id/studyStatus')
  @UseGuards(AuthGuard)
  async studyStatus(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Body() studyStatus: StudyStatusEnum,
  ): Promise<StudyEntity> {
    return this.studyService.studyStatus(user, studyId, studyStatus);
  }

  // 스터디룸 / 스터디원 출석 현황 R
  @Get(':id/room/memberStatus')
  async memberStatus(@Param('id') studyId: string) {
    return this.studyService.memberStatus(studyId);
  }

  // 스터디룸 / 그룹 목표 시간 C
  @Post(':id/room/targetTime')
  @UseGuards(AuthGuard)
  async targetTimeSet(
    @GetUser() user: UserEntity,
    @Param('id') studyId: string,
    @Body() targetTime: targetTimeSet,
  ): Promise<StudyEntity> {
    return this.studyService.targetTimeSet(user, studyId, targetTime);
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
