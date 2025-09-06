import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
  @ApiPropertyOptional({
    example: "deepak123@example.com",
    description: "Email address of the user",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the account (minimum 6 characters)",
    example: "strongPass123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: "Whether to keep the user logged in",
    example: true,
  })
  @IsOptional()
  rememberMe?: boolean;
}
