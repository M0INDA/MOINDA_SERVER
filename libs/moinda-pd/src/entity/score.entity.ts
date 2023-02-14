import { SCORE } from './../constant.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { MoindaContent } from './content/moinda.content';
import { stScoreEnum } from './enum/score.stScore.enum';
import { ndScoreEnum } from './enum/score.ndScore.enum';
import { rdScoreEnum } from './enum/score.rdScore.enum';
import { thScoreEnum } from './enum/score.thScore.enum';
import { UserEntity } from './user.entity';

@Entity({ name: SCORE })
export class ScoreEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  stScore!: stScoreEnum;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  ndScore!: ndScoreEnum;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  rdScore!: rdScoreEnum;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  thScore!: thScoreEnum;

  @Column({ type: 'varchar', length: 12, nullable: true })
  userId?: string;

  @OneToOne(() => UserEntity, (user) => user.scores)
  @JoinColumn([{ name: 'scores', referencedColumnName: 'id' }])
  user: UserEntity;
}
