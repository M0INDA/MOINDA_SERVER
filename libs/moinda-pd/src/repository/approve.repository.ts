import { EntityRepository, Repository } from 'typeorm';
import { ApproveEntity } from '../entity/approve.entity';

@EntityRepository(ApproveEntity)
export class ApproveRepository extends Repository<ApproveEntity> {}
