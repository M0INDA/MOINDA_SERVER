import { IsIP, IsOptional, IsString } from 'class-validator';

export class ViewsDto {
  @IsIP()
  @IsString()
  @IsOptional()
  ip!: string;
}
