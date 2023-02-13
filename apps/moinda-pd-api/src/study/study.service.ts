import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { PdReadApproveEntity } from '@app/moinda-pd/read/entity/pd.read.approve.entity';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';

import { DB_READ_NAME, STUDY, APPROVE } from '@app/moinda-pd/constant.model';
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
}
