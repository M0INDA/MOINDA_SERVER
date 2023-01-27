import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadUserEntity } from '../entity/pd.read.user.entity';

@CustomRepository(PdReadUserEntity)
export class PdReadUserRepository extends Repository<PdReadUserEntity> {}
