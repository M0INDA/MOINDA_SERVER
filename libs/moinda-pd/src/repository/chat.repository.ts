import { EntityRepository, Repository } from 'typeorm';
import { ChatEntity } from '../entity/chat.entity';

@EntityRepository(ChatEntity)
export class ChatRepository extends Repository<ChatEntity> {}
