import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  IsObject,
} from "class-validator";

export class CreateLoanPolicyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @IsInt()
  @Min(0)
  minCreditScore: number;

  @IsNumber()
  @Min(0)
  maxLoanAmount: number;

  @IsObject()
  rules: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
