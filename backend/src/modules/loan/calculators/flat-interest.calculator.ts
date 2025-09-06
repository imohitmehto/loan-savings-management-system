import { InterestCalculator } from "../interfaces/interest-calculator.interface";
import { LoanDetailsDto } from "../dtos";
import { convertTermToYears } from "../../../common/utils/term-utils";

export class FlatInterestCalculator implements InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number {
    const years = convertTermToYears(loan.termValue, loan.termPeriod);
    return loan.principal * (loan.annualInterestRate / 100) * years;
  }
}
