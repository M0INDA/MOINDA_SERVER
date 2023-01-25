import { CHECKIN } from '@app/moinda-pd/constant.model';
import { CheckInEntity } from '@app/moinda-pd/entity/checkIn.entity';
import { Entity } from 'typeorm';

@Entity({ name: CHECKIN })
export class PdReadCheckInEntity extends CheckInEntity {}
