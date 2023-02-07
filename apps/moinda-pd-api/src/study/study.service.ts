import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';
import { APPROVE, DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Do } from '@app/moinda/do';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdateStudyDto } from '../dto/update-study.dto';
import { CreateDiaryDto } from '../dto/create-diary.dto';
import { ViewsDto } from '../dto/views.dto';
import { MemberEntity } from '@app/moinda-pd/entity/memeber.entity';
import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { PdReadDiaryEntity } from '@app/moinda-pd/read/entity/pd.read.diary.entity';
import { updateDiaryDto } from '../dto/update-diary.dto';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { StudyRequestDto } from '../dto/request-study.dto';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
  ) {}

  // 스터디 개설
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

  // 스터디 목록 R
  async getAllStudy(): Promise<StudyEntity[]> {
    return await this.pdReadStudyRepository.find();
  }

  // 조회수
  async upViews(studyId: string, ip: ViewsDto) {
    if (ip) {
      await this.studyRepository.increment({ id: studyId }, 'views', 1);
      // await getConnection()
      //   .createQueryBuilder()
      //   .update()
      //   .set({ views: () => `views+1` })
      //   .where('id = :id', { id: studyId })
      //   .execute();
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
    // 추가 될 것들 연락수단, 해시태그
    return this.studyRepository.save(study);
  }

  // 스터디 참여 요청
  async studyRequest(
    user: UserEntity,
    studyId: string,
    dto: StudyRequestDto,
  ): Promise<ApproveEntity> {
    const approveId = this.idService.getId(ApproveEntity);
    const studyRequest = this.approveRepository.create({
      id: approveId,
      studyId,
      userId: user.id,
      approveStatus: dto.approveStatus,
    });
    return studyRequest;
  }

  // 참여 수락 여부
  async whetherOrNot(): Promise<ApproveEntity> {
    return;
  }

  // 내 스터디룸 R
  async getMyStudyRoom(
    user: UserEntity,
    studyId: string,
  ): Promise<PdReadStudyEntity> {
    const studyRoom = await this.pdReadStudyRepository.findOne({
      where: { id: studyId },
    });
    Do.require(!!studyRoom, '존재하지 않는 스터디입니다.');

    Do.require(studyRoom.userId == user.id, '현재 참여 중인 스터디가 아닙니다');
    return studyRoom;
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
