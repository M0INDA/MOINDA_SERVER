import { STUDY } from '@app/moinda-pd/constant.model';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { StudyEntity } from './../../entity/study.entity';
import { PdReadApproveEntity } from './pd.read.approve.entity';
import { PdReadChatEntity } from './pd.read.chat.entity';
import { PdReadDiaryEntity } from './pd.read.diary.entity';
import { PdReadMemberEntity } from './pd.read.member.entity';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: STUDY })
export class PdReadStudyEntity extends StudyEntity {
  @ManyToOne(() => PdReadUserEntity, (user) => user.studies)
  override user: PdReadUserEntity;

  @OneToMany(() => PdReadMemberEntity, (member) => member.study)
  override members: Promise<PdReadMemberEntity[]>;

  @ManyToOne(() => PdReadApproveEntity, (approve) => approve.studies)
  override approve: PdReadApproveEntity;

  @OneToMany(() => PdReadDiaryEntity, (diary) => diary.study)
  override diaries: Promise<PdReadDiaryEntity[]>;

  @OneToMany(() => PdReadChatEntity, (chat) => chat.study)
  override chats: Promise<PdReadChatEntity[]>;
}
