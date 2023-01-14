import { Repository } from 'typeorm';
import { ApproveEntity } from '../entity/approve.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(ApproveEntity)
export class ApproveRepository extends Repository<ApproveEntity> {}
