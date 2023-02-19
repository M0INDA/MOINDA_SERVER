import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { APPROVE } from '../constant.model';
import { MoindaContent } from './content/moinda.content';
import { ApproveStatusEnum } from './enum/approve.status.enum';
import { StudyEntity } from './study.entity';
import { UserEntity } from './user.entity';

@Entity({ name: APPROVE })
export class ApproveEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  studyId?: string;

  @ManyToOne(() => StudyEntity, (study) => study.approves)
  study: StudyEntity;

  @Column({ type: 'varchar', length: 12, nullable: false })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.approves)
  user: UserEntity;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    default: ApproveStatusEnum.UNREAD,
  })
  approveStatus: ApproveStatusEnum;
  // 승인 거절 unread=>디폴트
}
