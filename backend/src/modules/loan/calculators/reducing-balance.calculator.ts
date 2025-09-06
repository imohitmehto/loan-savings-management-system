import { InterestCalculator } from "../interfaces/interest-calculator.interface";
import { EmiBreakdownDto, LoanDetailsDto } from "../dtos";
import { convertTermToYears } from "../../../common/utils/term-utils";

export class ReducingBalanceInterestCalculator implements InterestCalculator {
  calculateTotalInterest(loan: LoanDetailsDto): number {
    const principal = loan.principal;
    const paymentsPerYear = loan.paymentsPerYear ?? 12;
    const r = loan.annualInterestRate / 100 / paymentsPerYear;
    const n =
      convertTermToYears(loan.termValue, loan.termPeriod) * paymentsPerYear;

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;

    return totalPayment - principal;
  }

  generateEmiSchedule(loan: LoanDetailsDto): EmiBreakdownDto[] {
    const principal = loan.principal;
    const paymentsPerYear = loan.paymentsPerYear ?? 12;
    const r = loan.annualInterestRate / 100 / paymentsPerYear;
    const n =
      convertTermToYears(loan.termValue, loan.termPeriod) * paymentsPerYear;

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let balance = principal;

    const schedule: EmiBreakdownDto[] = [];

    for (let period = 1; period <= n; period++) {
      const interestComponent = balance * r;
      const principalComponent = emi - interestComponent;
      balance -= principalComponent;

      schedule.push({
        period,
        emi: parseFloat(emi.toFixed(2)),
        principalComponent: parseFloat(principalComponent.toFixed(2)),
        interestComponent: parseFloat(interestComponent.toFixed(2)),
        outstandingPrincipal: parseFloat(
          (balance > 0 ? balance : 0).toFixed(2),
        ),
      });
    }

    return schedule;
  }
}
