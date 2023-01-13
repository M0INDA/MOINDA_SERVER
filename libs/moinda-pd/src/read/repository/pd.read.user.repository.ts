import { EntityRepository, Repository } from 'typeorm';
import { PdReadUserEntity } from '../entity/pd.read.user.entity';

@EntityRepository(PdReadUserEntity)
export class PdReadUserRepository extends Repository<PdReadUserEntity> {}
