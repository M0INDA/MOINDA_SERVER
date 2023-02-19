import { IsNotEmpty, IsNumber } from 'class-validator';

export class targetTimeSet {
  @IsNumber()
  @IsNotEmpty()
  targetTime!: number;
}
