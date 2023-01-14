import { Repository } from 'typeorm';
import { PdReadStudyEntity } from '../entity/pd.read.study.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadStudyEntity)
export class PdReadStudyRepository extends Repository<PdReadStudyEntity> {}
