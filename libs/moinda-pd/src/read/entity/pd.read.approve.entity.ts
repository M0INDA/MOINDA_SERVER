import { ApproveEntity } from '../../entity/approve.entity';
import { APPROVE } from '@app/moinda-pd/constant.model';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { PdReadStudyEntity } from './pd.read.study.entity';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: APPROVE })
export class PdReadApproveEntity extends ApproveEntity {
  @OneToMany(() => PdReadStudyEntity, (study) => study.approve)
  override studies: Promise<PdReadStudyEntity[]>;

  @ManyToOne(() => PdReadUserEntity, (user) => user.approves)
  override user: PdReadUserEntity;
}
