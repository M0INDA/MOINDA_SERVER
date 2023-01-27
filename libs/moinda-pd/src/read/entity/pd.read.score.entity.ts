import { SCORE } from '@app/moinda-pd/constant.model';
import { ScoreEntity } from '@app/moinda-pd/entity/score.entity';
import { Entity, ManyToOne } from 'typeorm';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: SCORE })
export class PdReadScoreEntity extends ScoreEntity {
  @ManyToOne(() => PdReadUserEntity, (user) => user.scores)
  override user: PdReadUserEntity;
}
