import { USER } from '@app/moinda-pd/constant.model';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import { PdReadApproveEntity } from './pd.read.approve.entity';
import { PdReadAttendanceEntity } from './pd.read.attendance.entity';
import { PdReadChatEntity } from './pd.read.chat.entity';
import { PdReadCommentEntity } from './pd.read.comment.entity';
import { PdReadDiaryEntity } from './pd.read.diary.entity';
import { PdReadMemberEntity } from './pd.read.member.entity';
import { PdReadRatingEntity } from './pd.read.rating.entity';
import { PdReadScoreEntity } from './pd.read.score.entity';
import { PdReadStudyEntity } from './pd.read.study.entity';

@Entity({ name: USER })
export class PdReadUserEntity extends UserEntity {
  @OneToMany(() => PdReadStudyEntity, (study) => study.user)
  override studies: Promise<PdReadStudyEntity[]>;

  @OneToMany(() => PdReadApproveEntity, (approve) => approve.user)
  override approves: Promise<PdReadApproveEntity[]>;

  @OneToMany(() => PdReadDiaryEntity, (diary) => diary.user)
  override diaries: Promise<PdReadDiaryEntity[]>;

  @OneToMany(() => PdReadCommentEntity, (comment) => comment.user)
  override comments: Promise<PdReadCommentEntity[]>;

  @OneToMany(() => PdReadChatEntity, (chat) => chat.user)
  override chats: Promise<PdReadChatEntity[]>;

  @OneToOne(() => PdReadRatingEntity, (rating) => rating.user)
  override ratings: Promise<PdReadRatingEntity[]>;

  @OneToMany(() => PdReadScoreEntity, (score) => score.user)
  override scores: Promise<PdReadScoreEntity[]>;

  @OneToMany(() => PdReadMemberEntity, (member) => member.user)
  override members: Promise<PdReadMemberEntity[]>;

  @OneToMany(() => PdReadAttendanceEntity, (attendance) => attendance.user)
  override attendances: Promise<PdReadAttendanceEntity[]>;
}
