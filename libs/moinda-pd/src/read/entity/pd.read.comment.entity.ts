import { COMMENT } from '@app/moinda-pd/constant.model';
import { CommentEntity } from '@app/moinda-pd/entity/comment.entity';
import { Entity, ManyToOne } from 'typeorm';
import { PdReadDiaryEntity } from './pd.read.diary.entity';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: COMMENT })
export class PdReadCommentEntity extends CommentEntity {
  @ManyToOne(() => PdReadDiaryEntity, (diary) => diary.comments)
  override diary: PdReadDiaryEntity;

  @ManyToOne(() => PdReadUserEntity, (user) => user.comments)
  override user: PdReadUserEntity;
}
