import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber("IN")
  phone?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
