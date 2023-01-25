import { COMMENT } from './../constant.model';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Entity({ name: COMMENT })
export class CommentEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  content!: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  diaryId?: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.comments)
  diary: DiaryEntity;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;
}
