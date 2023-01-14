import { StudyEntity } from './study.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { USER } from '../constant.model';
import { MoindaContent } from './content/moinda.content';
import { MemberEntity } from './member.entity';
import { ApproveEntity } from './approve.entity';
import { DiaryEntity } from './diary.entity';
import { CommentEntity } from './comment.entity';
import { ChatEntity } from './chat.entity';
import { UserProviderEnum } from './enum/user.provider.enum';

@Entity({ name: USER })
export class UserEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  nickname!: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  refreshToken?: string | undefined;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  avatarImg?: string | undefined;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    default: UserProviderEnum.LOCAL,
  })
  provider: UserProviderEnum;
  //소셜로그인 하는거 갯수만큼 / 로컬 => 디폴트

  @OneToMany(() => StudyEntity, (study) => study.user)
  studies: Promise<StudyEntity[]>;

  @OneToMany(() => MemberEntity, (member) => member.user)
  members: Promise<MemberEntity[]>;

  @OneToMany(() => ApproveEntity, (approve) => approve.user)
  approves: Promise<ApproveEntity[]>;

  @OneToMany(() => DiaryEntity, (diary) => diary.user)
  diaries: Promise<DiaryEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: Promise<CommentEntity[]>;

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chats: Promise<ChatEntity[]>;
}
