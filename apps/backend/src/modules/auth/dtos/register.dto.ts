import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  name: string;

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
