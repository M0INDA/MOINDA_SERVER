import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '이메일을 적어주세요' })
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty({ message: '닉네임을 적어주세요' })
  @IsString()
  @MaxLength(24)
  @MinLength(6)
  nickname: string;

  @IsNotEmpty({ message: '비밀번호를 적어주세요' })
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  password: string;

  @IsString()
  refreshToken?: string = 'null';
}
