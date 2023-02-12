import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';

import { DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';

import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Do } from '@app/moinda/do';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, createQueryBuilder, Repository } from 'typeorm';
import { MemberEntity } from '@app/moinda-pd/entity/memeber.entity';

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
  ) {}

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

  async onGetStudy(studyId: string) {
    Do.require(!!studyId, '존재하지 않는 스터디입니다.');
    return await this.pdReadStudyRepository
      .createQueryBuilder(STUDY)
      .where({ id: studyId })
      .getOne();
  }

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

    return await this.studyRepository.save(study);
  }

  async studyList(page: number, take: number, category: string) {
    return await this.pdReadStudyRepository.find({
      where: { category: category },
      order: {
        updatedAt: 'DESC',
      },
      skip: page,
      take: take * (page - 1),
    });
  }
}
