import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PdReadRatingEntity } from '../entity/pd.read.rating.entity';

@CustomRepository(PdReadRatingEntity)
export class PdReadRatingRepository extends Repository<PdReadRatingEntity> {}
