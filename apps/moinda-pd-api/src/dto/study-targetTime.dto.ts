import { IsNumber } from 'class-validator';

export class TargetTimeDto {
  @IsNumber()
  targetTime!: number;
}
