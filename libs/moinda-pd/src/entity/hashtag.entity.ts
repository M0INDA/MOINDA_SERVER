import { HASHTAG } from './../constant.model';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { StudyEntity } from './study.entity';

@Entity({ name: HASHTAG })
export class HashtagEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  hashtag: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  studyId?: string;

  @ManyToOne(() => StudyEntity, (study) => study.hashtags)
  study: StudyEntity;
}
