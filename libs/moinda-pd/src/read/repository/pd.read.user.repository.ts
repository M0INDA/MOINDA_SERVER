import { Repository } from 'typeorm';
import { PdReadUserEntity } from '../entity/pd.read.user.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadUserEntity)
export class PdReadUserRepository extends Repository<PdReadUserEntity> {}
