import { MEMBER } from '@app/moinda-pd/constant.model';
import { MemberEntity } from '@app/moinda-pd/entity/member.entity';
import { Entity, ManyToOne } from 'typeorm';
import { PdReadStudyEntity } from './pd.read.study.entity';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: MEMBER })
export class PdReadMemberEntity extends MemberEntity {
  @ManyToOne(() => PdReadUserEntity, (user) => user.studies)
  override user: PdReadUserEntity;

  @ManyToOne(() => PdReadStudyEntity, (study) => study.members)
  override study: PdReadStudyEntity;
}
