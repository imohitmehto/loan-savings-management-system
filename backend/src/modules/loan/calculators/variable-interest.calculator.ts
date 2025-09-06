import { InterestCalculator } from "../interfaces/interest-calculator.interface";
import { LoanDetailsDto } from "../dtos";
import { convertTermToYears } from "src/common/utils/term-utils";

export class VariableInterestCalculator implements InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number {
    if (!loan.variableRates || loan.variableRates.length === 0) {
      throw new Error(
        "Variable rates array is required for VARIABLE interest type.",
      );
    }
    const years = convertTermToYears(loan.termValue, loan.termPeriod);
    const avgRate =
      loan.variableRates.reduce((sum, rate) => sum + rate, 0) /
      loan.variableRates.length;
    return loan.principal * (avgRate / 100) * years;
  }
}
