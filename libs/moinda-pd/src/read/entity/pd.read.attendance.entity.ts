import { AttendanceEntity } from './../../entity/attendance.entity';
import { ATTENDANCE } from './../../constant.model';
import { Entity, ManyToOne } from 'typeorm';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: ATTENDANCE })
export class PdReadAttendanceEntity extends AttendanceEntity {
  @ManyToOne(() => PdReadUserEntity, (user) => user.attendances)
  override user: PdReadUserEntity;
}
