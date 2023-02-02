import { RATING } from './../constant.model';
// 유저 총점 엔티티

import { Entity, OneToOne, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { UserEntity } from './user.entity';
import { MemberEntity } from './memeber.entity';

@Entity({ name: RATING })
export class RatingEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  userId?: string;

  @OneToOne(() => UserEntity, (user) => user.ratings)
  user: UserEntity;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  stScore!: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  ndScore!: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  rdScore!: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  thScore!: number;

  @Column({ type: 'varchar', length: 12, nullable: false })
  memberId!: string;

  @ManyToOne(() => MemberEntity, (member) => member.ratings)
  member: MemberEntity;
}
