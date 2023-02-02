import { HashtagEntity } from './../../entity/hashtag.entity';
import { HASHTAG } from './../../constant.model';
import { Entity, ManyToOne } from 'typeorm';
import { PdReadStudyEntity } from './pd.read.study.entity';

@Entity({ name: HASHTAG })
export class PdReadHashtagEntity extends HashtagEntity {
  @ManyToOne(() => PdReadStudyEntity, (study) => study.hashtags)
  override study: PdReadStudyEntity;
}
