import { Repository } from 'typeorm';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';
import { CheckInEntity } from '../entity/checkIn.entity';

@CustomRepository(CheckInEntity)
export class CheckInRepository extends Repository<CheckInEntity> {}
