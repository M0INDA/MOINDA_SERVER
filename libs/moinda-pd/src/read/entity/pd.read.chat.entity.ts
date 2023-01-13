import { ChatEntity } from './../../entity/chat.entity';
import { CHAT } from '@app/moinda-pd/constant.model';
import { Entity, ManyToOne } from 'typeorm';
import { PdReadStudyEntity } from './pd.read.study.entity';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: CHAT })
export class PdReadChatEntity extends ChatEntity {
  @ManyToOne(() => PdReadStudyEntity, (study) => study.chats)
  override study: PdReadStudyEntity;

  @ManyToOne(() => PdReadUserEntity, (user) => user.chats)
  override user: PdReadUserEntity;
}
