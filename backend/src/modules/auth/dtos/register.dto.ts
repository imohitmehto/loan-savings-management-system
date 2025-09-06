import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class RegisterDto {
  @ApiProperty({
    example: "Deepak",
    description: "first name of the user",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: "Soni",
    description: "last name of the user",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "deepak123@example.com",
    description: "Email address of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: "1234567890",
    description: " Mobile number of the user",
  })
  @IsOptional()
  @IsPhoneNumber("IN")
  phone?: string;

  @ApiProperty({
    example: "@#$strongPassword123",
    minLength: 6,
    description: "Password of the user",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Role,
    default: Role.CUSTOMER,
    description: "Role of the user",
    example: "CUSTOMER",
  })
  @IsEnum(Role)
  role: Role = Role.CUSTOMER;
}
