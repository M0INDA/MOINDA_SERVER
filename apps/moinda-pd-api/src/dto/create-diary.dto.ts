import { IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  content!: string;
}
