import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpDto {
  @ApiProperty({
    example: "deepak123@example.com",
    description: "Email address of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "The OTP code sent to the user",
    example: "482913",
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
