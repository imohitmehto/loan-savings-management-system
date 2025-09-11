import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  Min,
  Max,
  ValidateNested,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum LoanType {
  HOME_LOAN = "HOME_LOAN",
  VEHICLE_LOAN = "VEHICLE_LOAN",
  PERSONAL_LOAN = "PERSONAL_LOAN",
  BUSINESS_LOAN = "BUSINESS_LOAN",
  EDUCATION_LOAN = "EDUCATION_LOAN",
  GOLD_LOAN = "GOLD_LOAN",
}

export enum CalculationType {
  REDUCING_BALANCE = "REDUCING_BALANCE",
  FLAT_RATE = "FLAT_RATE",
  COMPOUND_INTEREST = "COMPOUND_INTEREST",
}

export enum LoanStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DISBURSED = "DISBURSED",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  DEFAULTED = "DEFAULTED",
}

/**
 * DTO for loan application
 */
export class CreateLoanApplicationDto {
  @ApiProperty({ description: "Account ID for the loan" })
  @IsString()
  accountId: string;

  @ApiProperty({ enum: LoanType, description: "Type of loan" })
  @IsEnum(LoanType)
  loanType: LoanType;

  @ApiProperty({ description: "Loan amount requested", minimum: 1000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1000)
  @Max(100000000) // 10 crores max
  amount: number;

  @ApiProperty({
    description: "Interest rate (annual %)",
    minimum: 0,
    maximum: 50,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(50)
  interestRate: number;

  @ApiProperty({
    description: "Loan tenure in months",
    minimum: 1,
    maximum: 360,
  })
  @IsNumber()
  @Min(1)
  @Max(360)
  tenureMonths: number;

  @ApiPropertyOptional({
    enum: CalculationType,
    description: "Interest calculation method",
  })
  @IsEnum(CalculationType)
  @IsOptional()
  calculationType?: CalculationType = CalculationType.REDUCING_BALANCE;

  @ApiPropertyOptional({ description: "Associated loan policy ID" })
  @IsString()
  @IsOptional()
  loanPolicyId?: string;

  @ApiPropertyOptional({ description: "Purpose of the loan" })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: "Additional remarks" })
  @IsString()
  @IsOptional()
  remarks?: string;
}

/**
 * DTO for loan approval/rejection
 */
export class LoanDecisionDto {
  @ApiProperty({ description: "Loan ID" })
  @IsString()
  loanId: string;

  @ApiProperty({ description: "Decision: approve or reject" })
  @IsEnum(["APPROVED", "REJECTED"])
  decision: "APPROVED" | "REJECTED";

