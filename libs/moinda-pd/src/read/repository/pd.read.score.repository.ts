import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PdReadScoreEntity } from '../entity/pd.read.score.entity';

@CustomRepository(PdReadScoreEntity)
export class PdReadScoreRepository extends Repository<PdReadScoreEntity> {}
