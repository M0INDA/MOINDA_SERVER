import { Entity, PrimaryColumn } from 'typeorm';
import { USER } from '../constant.model';
import { MoindaContent } from './content/moinda.content';

@Entity({ name: USER })
export class UserEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;
}
