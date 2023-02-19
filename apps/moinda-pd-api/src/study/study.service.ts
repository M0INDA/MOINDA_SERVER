import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';
import { DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Do } from '@app/moinda/do';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { UpdateStudyDto } from '../dto/update-study.dto';
import { CreateDiaryDto } from '../dto/create-diary.dto';
import { ViewsDto } from '../dto/views.dto';
import { MemberEntity } from '@app/moinda-pd/entity/memeber.entity';
import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { PdReadDiaryEntity } from '@app/moinda-pd/read/entity/pd.read.diary.entity';
import { updateDiaryDto } from '../dto/update-diary.dto';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { StudyStatusEnum } from '@app/moinda-pd/entity/enum/study.status.enum';
import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { PdReadUserEntity } from '@app/moinda-pd/read/entity/pd.read.user.entity';
import { ApproveStatusEnum } from '@app/moinda-pd/entity/enum/approve.status.enum';
import { PdReadApproveEntity } from '@app/moinda-pd/read/entity/pd.read.approve.entity';
import { targetTimeSet } from '../dto/targetTime-set.dto';
import { WhetherOrNotDto } from '../dto/whetherOrNot.dto';
import { PdReadCheckInEntity } from '@app/moinda-pd/read/entity/pd.read.checkIn.entity';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyEntity)
    private readonly studyRepository: Repository<StudyEntity>,
    private readonly connection: Connection,
    private readonly idService: IdService,
    @InjectRepository(PdReadStudyEntity, DB_READ_NAME)
    private readonly pdReadStudyRepository: Repository<PdReadStudyEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    @InjectRepository(PdReadDiaryEntity, DB_READ_NAME)
    private readonly pdReadDiaryRepository: Repository<PdReadDiaryEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(PdReadMemberEntity, DB_READ_NAME)
    private readonly pdReadMemberRepository: Repository<PdReadMemberEntity>,
    @InjectRepository(ApproveEntity)
    private readonly approveRepository: Repository<ApproveEntity>,
    @InjectRepository(PdReadApproveEntity, DB_READ_NAME)
    private readonly pdReadApproveRepository: Repository<PdReadApproveEntity>,
    @InjectRepository(PdReadCheckInEntity, DB_READ_NAME)
    private readonly pdReadCheckInRepository: Repository<PdReadCheckInEntity>,
  ) {}

  // 스터디 검색

  // 스터디 개설 C
  async onCreateStudy(user: UserEntity, dto: any): Promise<StudyEntity> {
    Do.require(!!dto.studyName, '스터디 이름을 설정해주세요.');
    Do.require(!!dto.title, '스터디 제목을 설정해주세요.');
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const study = this.studyRepository.create();
      dto.id = this.idService.getId(study);
      // try {
      console.log(user.id, 'user.id');
      study.id = dto.id;
      study.studyName = dto.studyName;
      study.title = dto.title;
      study.content = dto.content;
      study.icon = dto.icon;
      study.userId = user.id;
      study.category = dto.category;
      study.startDate = dto.startDate;
      study.targetTime = dto.targetTime;
      study.tel = dto.tel;
      study.studyStatus = dto.studyStatus;
      console.log(study, '1111111');
      await queryRunner.manager.save(StudyEntity, study);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return this.onGetStudy(dto.id);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  // 최신글 스터디 목록 R
  async getNewStudy(category: CategoryEnum): Promise<StudyEntity[]> {
    return await this.pdReadStudyRepository.find({
      where: { category },
      order: { updatedAt: 'DESC' },
    });
  }

  // 추천 스터디 목록 R
  async getBestStudy(category: CategoryEnum): Promise<StudyEntity[]> {
    return await this.pdReadStudyRepository.find({
      where: { category },
      order: { views: 'DESC' },
      take: 2,
    });
  }

  // 조회수
  async upViews(studyId: string, ip: ViewsDto) {
    if (ip) {
      await this.studyRepository.increment({ id: studyId }, 'views', 1);
    } else if (!ip) {
      return;
    }
  }

  // 스터디 상세 페이지 R
  async onGetStudy(studyId: string): Promise<StudyEntity> {
    const study = await this.pdReadStudyRepository
      .createQueryBuilder(STUDY)
      .where({ id: studyId })
      .getOne();
    Do.require(!!study, '존재하지 않는 스터디입니다.');
    return study;
  }

  // 스터디 상세 페이지 U
  async updateStudy(
    user: UserEntity,
    studyId: string,
    dto: UpdateStudyDto,
  ): Promise<StudyEntity> {
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '존재하지 않는 스터디입니다.');
    Do.require(study.userId == user.id, '스터디 게시글 작성자가 아닙니다');

    study.icon = dto.icon;
    study.title = dto.title;
    study.studyName = dto.studyName;
    study.category = dto.category;
    study.startDate = dto.startDate;
    study.content = dto.content;
    study.targetTime = dto.targetTime;
    study.tel = dto.tel;
    study.studyStatus = dto.studyStatus;
    // 추가 될 것 해시태그
    return await this.studyRepository.save(study);
  }

  // 스터디 참여 요청
  async studyRequest(
    user: UserEntity,
    studyId: string,
    // dto: StudyRequestDto,
  ): Promise<ApproveEntity> {
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '존재하지 않는 스터디입니다.');
    // 이미 거부된 사람 예외 처리
    const alreadyRejected = await this.approveRepository.findOne({
      where: { userId: user.id, studyId },
    });
    console.log('ㅇㅇㅇ');
    // Do.require(
    //   alreadyRejected.approveStatus === ApproveStatusEnum.REJECT,
    //   '이미 승인이 거부된 스터디입니다.',
    // );
    console.log('왜왜');
    // 이미 신청한 사람 예외 처리
    const alreadyApplied = await this.approveRepository.find({
      where: { userId: user.id, studyId },
    });
    Do.require(!alreadyApplied.length, '이미 신청하였습니다.');

    const studyRequest = this.approveRepository.create();
    const approveId = this.idService.getId(studyRequest);
    studyRequest.id = approveId;
    studyRequest.studyId = studyId;
    studyRequest.userId = user.id;
    studyRequest.approveStatus = ApproveStatusEnum.UNREAD;

    return await this.approveRepository.save(studyRequest);
  }

  // 참여 수락 여부
  async whetherOrNot(
    user: UserEntity,
    studyId: string,
    approveId: string,
    approveStatus: WhetherOrNotDto,
  ): Promise<ApproveEntity> {
    const status = await this.pdReadApproveRepository.findOne({
      where: { id: approveId, studyId },
    });
    const study = await this.onGetStudy(studyId);
    Do.require(user.id === study.userId, '관리 권한이 없습니다');
    // Do.require(
    //   status.approveStatus === ApproveStatusEnum.REJECT,
    //   '이미 거부된 신청입니다',
    // );
    if (approveStatus.approveStatus === ApproveStatusEnum.APPROVE) {
      status.approveStatus = ApproveStatusEnum.APPROVE;
      const memberCreate = this.memberRepository.create();
      const memberId = this.idService.getId(memberCreate);
      memberCreate.id = memberId;
      memberCreate.studyId = studyId;
      memberCreate.userId = status.userId;
      await this.memberRepository.save(memberCreate);
    }
    if (approveStatus.approveStatus === ApproveStatusEnum.REJECT)
      status.approveStatus = ApproveStatusEnum.REJECT;

    return await this.approveRepository.save(status);
  }

  // 스터디 룸 검색
  // async studyRoomSearch() {
  // }

  // 스터디룸 R
  async getStudyRoom(user: UserEntity, studyId: string) {
    const studyRoomFind = await this.pdReadStudyRepository.findOne({
      where: { id: studyId },
      relations: ['members'],
      select: ['id', 'studyName', 'userId'],
    });
    const StudyRoom = {
      id: studyRoomFind.id,
      hostUserId: studyRoomFind.userId,
      category: studyRoomFind.category,
      studyName: studyRoomFind.studyName,
      icon: studyRoomFind.icon,
      studyStatus: studyRoomFind.studyStatus,
      targetTime: studyRoomFind.targetTime,
      members: (await studyRoomFind.members).length,
      // hashTags
    };
    console.log(studyRoomFind);
    Do.require(!!studyRoomFind, '존재하지 않는 스터디입니다.');
    Do.require(
      studyRoomFind.userId == user.id,
      '현재 참여 중인 스터디가 아닙니다',
    );
    return StudyRoom;
  }

  // 내 스터디룸 R
  async getMyStudyRoom(
    user: UserEntity,
    studyId: string,
  ): Promise<StudyEntity> {
    const studyRoom = await this.pdReadStudyRepository.findOne({
      where: { id: studyId },
    });
    Do.require(!!studyRoom, '존재하지 않는 스터디입니다.');
    Do.require(studyRoom.userId == user.id, '현재 참여 중인 스터디가 아닙니다');
    return studyRoom;
  }

  // 스터디룸 / 스터디 상태 U
  async studyStatus(
    user: UserEntity,
    studyId: string,
    studyStatus: StudyStatusEnum,
  ) {
    const myStudy = await this.getMyStudyRoom(user, studyId);
    Do.require(myStudy.userId == user.id, '수정할 권한이 없습니다');

    myStudy.studyStatus = studyStatus;
    return await this.studyRepository.save(myStudy);
  }

  // 스터디원 출석 현황 R
  async memberStatus(studyId: string) {
    const studyMember = await this.pdReadMemberRepository.find({
      where: { studyId },
      relations: ['user'],
    });
    // 테이블 어떻게 되는 건지 확인 후에 코드 작성
    const checkInTime = await this.pdReadCheckInRepository.find({
      where: {},
    });
    const memberStatus = studyMember.map((a) => {
      return {
        id: a.studyId,
        userId: a.user.id,
        nickname: a.user.nickname,
        avatarImg: a.user.avatarImg,
        checkIn: 1,
        todayTime: 1,
      };
    });
    return memberStatus;
  }

  // 그룹 목표 시간 C
  async targetTimeSet(
    user: UserEntity,
    studyId: string,
    targetTime: targetTimeSet,
  ): Promise<StudyEntity> {
    const study = await this.pdReadStudyRepository.findOne({
      where: { id: studyId },
    });
    Do.require(study.userId == user.id, '관리자만 설정할 수 있습니다.');
    study.targetTime = targetTime.targetTime;
    return await this.studyRepository.save(study);
  }

  // 스터디 일지 C
  async createDiary(
    user: UserEntity,
    studyId: string,
    dto: CreateDiaryDto,
  ): Promise<DiaryEntity> {
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '존재하지 않는 스터디입니다.');

    const diary = this.diaryRepository.create();
    const dtoId = this.idService.getId(diary);
    const member = await this.pdReadMemberRepository.findOne({
      where: { userId: user.id, studyId },
    });
    Do.require(!!member, '현재 참여 중인 스터디가 아닙니다');

    diary.id = dtoId;
    diary.content = dto.content;
    diary.userId = user.id;
    diary.studyId = studyId;
    diary.memberId = member.id;
    return diary;
  }

  // 스터디 일지 R
  async getDiary(user: UserEntity, studyId: string): Promise<DiaryEntity[]> {
    Do.require(!!studyId, '존재하지 않는 스터디입니다.');
    await this.getMyStudyRoom(user, studyId);

    return await this.pdReadDiaryRepository.find({
      where: { studyId },
    });
  }

  // 스터디 일지 R
  async getMyDiary(
    user: UserEntity,
    studyId: string,
    diaryId: string,
  ): Promise<DiaryEntity> {
    // Do.require(!!studyId, '존재하지 않는 스터디입니다.');
    await this.getMyStudyRoom(user, studyId);

    return await this.pdReadDiaryRepository.findOne({
      where: { id: diaryId, studyId, userId: user.id },
    });
  }

  // 스터디 일지 U
  async updateDiary(
    user: UserEntity,
    studyId: string,
    diaryId: string,
    dto: updateDiaryDto,
  ): Promise<DiaryEntity> {
    Do.require(!!studyId, '존재하지 않는 스터디입니다.');

    const diary = await this.getMyDiary(user, studyId, diaryId);
    Do.require(!!diary, '존재하지 않는 일지입니다.');
    diary.content = dto.content;

    return this.diaryRepository.save(diary);
  }

  // 스터디 일지 D
  async deleteDiary(
    user: UserEntity,
    studyId: string,
    diaryId: string,
  ): Promise<DiaryEntity> {
    Do.require(!!studyId, '존재하지 않는 스터디입니다.');

    const diary = await this.getMyDiary(user, studyId, diaryId);
    Do.require(!!diary, '이미 삭제된 일지입니다.');

    await this.diaryRepository.softDelete({
      id: diaryId,
      studyId,
      userId: user.id,
    });
    return;
  }
}

// import { Handler, Context } from 'aws-lambda';
// import { Server } from 'http';
// import { createServer, proxy } from 'aws-serverless-express';
// import { eventContext } from 'aws-serverless-express/middleware';

// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import { AppModule } from './app.module';

// // const express = require('express');
// import express from 'express';

// // NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// // due to a compressed response (e.g. gzip) which has not been handled correctly
// // by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// // binaryMimeTypes below
// const binaryMimeTypes: string[] = [];

// let cachedServer: Server;

// async function bootstrapServer(): Promise<Server> {
//   if (!cachedServer) {
//     const expressApp = express();
//     const nestApp = await NestFactory.create(
//       AppModule,
//       new ExpressAdapter(expressApp),
//     );
//     nestApp.use(eventContext());
//     await nestApp.init();
//     cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
//   }
//   return cachedServer;
// }

// export const handler: Handler = async (event: any, context: Context) => {
//   cachedServer = await bootstrapServer();
//   return proxy(cachedServer, event, context, 'PROMISE').promise;
// };
