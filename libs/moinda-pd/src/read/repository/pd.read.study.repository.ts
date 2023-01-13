import { EntityRepository, Repository } from 'typeorm';
import { PdReadStudyEntity } from '../entity/pd.read.study.entity';

@EntityRepository(PdReadStudyEntity)
export class PdReadStudyRepository extends Repository<PdReadStudyEntity> {}
