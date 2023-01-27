import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { ApproveEntity } from '../entity/approve.entity';

@CustomRepository(ApproveEntity)
export class ApproveRepository extends Repository<ApproveEntity> {}
