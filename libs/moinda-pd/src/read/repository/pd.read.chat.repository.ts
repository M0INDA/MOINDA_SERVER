import { EntityRepository, Repository } from 'typeorm';
import { PdReadChatEntity } from '../entity/pd.read.chat.entity';

@EntityRepository(PdReadChatEntity)
export class PdReadChatRepository extends Repository<PdReadChatEntity> {}
