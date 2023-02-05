import { CategoryEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.category.enum';
import { IconEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.icon.enum';
import {
  IsDataURI,
  IsDate,
  IsDateString,
  IsInt,
  IsISO8601,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudyStatusEnum } from '@app/moinda-pd/entity/enum/study.status.enum';

export class CreateStudyDto {
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

  @IsInt()
  targetTime!: number;

  @IsString()
  tel!: string;

  @IsString()
  studyStatus!: StudyStatusEnum;
}

// study.studyName = dto.studyName;
//       study.title = dto.title;
//       study.content = dto.content;
//       study.icon = IconEnum.ONE;
//       study.hostUserId = user.id;
//       study.category = CategoryEnum.ETC;
//       study.startDate = dto.startDate;
