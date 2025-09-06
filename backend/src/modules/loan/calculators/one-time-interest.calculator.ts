import { InterestCalculator } from "../interfaces/interest-calculator.interface";
import { LoanDetailsDto } from "../dtos";

export class OneTimeInterestCalculator implements InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number {
    if (loan.oneTimeInterestAmount === undefined) {
      throw new Error(
        "oneTimeInterestAmount must be provided for ONE_TIME interest type.",
      );
    }
    return loan.oneTimeInterestAmount;
  }
}
