import { ATTENDANCE } from './../constant.model';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { UserEntity } from './user.entity';

@Entity({ name: ATTENDANCE })
export class AttendanceEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'date', nullable: false })
  checkIn: Date;

  @Column({ type: 'date', nullable: false })
  log: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  todayTime: number;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId!: string;

  @OneToOne(() => UserEntity, (user) => user.attendances)
  user: UserEntity;
}
