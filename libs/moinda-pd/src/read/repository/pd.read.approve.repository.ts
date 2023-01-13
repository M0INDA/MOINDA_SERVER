import { EntityRepository, Repository } from 'typeorm';
import { PdReadApproveEntity } from '../entity/pd.read.approve.entity';

@EntityRepository(PdReadApproveEntity)
export class PdReadApproveRepository extends Repository<PdReadApproveEntity> {}
