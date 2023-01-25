import { CHAT } from './../constant.model';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { StudyEntity } from './study.entity';
import { UserEntity } from './user.entity';

@Entity({ name: CHAT })
export class ChatEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  studyId!: string;

  @ManyToOne(() => StudyEntity, (study) => study.chats)
  study: StudyEntity;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  user: UserEntity;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  msg!: string;
}
