import { StudyStatusEnum } from './../../../../libs/moinda-pd/src/entity/enum/study.status.enum';
import { IsString } from 'class-validator';

export class StudyStatusDto {
  @IsString()
  studyStatus!: StudyStatusEnum;
}
