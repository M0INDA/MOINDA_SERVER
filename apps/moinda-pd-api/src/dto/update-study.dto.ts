import { CategoryEnum } from '@app/moinda-pd/entity/enum/study.category.enum';
import { IconEnum } from '@app/moinda-pd/entity/enum/study.icon.enum';
import { StudyStatusEnum } from '@app/moinda-pd/entity/enum/study.status.enum';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateStudyDto {
  @IsString()
  studyName!: string;

  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  icon!: IconEnum;

  @IsString()
  category!: CategoryEnum;

  @Type(() => Date)
  @IsDate()
  // @IsDateString({ strict: true } as any)
  startDate!: Date;

  @IsString()
  studyStatus: StudyStatusEnum;

  @IsNumber()
  targetTime?: number;

  @IsString()
  tel?: string | null;

  @IsString()
  hashtag!: string;
}
