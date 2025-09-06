import { InterestType, TermPeriod } from "@prisma/client";

export class LoanDetailsDto {
  principal: number;
  annualInterestRate: number;
  termValue: number;
  termPeriod: TermPeriod;
  interestType: InterestType;
  paymentsPerYear?: number;
  variableRates?: number[];
  hybridSplits?: { fixedPercent: number; variablePercent: number };
  oneTimeInterestAmount?: number;
}
