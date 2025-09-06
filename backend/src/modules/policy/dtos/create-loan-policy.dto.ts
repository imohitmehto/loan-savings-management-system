import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  Min,
  IsDefined,
} from "class-validator";
import { Type } from "class-transformer";
import { FeeType, InterestType, TermPeriod } from "@prisma/client";

export class CreateLoanPolicyDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount: number;

  @IsDefined()
  @IsEnum(InterestType)
  interestType: InterestType;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  interestRate: number;

  @IsDefined()
  @IsEnum(TermPeriod)
  termPeriod: TermPeriod;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxTerm: number;

  @IsDefined()
  @IsEnum(FeeType)
  applicationFeeType: FeeType;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  applicationFee: number;

  @IsDefined()
  @IsEnum(FeeType)
  processingFeeType: FeeType;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  processingFee: number;

  @IsDefined()
  @IsEnum(FeeType)
  latePaymentPenaltiesType: FeeType;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  latePaymentPenalties: number;

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  rules: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
