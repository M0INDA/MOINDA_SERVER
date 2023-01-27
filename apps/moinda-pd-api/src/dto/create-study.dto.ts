import { CategoryEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.category.enum';
import { IconEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.icon.enum';
import { IsDate, IsString } from 'class-validator';

export class CreateStudyDto {
  @IsString()
  name!: string;

  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  icon!: IconEnum;

  @IsString()
  category!: CategoryEnum;

  @IsDate()
  startDate!: Date;
}

// study.studyName = dto.studyName;
//       study.title = dto.title;
//       study.content = dto.content;
//       study.icon = IconEnum.ONE;
//       study.hostUserId = user.id;
//       study.category = CategoryEnum.ETC;
//       study.startDate = dto.startDate;
