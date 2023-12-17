import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsBase64,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @IsEmail()
  @MinLength(8)
  @MaxLength(60)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @ValidateIf((obj) => obj.image)
  @IsBase64()
  image: string;
}
