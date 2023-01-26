import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PdReadApproveEntity } from '../entity/pd.read.approve.entity';

@CustomRepository(PdReadApproveEntity)
export class PdReadApproveRepository extends Repository<PdReadApproveEntity> {}
