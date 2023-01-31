import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadStudyEntity } from '../entity/pd.read.study.entity';

@CustomRepository(PdReadStudyEntity)
export class PdReadStudyRepository extends Repository<PdReadStudyEntity> {
  async onGetStudy(studyId: string): Promise<PdReadStudyEntity> {
    return this.findOne({ where: { id: studyId } });
  }
}
