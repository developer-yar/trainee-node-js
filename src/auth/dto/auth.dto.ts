import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @MinLength(8)
  @MaxLength(60)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}
