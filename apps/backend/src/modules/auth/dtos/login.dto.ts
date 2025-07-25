import { IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  userName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  rememberMe?: boolean;
}
