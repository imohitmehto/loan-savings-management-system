import { InterestCalculator } from "../interfaces/interest-calculator.interface";
import { LoanDetailsDto } from "../dtos";
import { convertTermToYears } from "src/common/utils/term-utils";

export class HybridInterestCalculator implements InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number {
    if (!loan.hybridSplits) {
      throw new Error(
        "Hybrid splits must be provided for HYBRID interest type.",
      );
    }
    const years = convertTermToYears(loan.termValue, loan.termPeriod);

    // Fixed portion
    const fixedInterest =
      loan.principal *
      (loan.annualInterestRate / 100) *
      years *
      (loan.hybridSplits.fixedPercent / 100);

    // Variable portion: average rate or fallback
    const avgVariableRate =
      loan.variableRates && loan.variableRates.length > 0
        ? loan.variableRates.reduce((sum, r) => sum + r, 0) /
          loan.variableRates.length
        : loan.annualInterestRate;

    const variableInterest =
      loan.principal *
      (avgVariableRate / 100) *
      years *
      (loan.hybridSplits.variablePercent / 100);

    return fixedInterest + variableInterest;
  }
}
