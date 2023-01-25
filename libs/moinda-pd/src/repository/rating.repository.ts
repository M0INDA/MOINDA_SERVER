import { Repository } from 'typeorm';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';
import { RatingEntity } from '../entity/rating.entity';

@CustomRepository(RatingEntity)
export class RatingRepository extends Repository<RatingEntity> {}
