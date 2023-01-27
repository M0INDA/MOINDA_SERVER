import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { ScoreEntity } from '../entity/score.entity';

@CustomRepository(ScoreEntity)
export class ScoreRepository extends Repository<ScoreEntity> {}
