import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { STUDY } from '../constant.model';
import { ApproveEntity } from './approve.entity';
import { ChatEntity } from './chat.entity';
import { MoindaContent } from './content/moinda.content';
import { DiaryEntity } from './diary.entity';
import { CategoryEnum } from './enum/study.category.enum';
import { IconEnum } from './enum/study.icon.enum';
import { StudyStatusEnum } from './enum/study.status.enum';

@Entity({ name: STUDY })
export class StudyEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  studyName!: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    default: CategoryEnum.ETC,
  })
  category!: CategoryEnum;
  //카테고리 갯수대로

  @Column({
    type: 'varchar',
    length: 3000,
    nullable: false,
  })
  content!: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    default: StudyStatusEnum.PUBLIC,
  })
  studyStatus!: StudyStatusEnum;
  //모집중 진행중(모집 안할 때) 스터디끝

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  icon: IconEnum;
  //숫자로 관리 1~20

  @Column({ type: 'varchar', length: 12, nullable: true })
  hostUserId?: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  approveId?: string;

  @ManyToOne(() => UserEntity, (user) => user.studies)
  user: UserEntity;

  @ManyToOne(() => ApproveEntity, (approve) => approve.studies)
  approve: ApproveEntity;

  @OneToMany(() => DiaryEntity, (diary) => diary.study)
  diaries: Promise<DiaryEntity[]>;

  @OneToMany(() => ChatEntity, (chat) => chat.study)
  chats: Promise<ChatEntity[]>;
}
