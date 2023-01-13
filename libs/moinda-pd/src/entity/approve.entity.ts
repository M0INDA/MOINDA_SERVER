import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { APPROVE } from '../constant.model';
import { MoindaContent } from './content/moinda.content';
import { ApproveStatusEnum } from './enum/aprove.status.enum';
import { StudyEntity } from './study.entity';
import { UserEntity } from './user.entity';

@Entity({ name: APPROVE })
export class ApproveEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @OneToMany(() => StudyEntity, (study) => study.approve)
  studies: Promise<StudyEntity[]>;

  @Column({ type: 'varchar', length: 32, nullable: false })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.approves)
  user: UserEntity;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    default: ApproveStatusEnum.UNREAD,
  })
  aproveStatus: ApproveStatusEnum;
  // 승인 거절 unread=>디폴트
}
