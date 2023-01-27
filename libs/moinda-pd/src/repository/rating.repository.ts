import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { RatingEntity } from '../entity/rating.entity';

@CustomRepository(RatingEntity)
export class RatingRepository extends Repository<RatingEntity> {}
