import { InterestCalculator } from "../interfaces/interest-calculator.interface";
import { LoanDetailsDto } from "../dtos";
import { convertTermToYears } from "../../../common/utils/term-utils";

export class FixedInterestCalculator implements InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number {
    // Treat fixed interest similar to simple interest for the entire term
    const years = convertTermToYears(loan.termValue, loan.termPeriod);
    return loan.principal * (loan.annualInterestRate / 100) * years;
  }
}
