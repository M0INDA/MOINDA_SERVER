import { IsNotEmpty, IsString } from 'class-validator';

export class updateDiaryDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
