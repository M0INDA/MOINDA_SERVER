import { POST } from './../constant.model';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { StudyEntity } from './study.entity';
import { UserEntity } from './user.entity';
import { PostStatusEnum } from './enum/post.status.enum';

@Entity({ name: POST })
export class PostEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 3000,
    nullable: false,
  })
  content!: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  tel: string;

  @Column({
    type: 'int',
    nullable: true,
    default: 0,
  })
  views: number;

  @Column({
    type: 'varchar',
    length: 255,
    array: true,
  })
  hashtag: string[];

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    default: PostStatusEnum.RECRUIT,
  })
  postStatus!: PostStatusEnum;

  @Column({ type: 'varchar', length: 12, nullable: false })
  studyId!: string;

  @ManyToOne(() => StudyEntity, (study) => study.posts)
  study: StudyEntity;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;
}
