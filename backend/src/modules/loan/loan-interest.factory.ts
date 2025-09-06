import { InterestCalculator } from "./interfaces/interest-calculator.interface";
import { InterestType } from "@prisma/client";
import { FlatInterestCalculator } from "./calculators/flat-interest.calculator";
import { ReducingBalanceInterestCalculator } from "./calculators/reducing-balance.calculator";
import { FixedInterestCalculator } from "./calculators/fixed-interest.calculator";
import { VariableInterestCalculator } from "./calculators/variable-interest.calculator";
import { HybridInterestCalculator } from "./calculators/hybrid-interest.calculator";
import { OneTimeInterestCalculator } from "./calculators/one-time-interest.calculator";
import { MortgageInterestCalculator } from "./calculators/mortgage-interest.calculator";

export class LoanInterestFactory {
  static getCalculator(type: InterestType): InterestCalculator {
    switch (type) {
      case InterestType.FLAT:
        return new FlatInterestCalculator();
      case InterestType.REDUCING:
        return new ReducingBalanceInterestCalculator();
      case InterestType.FIXED:
        return new FixedInterestCalculator();
      case InterestType.VARIABLE:
        return new VariableInterestCalculator();
      case InterestType.HYBRID:
        return new HybridInterestCalculator();
      case InterestType.ONE_TIME:
        return new OneTimeInterestCalculator();
      case InterestType.MORTGAGE:
        return new MortgageInterestCalculator();
      default:
        throw new Error(`Unsupported interest type: ${type}`);
    }
  }
}
