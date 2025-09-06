import { LoanDetailsDto, EmiBreakdownDto } from "../dtos";

export interface InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number;

  // Optional: Generate EMI schedule for types like reducing balance
  generateEmiSchedule?(loan: LoanDetailsDto): EmiBreakdownDto[];
}
