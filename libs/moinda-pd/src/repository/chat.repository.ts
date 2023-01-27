import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { ChatEntity } from '../entity/chat.entity';

@CustomRepository(ChatEntity)
export class ChatRepository extends Repository<ChatEntity> {}
