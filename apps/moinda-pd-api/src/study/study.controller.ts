import { CreateDiaryDto } from './../dto/create-diary.dto';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { TargetTimeDto } from './../dto/study-targetTime.dto';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
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
import { StudyStatusDto } from '../dto/setStudyStatus.dto';
import { getuid } from 'process';

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
  @Get('new')
  async studyList(
    @Query('category') category: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<StudyEntity[]> {
    return this.studyService.studyList(page, take, category);
  }

  @Post(':id/approve')
  @UseGuards(AuthGuard)
  async requestToApprove(
    @Param('id') studyId: string,
    @GetUser() user: UserEntity,
  ): Promise<ApproveEntity> {
    return this.studyService.requestToApprove(studyId, user);
  }

  @Put(':id/approve/:approveId')
  @UseGuards(AuthGuard)
  async acceptOrReject(
    @Param('id') studyId: string,
    @Param('approveId') approveId: string,
    @Query('approveStatus') approveStatus: string,
    @GetUser() user: UserEntity,
  ): Promise<ApproveEntity> {
    return this.studyService.acceptOrReject(
      studyId,
      approveId,
      approveStatus,
      user,
    );
  }

  @Put(':id/room/tartgetTime')
  @UseGuards(AuthGuard)
  async setTargetTime(
    @Param('id') studyId: string,
    @Body() targetTimeDto: TargetTimeDto,
    @GetUser() user: UserEntity,
  ) {
    return this.studyService.setTargetTime(studyId, targetTimeDto, user);
  }

  @Get(':id/room')
  @UseGuards(AuthGuard)
  async onGetRoom(@Param('id') studyId: string, @GetUser() user: UserEntity) {
    return this.studyService.onGetRoom(studyId, user);
  }

  @Put(':id/studyStatus')
  @UseGuards(AuthGuard)
  async setStudyStatus(
    @Param('id') studyId: string,
    @Body() studyStatusDto: StudyStatusDto,
    @GetUser() user: UserEntity,
  ): Promise<StudyEntity> {
    return this.studyService.setStudyStatus(studyId, studyStatusDto, user);
  }

  //스터디 검색 ===> ui가 안나왔다 함.
  @Get()
  async searchStudy(@Query('keyword') keyword: string): Promise<StudyEntity[]> {
    return this.studyService.searchStudy(keyword);
  }

  //스터디원 출석 조회

  //스터디 일지 작성
  @Post(':id/diary')
  @UseGuards(AuthGuard)
  async onCreateDiary(
    @Param('id') studyId: string,
    @Body() createDiaryDto: CreateDiaryDto,
    @GetUser() user: UserEntity,
  ): Promise<DiaryEntity> {
    return this.studyService.onCreateDiary(studyId, createDiaryDto, user);
  }

  //스터디 일지 리스트 조회
  @Get(':id/diary')
  @UseGuards(AuthGuard)
  async getDiary(
    @Param('id') studyId: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('keyword') keyword: string | undefined,
    @GetUser() user: UserEntity,
  ): Promise<DiaryEntity> {
    return this.studyService.getDiary(studyId, take, skip, keyword, user);
  }
}
