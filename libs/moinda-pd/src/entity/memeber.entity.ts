import { MEMBER } from '@app/moinda-pd/constant.model';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
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
}
