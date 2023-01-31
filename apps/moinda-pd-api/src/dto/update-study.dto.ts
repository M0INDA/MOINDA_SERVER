import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { IconEnum } from '@app/moinda-pd/entity/enum/study.icon.enum';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudyDto {
  @IsString()
  @IsNotEmpty()
  icon!: IconEnum;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  studyName!: string;

  @IsString()
  @IsNotEmpty()
  category!: CategoryEnum;

  @IsDate()
  startDate!: Date;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
