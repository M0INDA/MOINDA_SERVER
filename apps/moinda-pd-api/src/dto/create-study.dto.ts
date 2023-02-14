import { StudyStatusEnum } from '@app/moinda-pd/entity/enum/study.status.enum';
import { CategoryEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.category.enum';
import { IconEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.icon.enum';
import {
  IsDataURI,
  IsDate,
  IsDateString,
  IsInt,
  IsISO8601,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsNumber()
  targetTime?: number | 0;

  @IsString()
  tel?: string | null;

  @IsString()
  hashtag!: string;
}

// study.studyName = dto.studyName;
//       study.title = dto.title;
//       study.content = dto.content;
//       study.icon = IconEnum.ONE;
//       study.hostUserId = user.id;
//       study.category = CategoryEnum.ETC;
//       study.startDate = dto.startDate;
