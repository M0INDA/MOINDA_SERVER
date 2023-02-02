import { MEMBER } from '@app/moinda-pd/constant.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { DiaryEntity } from './diary.entity';
import { RatingEntity } from './rating.entity';
import { StudyEntity } from './study.entity';
import { UserEntity } from './user.entity';

@Entity({ name: MEMBER })
export class MemberEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.members)
  user: UserEntity;

  @Column({ type: 'varchar', length: 12, nullable: false })
  studyId?: string;

  @ManyToOne(() => StudyEntity, (study) => study.members)
  study: StudyEntity;

  @OneToMany(() => RatingEntity, (rating) => rating.member)
  ratings: Promise<RatingEntity[]>;

  @OneToMany(() => DiaryEntity, (diary) => diary.member)
  diaries: Promise<DiaryEntity[]>;
}
