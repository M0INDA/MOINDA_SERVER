import { Repository } from 'typeorm';
import { ChatEntity } from '../entity/chat.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(ChatEntity)
export class ChatRepository extends Repository<ChatEntity> {}
