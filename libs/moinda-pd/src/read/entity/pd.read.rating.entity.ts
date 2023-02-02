import { RatingEntity } from './../../entity/rating.entity';
import { RATING } from '@app/moinda-pd/constant.model';
import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { PdReadUserEntity } from './pd.read.user.entity';
import { PdReadMemberEntity } from './pd.read.member.entity';

@Entity({ name: RATING })
export class PdReadRatingEntity extends RatingEntity {
  @OneToOne(() => PdReadUserEntity, (user) => user.ratings)
  override user: PdReadUserEntity;

  @ManyToOne(() => PdReadMemberEntity, (member) => member.ratings)
  override member: PdReadMemberEntity;
}
