import { RatingEntity } from './../../entity/rating.entity';
import { RATING } from '@app/moinda-pd/constant.model';
import { Entity, OneToOne } from 'typeorm';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: RATING })
export class PdReadRatingEntity extends RatingEntity {
  @OneToOne(() => PdReadUserEntity, (user) => user.ratings)
  override user: PdReadUserEntity;
}
