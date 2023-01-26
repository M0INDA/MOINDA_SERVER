import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadStudyEntity } from '../entity/pd.read.study.entity';

@CustomRepository(PdReadStudyEntity)
export class PdReadStudyRepository extends Repository<PdReadStudyEntity> {}
