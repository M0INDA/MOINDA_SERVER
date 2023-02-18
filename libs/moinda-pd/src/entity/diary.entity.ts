import { StudyEntity } from './study.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DIARY } from '../constant.model';
import { MoindaContent } from './content/moinda.content';
import { DiaryImgEntity } from './diaryImg.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';
import { MemberEntity } from './memeber.entity';

@Entity({ name: DIARY })
export class DiaryEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  content!: string;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  likeCnt: number;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId?: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  studyId?: string;

  @ManyToOne(() => UserEntity, (user) => user.diaries)
  user: UserEntity;

  @ManyToOne(() => StudyEntity, (study) => study.diaries)
  study: StudyEntity;

  @OneToMany(() => DiaryImgEntity, (diaryimg) => diaryimg.diary)
  diaryimgs: Promise<DiaryImgEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.diary)
  comments: Promise<CommentEntity[]>;

  @Column({ type: 'varchar', length: 12, nullable: false })
  memberId!: string;

  @ManyToOne(() => MemberEntity, (member) => member.diaries)
  member: MemberEntity;
}
