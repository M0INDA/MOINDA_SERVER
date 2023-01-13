import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MEMBER } from './../constant.model';
import { MoindaContent } from './content/moinda.content';
import { StudyEntity } from './study.entity';
import { UserEntity } from './user.entity';

@Entity({ name: MEMBER })
export class MemberEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.studies)
  user: UserEntity;

  @Column({ type: 'varchar', length: 32, nullable: false })
  studyId!: string;

  @ManyToOne(() => StudyEntity, (study) => study.members)
  study: StudyEntity;
}
