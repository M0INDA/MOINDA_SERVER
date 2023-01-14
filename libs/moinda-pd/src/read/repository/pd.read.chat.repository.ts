import { Repository } from 'typeorm';
import { PdReadChatEntity } from '../entity/pd.read.chat.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadChatEntity)
export class PdReadChatRepository extends Repository<PdReadChatEntity> {}
