import { MEMBER } from '@app/moinda-pd/constant.model';
import { MemberEntity } from '@app/moinda-pd/entity/memeber.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { PdReadDiaryEntity } from './pd.read.diary.entity';
import { PdReadRatingEntity } from './pd.read.rating.entity';
import { PdReadStudyEntity } from './pd.read.study.entity';
import { PdReadUserEntity } from './pd.read.user.entity';

@Entity({ name: MEMBER })
export class PdReadMemberEntity extends MemberEntity {
  @ManyToOne(() => PdReadUserEntity, (user) => user.members)
  override user: PdReadUserEntity;

  @ManyToOne(() => PdReadStudyEntity, (study) => study.members)
  override study: PdReadStudyEntity;

  @OneToMany(() => PdReadRatingEntity, (rating) => rating.member)
  override ratings: Promise<PdReadRatingEntity[]>;

  @OneToMany(() => PdReadDiaryEntity, (diary) => diary.member)
  override diaries: Promise<PdReadDiaryEntity[]>;
}
