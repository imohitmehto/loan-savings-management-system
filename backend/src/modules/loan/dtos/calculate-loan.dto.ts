import { IsNumber, IsOptional, IsBoolean } from "class-validator";

export class CalculateLoanDto {
  @IsNumber()
  interestRate: number;

  @IsNumber()
  principal: number;

  @IsNumber()
  tenureMonths: number;

  @IsOptional()
  @IsBoolean()
  showSchedule?: boolean;
}
