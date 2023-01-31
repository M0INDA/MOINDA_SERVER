import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';
import { IconEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.icon.enum';
import { DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { PdReadStudyRepository } from '@app/moinda-pd/read/repository/pd.read.study.repository';
import { StudyRepository } from '@app/moinda-pd/repository/study.repository';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Do } from '@app/moinda/do';
import { Injectable } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdateStudyDto } from '../dto/update-study.dto';
import { CreateDiaryDto } from '../dto/create-diary.dto';

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
      study.id = dto.id;
      study.studyName = dto.studyName;
      study.title = dto.title;
      study.content = dto.content;
      study.icon = IconEnum.ONE;
      study.hostUserId = user.id;
      study.category = CategoryEnum.ETC;
      study.startDate = dto.startDate;
      await queryRunner.manager.save(StudyEntity, study);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return this.onGetStudy(dto.id);
  }

  // 스터디 목록 R
  async getAllStudy(): Promise<StudyEntity[]> {
    return await this.pdReadStudyRepository.find();
  }

  // 스터디 상세 페이지 R
  async onGetStudy(studyId: string): Promise<StudyEntity> {
    return this.pdReadStudyRepository
      .createQueryBuilder(STUDY)
      .where({ id: studyId })
      .getOne();
  }

  // 스터디 상세 페이지 U
  async updateStudy(
    user: UserEntity,
    studyId: string,
    dto: UpdateStudyDto,
  ): Promise<StudyEntity> {
    Do.require(!!studyId, '존재하지 않는 스터디입니다.');

    const study = await this.onGetStudy(studyId);
    if (study.hostUserId === user.id)
      throw new HttpException(
        '스터디 게시글 작성자가 아닙니다',
        HttpStatus.FORBIDDEN,
      );

    study.icon = dto.icon;
    study.title = dto.title;
    study.studyName = dto.studyName;
    study.category = dto.category;
    study.startDate = dto.startDate;
    study.content = dto.content;
    // 추가 될 것들 연락수단, 해시태그
    return this.studyRepository.save(study);
  }

  // 내 스터디룸 R
  async getMyStudyRoom(
    user: UserEntity,
    studyId: string,
  ): Promise<StudyEntity> {
    const studyRoom = this.pdReadStudyRepository.find({
      where: { id: studyId },
    });

    return; // 여기
  }

  // 스터디 일지 C
  async createDiary(
    user: UserEntity,
    studyId: string,
    dto: CreateDiaryDto,
  ): Promise<DiaryEntity> {
    return;
  }

  // 스터디 일지 R
  async getDiary(studyId: string, diaryId: string, page): Promise<DiaryEntity> {
    return;
  }

  // 스터디 일지 U
  async updateDiary(studyId: string, diaryId: string): Promise<DiaryEntity> {
    return;
  }

  // 스터디 일지 D
  async deleteDiary(studyId: string, diaryId: string): Promise<DiaryEntity> {
    return;
  }
}
