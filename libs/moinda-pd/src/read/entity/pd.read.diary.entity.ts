import { DiaryEntity } from './../../entity/diary.entity';
import { DIARY } from '@app/moinda-pd/constant.model';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { PdReadUserEntity } from './pd.read.user.entity';
import { PdReadStudyEntity } from './pd.read.study.entity';
import { PdReadDiaryImgEntity } from './pd.read.diaryImg.entity';
import { PdReadCommentEntity } from './pd.read.comment.entity';

@Entity({ name: DIARY })
export class PdReadDiaryEntity extends DiaryEntity {
  @ManyToOne(() => PdReadUserEntity, (user) => user.diaries)
  override user: PdReadUserEntity;

  @ManyToOne(() => PdReadStudyEntity, (study) => study.diaries)
  override study: PdReadStudyEntity;

  @OneToMany(() => PdReadDiaryImgEntity, (diaryimg) => diaryimg.diary)
  override diaryimgs: Promise<PdReadDiaryImgEntity[]>;

  @OneToMany(() => PdReadCommentEntity, (comment) => comment.diary)
  override comments: Promise<PdReadCommentEntity[]>;
}
