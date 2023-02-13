import { CreateDiaryDto } from './../dto/create-diary.dto';
import { PdReadDiaryEntity } from '@app/moinda-pd/read/entity/pd.read.diary.entity';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { StudyStatusDto } from './../dto/setStudyStatus.dto';
import { TargetTimeDto } from './../dto/study-targetTime.dto';
import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { PdReadApproveEntity } from '@app/moinda-pd/read/entity/pd.read.approve.entity';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';

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
  //study 생성
  async onCreateStudy(user: UserEntity, dto: any): Promise<StudyEntity> {
    Do.require(!!dto.studyName, '스터디 이름을 설정해주세요.');
    Do.require(!!dto.title, '스터디 제목을 설정해주세요.');
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
  //study 조회
  async onGetStudy(studyId: string) {
    await this.pdReadStudyRepository.increment({ id: studyId }, 'views', 1);
    Do.require(!!studyId, '존재하지 않는 스터디입니다.');
    return await this.pdReadStudyRepository
      .createQueryBuilder(STUDY)
      .where({ id: studyId })
      .getOne();
  }
  //study 수정
  async updateStudy(user: UserEntity, studyId: string, dto: any) {
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '존재하지 않는 스터디입니다.');
    Do.require(studyId === study.id, '잘못된 요청입니다.');
    Do.require(study.userId === user.id, '권한이 없습니다.');

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
  //studyList 조회
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
  //study 참여요청
  async requestToApprove(studyId: string, user: UserEntity) {
    Do.require(!!studyId, '잘못된 요청입니다.');
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const approve = this.approveRepository.create();
    const approveId = this.idService.getId(approve);
    try {
      const study = await this.onGetStudy(studyId);
      Do.require(!!study, '잘못된 요청입니다.');
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
  //참여요청 가져오기
  async onGetApprove(approveId: string) {
    return await this.pdReadApproveRepository
      .createQueryBuilder(APPROVE)
      .where({ id: approveId })
      .getOne();
  }
  //참여 수락 or 거절
  async acceptOrReject(
    studyId: string,
    approveId: string,
    approveStatus: string,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '잘못된 요청입니다.');
    Do.require(!!approveId, '잘못된 요청입니다.');
    const approve = await this.onGetApprove(approveId);
    Do.require(user.id === approve.userId, '권한이 없습니다.');
    if (approveStatus === 'APPROVE')
      approve.aproveStatus = ApproveStatusEnum.APPROVE;
    else approve.aproveStatus = ApproveStatusEnum.REJECT;
    return await this.approveRepository.save(approve);
  }
  //study 목표시간설정
  async setTargetTime(
    studyId: string,
    targetTimeDto: TargetTimeDto,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '잘못된 요청입니다.');
    Do.require(!!targetTimeDto, '시간 필수입니다.');
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '잘못된 요청입니다.');
    Do.require(study.userId === user.id, '권한이 없습니다.');
    study.targetTime = targetTimeDto.targetTime;
    return await this.studyRepository.save(study);
  }
  //그룹에 속한 유저인지 확인하는 쿼리
  async onGetMember(studyId: string, userId: string) {
    return await this.pdReadMemberRepository
      .createQueryBuilder(MEMBER)
      .where({ studyId: studyId })
      .where({ userId: userId })
      .getOne();
  }
  //그룹에 속한 유저들 확인하는 쿼리
  async onGetManyMember(studyId: string) {
    return await this.pdReadMemberRepository
      .createQueryBuilder(MEMBER)
      .where({ studyId: studyId })
      .getMany();
  }
  //룸 페이지 조회
  async onGetRoom(studyId: string, user: UserEntity) {
    Do.require(!!studyId, '잘못된 요청입니다.');
    const study = await this.onGetStudy(studyId);
    const member = await this.onGetMember(studyId, user.id);
    const members = await this.onGetManyMember(studyId);
    Do.require(!!member, '권한이 없습니다.');
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
  //study 상태변경
  async setStudyStatus(
    studyId: string,
    studyStatusDto: StudyStatusDto,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '잘못된 요청입니다.');
    const study = await this.onGetStudy(studyId);
    Do.require(!!study, '잘못된 요청입니다.');
    Do.require(study.userId === user.id, '권한이 없습니다.');
    study.studyStatus = studyStatusDto.studyStatus;

    return this.studyRepository.save(study);
  }
  //스터디 검색 ===> ui가 안나왔다 함.
  async searchStudy(keyword: string) {
    return await this.pdReadStudyRepository.query(`
    SELECT * FROM STUDY
    WHERE title LIKE '%${keyword}%' and hashtag LIKE '%${keyword}%'
    ORDER BY updatedAt 'DESC'

    `);
  }

  //스터디원 출석 조회

  //스터디 일지 작성
  async onCreateDiary(
    studyId: string,
    createDiaryDto: CreateDiaryDto,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '잘못된 요청입니다.');
    const member = await this.onGetMember(studyId, user.id);
    Do.require(!!member, '권한이 없습니다.');
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

  //diary 상세
  async onGetDiary(diaryId: string) {
    return await this.pdReadDiaryRepository
      .createQueryBuilder(DIARY)
      .where({ id: diaryId })
      .getOne();
  }
  //diary list 조회
  async getDiary(
    studyId: string,
    take: number,
    skip: number,
    keyword: string | undefined,
    user: UserEntity,
  ) {
    Do.require(!!studyId, '잘못된 요청입니다.');
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
}
