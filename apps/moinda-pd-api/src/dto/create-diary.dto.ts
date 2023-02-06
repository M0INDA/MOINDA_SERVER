import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  id!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
