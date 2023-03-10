import { CreateDiaryDto } from './../dto/create-diary.dto';
import { PdReadDiaryEntity } from '@app/moinda-pd/read/entity/pd.read.diary.entity';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { StudyStatusDto } from './../dto/setStudyStatus.dto';
import { TargetTimeDto } from './../dto/study-targetTime.dto';
import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { PdReadApproveEntity } from '@app/moinda-pd/read/entity/pd.read.approve.entity';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';

import { IconEnum } from '@app/moinda-pd/entity/enum/study.icon.enum';
import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { StudyStatusEnum } from '../../../../libs/moinda-pd/src/entity/enum/study.status.enum';

import {
  DB_READ_NAME,
  STUDY,
  APPROVE,
  MEMBER,
  DIARY,
} from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';

import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Do } from '@app/moinda/do';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, createQueryBuilder, Repository } from 'typeorm';
import { MemberEntity } from '@app/moinda-pd/entity/memeber.entity';
import { ApproveStatusEnum } from '@app/moinda-pd/entity/enum/aprove.status.enum';

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
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(ApproveEntity)
    private readonly approveRepository: Repository<ApproveEntity>,
    @InjectRepository(PdReadApproveEntity, DB_READ_NAME)
    private readonly pdReadApproveRepository: Repository<PdReadApproveEntity>,
    @InjectRepository(PdReadMemberEntity, DB_READ_NAME)
    private readonly pdReadMemberRepository: Repository<PdReadMemberEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    @InjectRepository(PdReadDiaryEntity, DB_READ_NAME)
    private readonly pdReadDiaryRepository: Repository<PdReadDiaryEntity>,
  ) {}
  //study ??????
  async onCreateStudy(user: UserEntity, dto: any): Promise<StudyEntity> {
    Do.require(!!dto.studyName, '????????? ????????? ??????????????????.');
    Do.require(!!dto.title, '????????? ????????? ??????????????????.');
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('asdfdasf', dto);
    try {
      const study = this.studyRepository.create();
      const member = this.memberRepository.create();
      // const study = new StudyEntity();
      dto.id = this.idService.getId(study);
      const memberId = this.idService.getId(member);
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
      study.hashtag = dto.hashtag;
      study.memberCnt = 1;
      member.studyId = dto.id;
      member.id = memberId;
      member.userId = user.id;
      await queryRunner.manager.save(StudyEntity, study);
      await queryRunner.manager.save(MemberEntity, member);
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
  //study ??????
  async onGetStudy(studyId: string) {
    await this.pdReadStudyRepository.increment({ id: studyId }, 'views', 1);
    Do.require(!!studyId, '???????????? ?????? ??????????????????.');
    return await this.pdReadStudyRepository
      .createQueryBuilder(STUDY)
      .where({ id: studyId })
      .getOne();
  }
  //study ??????
  async updateStudy(user: UserEntity, studyId: string, dto: any) {
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '???????????? ?????? ??????????????????.');
    Do.require(studyId === study.id, '????????? ???????????????.');
    Do.require(study.userId === user.id, '????????? ????????????.');

    study.studyName = dto.studyName;
    study.title = dto.title;
    study.content = dto.content;
    study.icon = dto.icon;
    study.category = dto.category;
    study.startDate = dto.startDate;
    study.targetTime = dto.targetTime;
    study.tel = dto.tel;
    study.studyStatus = dto.studyStatus;
    study.hashtag = dto.hashtag;

    await this.studyRepository.save(study);
    return await this.onGetStudy(study.id);
  }
  //studyList ??????
  async studyList(page: number, take: number, category: string) {
    return await this.pdReadStudyRepository.find({
      where: { category: category },
      order: {
        updatedAt: 'DESC',
      },
      skip: take * (page - 1),
      take: take,
    });
  }
  //study ????????????
  async requestToApprove(studyId: string, user: UserEntity) {
    Do.require(!!studyId, '????????? ???????????????.');
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const approve = this.approveRepository.create();
    const approveId = this.idService.getId(approve);
    try {
      const study = await this.onGetStudy(studyId);
      Do.require(!!study, '????????? ???????????????.');
      approve.id = approveId;
      approve.aproveStatus = ApproveStatusEnum.UNREAD;
      approve.studyId = study.id;
      approve.userId = user.id;
      await queryRunner.manager.save(ApproveEntity, approve);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return this.onGetApprove(approveId);
  }
  //???????????? ????????????
  async onGetApprove(approveId: string) {
    return await this.pdReadApproveRepository
      .createQueryBuilder(APPROVE)
      .where({ id: approveId })
      .getOne();
  }
  //?????? ?????? or ??????
  async acceptOrReject(
    studyId: string,
    approveId: string,
    approveStatus: string,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '????????? ???????????????.');
    Do.require(!!approveId, '????????? ???????????????.');
    const approve = await this.onGetApprove(approveId);
    Do.require(user.id === approve.userId, '????????? ????????????.');
    if (approveStatus === 'APPROVE') {
      approve.aproveStatus = ApproveStatusEnum.APPROVE;
      await this.studyRepository.increment({ id: studyId }, 'memberCnt', 1);
    } else approve.aproveStatus = ApproveStatusEnum.REJECT;
    return await this.approveRepository.save(approve);
  }
  //study ??????????????????
  async setTargetTime(
    studyId: string,
    targetTimeDto: TargetTimeDto,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '????????? ???????????????.');
    Do.require(!!targetTimeDto, '?????? ???????????????.');
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '????????? ???????????????.');
    Do.require(study.userId === user.id, '????????? ????????????.');
    study.targetTime = targetTimeDto.targetTime;
    return await this.studyRepository.save(study);
  }
  //????????? ?????? ???????????? ???????????? ??????
  async onGetMember(studyId: string, userId: string) {
    return await this.pdReadMemberRepository
      .createQueryBuilder(MEMBER)
      .where({ studyId: studyId })
      .where({ userId: userId })
      .getOne();
  }
  //????????? ?????? ????????? ???????????? ??????
  async onGetManyMember(studyId: string) {
    return await this.pdReadMemberRepository
      .createQueryBuilder(MEMBER)
      .where({ studyId: studyId })
      .getMany();
  }
  //??? ????????? ??????
  async onGetRoom(studyId: string, user: UserEntity) {
    Do.require(!!studyId, '????????? ???????????????.');
    const study = await this.onGetStudy(studyId);
    const member = await this.onGetMember(studyId, user.id);
    const members = await this.onGetManyMember(studyId);
    Do.require(!!member, '????????? ????????????.');
    const result = {
      id: study.id,
      hostUserId: study.userId,
      category: study.category,
      studyName: study.studyName,
      icon: study.icon,
      studyStatus: study.studyStatus,
      targetTime: study.targetTime,
      members: members.length,
      hashTags: study.hashtag.split(''),
    };
    return result;
  }
  //study ????????????
  async setStudyStatus(
    studyId: string,
    studyStatusDto: StudyStatusDto,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '????????? ???????????????.');
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '????????? ???????????????.');
    Do.require(study.userId === user.id, '????????? ????????????.');
    study.studyStatus = studyStatusDto.studyStatus;

    return this.studyRepository.save(study);
  }
  //????????? ?????? ===> ui??? ???????????? ???.
  async searchStudy(keyword: string) {
    return await this.pdReadStudyRepository.query(`
    SELECT * FROM STUDY
    WHERE title LIKE '%${keyword}%' and hashtag LIKE '%${keyword}%'
    ORDER BY updatedAt 'DESC'

    `);
  }

  //???????????? ?????? ??????

  //????????? ?????? ??????
  async onCreateDiary(
    studyId: string,
    createDiaryDto: CreateDiaryDto,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '????????? ???????????????.');
    const member = await this.onGetMember(studyId, user.id);
    Do.require(!!member, '????????? ????????????.');
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const diary = this.diaryRepository.create();
    const diaryId = this.idService.getId(diary);
    try {
      diary.id = diaryId;
      diary.content = createDiaryDto.content;
      await queryRunner.manager.save(DiaryEntity, diary);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return this.onGetDiary(diaryId);
  }

  //diary ??????
  async onGetDiary(diaryId: string) {
    return await this.pdReadDiaryRepository
      .createQueryBuilder(DIARY)
      .where({ id: diaryId })
      .getOne();
  }
  //diary list ??????
  async getDiary(
    studyId: string,
    take: number,
    skip: number,
    keyword: string | undefined,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '????????? ???????????????.');
    if (keyword != undefined) {
      return await this.pdReadDiaryRepository.query(
        `SELECT * FROM DIRAY
        WHERE userId = ${user.id} and content LIKE '%${keyword}%'
        LIMIT ${take} * (${skip} - 1), ${take}
        ORDER BY createdAt 'DESC'
        `,
      );
    } else {
      return await this.pdReadDiaryRepository.find({
        where: { userId: user.id },
        order: {
          createdAt: 'DESC',
        },
        skip: take * (skip - 1),
        take: take,
      });
    }
  }

  // ????????? ?????? ????????? ?????? ??????
  async getUserJoinStudyList(userId: string) {
    let studyInfo = {
      study_end: [],
      study_ing: [],
      study_my: [],
    };

    const result = await this.pdReadMemberRepository.find({
      where: { userId: userId },
    });

    const userStudyList = result.map((e) => {
      return e.studyId;
    });

    for (const e of userStudyList) {
      let result = await this.onGetStudy(e);

      // ?????? ?????? ???????????????
      if (result.userId === userId) {
        studyInfo.study_my.push(result);
      }

      if (result.studyStatus === StudyStatusEnum.END) {
        studyInfo.study_end.push(result);
      } else {
        studyInfo.study_ing.push(result);
      }
    }

    return studyInfo;
  }
}
