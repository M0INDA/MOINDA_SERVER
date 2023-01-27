import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadChatEntity } from '../entity/pd.read.chat.entity';

@CustomRepository(PdReadChatEntity)
export class PdReadChatRepository extends Repository<PdReadChatEntity> {}
