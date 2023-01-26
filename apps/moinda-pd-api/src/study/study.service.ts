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
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(StudyRepository)
    private readonly studyRepository: StudyRepository,
    private readonly connection: Connection,
    private readonly idService: IdService,
    @InjectRepository(PdReadStudyRepository, DB_READ_NAME)
    private readonly pdReadStudyRepository: PdReadStudyRepository,
  ) {}

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

  async onGetStudy(studyId: string): Promise<StudyEntity> {
    return this.pdReadStudyRepository
      .createQueryBuilder(STUDY)
      .where({ id: studyId })
      .getOne();
  }
}
