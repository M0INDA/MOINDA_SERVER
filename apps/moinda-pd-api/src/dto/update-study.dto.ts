import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { IconEnum } from '@app/moinda-pd/entity/enum/study.icon.enum';
import { StudyStatusEnum } from '@app/moinda-pd/entity/enum/study.status.enum';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsInt()
  @IsNotEmpty()
  targetTime!: number;

  @IsString()
  @IsNotEmpty()
  tel!: string;

  @IsString()
  @IsNotEmpty()
  studyStatus!: StudyStatusEnum;
}
