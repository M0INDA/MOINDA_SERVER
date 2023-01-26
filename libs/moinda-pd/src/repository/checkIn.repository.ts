import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { CheckInEntity } from '../entity/checkIn.entity';

@CustomRepository(CheckInEntity)
export class CheckInRepository extends Repository<CheckInEntity> {}
