import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
