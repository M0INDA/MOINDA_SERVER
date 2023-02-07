import { ApproveStatusEnum } from '@app/moinda-pd/entity/enum/approve.status.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class StudyRequestDto {
  @IsString()
  @IsNotEmpty()
  approveStatus!: ApproveStatusEnum;
}
