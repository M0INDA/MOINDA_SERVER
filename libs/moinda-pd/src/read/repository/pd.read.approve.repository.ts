import { Repository } from 'typeorm';
import { PdReadApproveEntity } from '../entity/pd.read.approve.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadApproveEntity)
export class PdReadApproveRepository extends Repository<PdReadApproveEntity> {}
