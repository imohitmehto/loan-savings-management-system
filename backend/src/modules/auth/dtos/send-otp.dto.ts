import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendOtpDto {
  @ApiProperty({
    example: "deepak123@example.com",
    description: "Email address of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
