import { Repository } from 'typeorm';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';
import { ScoreEntity } from '../entity/score.entity';

@CustomRepository(ScoreEntity)
export class ScoreRepository extends Repository<ScoreEntity> {}
