import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  dob: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber("IN")
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
