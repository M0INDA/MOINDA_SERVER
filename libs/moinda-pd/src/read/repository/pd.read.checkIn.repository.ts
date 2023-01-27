import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadCheckInEntity } from '../entity/pd.read.checkIn.entity';

@CustomRepository(PdReadCheckInEntity)
export class PdReadCheckInRepository extends Repository<PdReadCheckInEntity> {}
