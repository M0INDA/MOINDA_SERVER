import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CHECKIN } from './../constant.model';
import { MoindaContent } from './content/moinda.content';

@Entity({ name: CHECKIN })
export class CheckInEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  checkIn: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  checkOut: Date;
}
// 유저 엔티티 받아와야하고 , 추가적으로 회의 후 작성예정
