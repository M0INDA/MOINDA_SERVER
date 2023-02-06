import { ApproveStatusEnum } from '@app/moinda-pd/entity/enum/aprove.status.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class StudyRequestDto {
  @IsString()
  @IsNotEmpty()
  aproveStatus!: ApproveStatusEnum;
}