  @ApiPropertyOptional({ description: "Remarks for the decision" })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({
    description: "Modified loan amount (if approved with changes)",
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(1000)
  modifiedAmount?: number;

  @ApiPropertyOptional({
    description: "Modified interest rate (if approved with changes)",
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  @Max(50)
  modifiedInterestRate?: number;

  @ApiPropertyOptional({
    description: "Modified tenure (if approved with changes)",
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(360)
  modifiedTenure?: number;
}

/**
 * DTO for loan disbursement
 */
export class DisburseLoanDto {
  @ApiProperty({ description: "Loan ID to disburse" })
  @IsString()
  loanId: string;

  @ApiProperty({ description: "Disbursement amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ description: "Disbursement mode" })
  @IsString()
  @IsOptional()
  disbursementMode?: string = "BANK_TRANSFER";

  @ApiPropertyOptional({ description: "Bank account details for disbursement" })
  @IsString()
  @IsOptional()
  bankAccountId?: string;

  @ApiPropertyOptional({ description: "Disbursement remarks" })
  @IsString()
  @IsOptional()
  remarks?: string;
}

/**
 * DTO for EMI payment
 */
export class CreateEMIPaymentDto {
  @ApiProperty({ description: "Loan ID" })
  @IsString()
  loanId: string;

  @ApiProperty({ description: "Payment amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: "Payment mode" })
  @IsString()
  paymentMode: string;

  @ApiPropertyOptional({ description: "Transaction reference" })
  @IsString()
  @IsOptional()
  transactionReference?: string;

  @ApiPropertyOptional({ description: "Payment remarks" })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: "Payment date (defaults to now)" })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  paymentDate?: Date;
}

/**
 * DTO for loan foreclosure request
 */
export class RequestForeclosureDto {
  @ApiProperty({ description: "Loan ID to foreclose" })
  @IsString()
  loanId: string;

  @ApiPropertyOptional({ description: "Requested foreclosure date" })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  requestedDate?: Date;

  @ApiPropertyOptional({ description: "Reason for foreclosure" })
  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * DTO for loan prepayment
 */
export class CreatePrepaymentDto {
  @ApiProperty({ description: "Loan ID" })
  @IsString()
  loanId: string;

  @ApiProperty({ description: "Prepayment amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1000) // Minimum prepayment amount
  amount: number;

  @ApiProperty({ description: "Whether to reduce EMI or tenure" })
  @IsBoolean()
  reduceEMI: boolean = false; // Default: reduce tenure

  @ApiPropertyOptional({ description: "Payment mode" })
  @IsString()
  @IsOptional()
  paymentMode?: string = "BANK_TRANSFER";

  @ApiPropertyOptional({ description: "Prepayment remarks" })
  @IsString()
  @IsOptional()
  remarks?: string;
}

/**
 * DTO for loan calculation request
 */
export class LoanCalculationDto {
  @ApiProperty({ description: "Principal loan amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1000)
  @Max(100000000)
  principalAmount: number;

  @ApiProperty({ description: "Annual interest rate" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(50)
  interestRate: number;

  @ApiProperty({ description: "Loan tenure in months" })
  @IsNumber()
  @Min(1)
  @Max(360)
  tenureMonths: number;

  @ApiProperty({ enum: LoanType, description: "Type of loan" })
  @IsEnum(LoanType)
  loanType: LoanType;

  @ApiPropertyOptional({
    enum: CalculationType,
    description: "Calculation method",
  })
  @IsEnum(CalculationType)
  @IsOptional()
  calculationType?: CalculationType = CalculationType.REDUCING_BALANCE;
}

/**
 * DTO for foreclosure calculation
 */
export class ForeclosureCalculationDto extends LoanCalculationDto {
  @ApiProperty({ description: "Number of EMIs already paid" })
  @IsNumber()
  @Min(0)
  emisPaid: number;

  @ApiPropertyOptional({
    description: "Foreclosure charge percentage",
    minimum: 0,
    maximum: 10,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  @IsOptional()
  foreclosureChargePercent?: number = 2;

  @ApiPropertyOptional({ description: "Foreclosure date" })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  foreclosureDate?: Date;
}

/**
 * DTO for prepayment calculation
 */
export class PrepaymentCalculationDto extends LoanCalculationDto {
  @ApiProperty({ description: "Number of EMIs already paid" })
  @IsNumber()
  @Min(0)
  emisPaid: number;

  @ApiProperty({ description: "Prepayment amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  prepaymentAmount: number;

  @ApiPropertyOptional({
    description: "Prepayment charge percentage",
    minimum: 0,
    maximum: 5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  @IsOptional()
  prepaymentChargePercent?: number = 1;

  @ApiProperty({ description: "Whether to reduce EMI instead of tenure" })
  @IsBoolean()
  @IsOptional()
  reduceEMI?: boolean = false;
}

/**
 * DTO for loan search and filtering
 */
export class LoanSearchDto {
  @ApiPropertyOptional({ description: "Page number", minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({ enum: LoanType, description: "Filter by loan type" })
  @IsEnum(LoanType)
  @IsOptional()
  loanType?: LoanType;

  @ApiPropertyOptional({
    enum: LoanStatus,
    description: "Filter by loan status",
  })
  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;

  @ApiPropertyOptional({ description: "Filter by account ID" })
  @IsString()
  @IsOptional()
  accountId?: string;

  @ApiPropertyOptional({ description: "Filter by user ID" })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: "Minimum loan amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minAmount?: number;

  @ApiPropertyOptional({ description: "Maximum loan amount" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  maxAmount?: number;

  @ApiPropertyOptional({ description: "Date from (ISO string)" })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: "Date to (ISO string)" })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTo?: Date;

  @ApiPropertyOptional({ description: "Sort field" })
  @IsString()
  @IsOptional()
  sortBy?: string = "appliedAt";

  @ApiPropertyOptional({ description: "Sort order", enum: ["asc", "desc"] })
  @IsEnum(["asc", "desc"])
  @IsOptional()
  sortOrder?: "asc" | "desc" = "desc";
}

/**
 * Response DTOs
 */

export class LoanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty({ enum: LoanType })
  loanType: LoanType;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  interestRate: number;

  @ApiProperty()
  tenureMonths: number;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty({ enum: LoanStatus })
  status: LoanStatus;

  @ApiProperty()
  appliedAt: Date;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  disbursedAt?: Date;

  @ApiPropertyOptional()
  closedAt?: Date;

  @ApiProperty()
  principalAmount: number;

  @ApiProperty()
  totalInterest: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  outstandingPrincipal: number;

  @ApiProperty()
  outstandingInterest: number;

  @ApiProperty()
  allowForeclosure: boolean;

  @ApiProperty()
  foreclosureCharges: number;

  @ApiProperty()
  allowPrepayment: boolean;

  @ApiProperty()
  prepaymentCharges: number;
}

export class EMIScheduleResponseDto {
  @ApiProperty()
  emiNumber: number;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  principalAmount: number;

  @ApiProperty()
  interestAmount: number;

  @ApiProperty()
  outstandingBalance: number;

  @ApiProperty()
  cumulativePrincipal: number;

  @ApiProperty()
  cumulativeInterest: number;
}

export class ForeclosureCalculationResponseDto {
  @ApiProperty()
  outstandingPrincipal: number;

  @ApiProperty()
  outstandingInterest: number;

  @ApiProperty()
  foreclosureCharges: number;

  @ApiProperty()
  totalForeclosureAmount: number;

  @ApiProperty()
  interestSaved: number;

  @ApiProperty()
  totalSavings: number;
}

export class PrepaymentCalculationResponseDto {
  @ApiProperty()
  prepaymentAmount: number;

  @ApiProperty()
  prepaymentCharges: number;

  @ApiProperty()
  netPrepaymentAmount: number;

  @ApiProperty()
  newEMI: number;

  @ApiProperty()
  newTenure: number;

  @ApiProperty()
  interestSaved: number;

  @ApiProperty()
  tenureReduction: number;
}

export class PaginatedLoanResponseDto {
  @ApiProperty({ type: [LoanResponseDto] })
  data: LoanResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
