import { DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skip } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(StudyEntity)
    private readonly studyRepository: Repository<StudyEntity>,
    private readonly idService: IdService,
    @InjectRepository(PdReadStudyEntity, DB_READ_NAME)
    private readonly pdReadStudyRepository: Repository<PdReadStudyEntity>,
  ) {}

  async getNewStudy() {
    return this.pdReadStudyRepository.find({
      order: { createdAt: 'DESC' },
      //   skip: 6,
    });
  }
}
