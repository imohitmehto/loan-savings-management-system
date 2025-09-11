import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Comprehensive Loan Calculation Service
 * Handles all types of loan calculations including:
 * - EMI calculation for different loan types
 * - EMI bifurcation (principal vs interest)
 * - Foreclosure calculations
 * - Prepayment calculations with rebates
 * - Different interest calculation methods
 */

export interface LoanCalculationParams {
  principalAmount: number;
  interestRate: number; // Annual interest rate
  tenureMonths: number;
  calculationType: "REDUCING_BALANCE" | "FLAT_RATE" | "COMPOUND_INTEREST";
  loanType: "HOME_LOAN" | "VEHICLE_LOAN" | "PERSONAL_LOAN" | "BUSINESS_LOAN";
}

export interface EMIScheduleItem {
  emiNumber: number;
  dueDate: Date;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  outstandingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface ForeclosureCalculation {
  outstandingPrincipal: number;
  outstandingInterest: number;
  foreclosureCharges: number;
  totalForeclosureAmount: number;
  interestSaved: number;
  totalSavings: number;
}

export interface PrepaymentCalculation {
  prepaymentAmount: number;
  prepaymentCharges: number;
  netPrepaymentAmount: number;
  newEMI: number;
  newTenure: number;
  interestSaved: number;
  tenureReduction: number;
}

@Injectable()
export class LoanCalculationService {
  /**
   * Calculate EMI based on different calculation methods
   */
  calculateEMI(params: LoanCalculationParams): number {
    const { principalAmount, interestRate, tenureMonths, calculationType } =
      params;

    switch (calculationType) {
      case "REDUCING_BALANCE":
        return this.calculateReducingBalanceEMI(
          principalAmount,
          interestRate,
          tenureMonths,
        );

      case "FLAT_RATE":
        return this.calculateFlatRateEMI(
          principalAmount,
          interestRate,
          tenureMonths,
        );

      case "COMPOUND_INTEREST":
        return this.calculateCompoundInterestEMI(
          principalAmount,
          interestRate,
          tenureMonths,
        );

      default:
        throw new Error("Invalid calculation type");
    }
  }

  /**
   * Reducing Balance Method (Most common for home loans, vehicle loans)
   * EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
   * Where P = Principal, R = Monthly Interest Rate, N = Number of months
   */
  private calculateReducingBalanceEMI(
    principal: number,
    annualRate: number,
    months: number,
  ): number {
    const monthlyRate = annualRate / (12 * 100); // Convert annual rate to monthly decimal

    if (monthlyRate === 0) {
      return principal / months; // If no interest, just divide principal by months
    }

    const numerator =
      principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;

    return Math.round((numerator / denominator) * 100) / 100;
  }

  /**
   * Flat Rate Method (Common for personal loans, vehicle loans from some NBFCs)
   * Total Interest = (P × R × T) / 100
   * EMI = (P + Total Interest) / N
   */
  private calculateFlatRateEMI(
    principal: number,
    annualRate: number,
    months: number,
  ): number {
    const years = months / 12;
    const totalInterest = (principal * annualRate * years) / 100;
    const totalAmount = principal + totalInterest;

    return Math.round((totalAmount / months) * 100) / 100;
  }

  /**
   * Compound Interest Method (Less common, used for specific loan products)
   * A = P(1 + r/n)^(nt)
   * EMI = A / N
   */
  private calculateCompoundInterestEMI(
    principal: number,
    annualRate: number,
    months: number,
  ): number {
    const monthlyRate = annualRate / (12 * 100);
    const compoundAmount = principal * Math.pow(1 + monthlyRate, months);

    return Math.round((compoundAmount / months) * 100) / 100;
  }

  /**
   * Generate complete EMI schedule with bifurcation
   * Shows principal and interest breakup for each EMI
   */
  generateEMISchedule(
    params: LoanCalculationParams,
    startDate: Date = new Date(),
  ): EMIScheduleItem[] {
    const emi = this.calculateEMI(params);
    const schedule: EMIScheduleItem[] = [];
    let outstandingBalance = params.principalAmount;
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    for (let emiNumber = 1; emiNumber <= params.tenureMonths; emiNumber++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + emiNumber);

      let interestAmount: number;
      let principalAmount: number;

      if (params.calculationType === "REDUCING_BALANCE") {
        // Interest calculated on outstanding balance
        const monthlyRate = params.interestRate / (12 * 100);
        interestAmount =
          Math.round(outstandingBalance * monthlyRate * 100) / 100;
        principalAmount = Math.round((emi - interestAmount) * 100) / 100;

        // Ensure we don't go negative on the last EMI
        if (emiNumber === params.tenureMonths) {
          principalAmount = outstandingBalance;
          interestAmount = emi - principalAmount;
        }
      } else if (params.calculationType === "FLAT_RATE") {
        // Fixed interest and principal throughout
        const totalInterest =
          (params.principalAmount *
            params.interestRate *
            (params.tenureMonths / 12)) /
          100;
        interestAmount =
          Math.round((totalInterest / params.tenureMonths) * 100) / 100;
        principalAmount =
          Math.round((params.principalAmount / params.tenureMonths) * 100) /
          100;
      } else {
        // Compound interest - equal EMI with varying principal/interest
        const monthlyRate = params.interestRate / (12 * 100);
        interestAmount =
          Math.round(outstandingBalance * monthlyRate * 100) / 100;
        principalAmount = Math.round((emi - interestAmount) * 100) / 100;
      }

      outstandingBalance = Math.max(
        0,
        Math.round((outstandingBalance - principalAmount) * 100) / 100,
      );
      cumulativePrincipal =
        Math.round((cumulativePrincipal + principalAmount) * 100) / 100;
      cumulativeInterest =
        Math.round((cumulativeInterest + interestAmount) * 100) / 100;

      schedule.push({
        emiNumber,
        dueDate,
        emiAmount: emi,
        principalAmount,
        interestAmount,
        outstandingBalance,
        cumulativePrincipal,
        cumulativeInterest,
      });
    }

    return schedule;
  }

  /**
   * Calculate foreclosure amount and savings
   * Includes foreclosure charges and interest saved
   */
  calculateForeclosure(
    originalParams: LoanCalculationParams,
    emisPaid: number,
    foreclosureChargePercent: number = 2, // Default 2%
    currentDate: Date = new Date(),
  ): ForeclosureCalculation {
    const schedule = this.generateEMISchedule(originalParams);

    if (emisPaid >= schedule.length) {
      throw new Error("Loan already completed");
    }

    const currentSchedule = schedule[emisPaid]; // 0-based index for paid EMIs
    const outstandingPrincipal = currentSchedule
      ? currentSchedule.outstandingBalance
      : originalParams.principalAmount;

    // Calculate remaining interest if loan continues
    const remainingSchedule = schedule.slice(emisPaid);
    const remainingInterest = remainingSchedule.reduce(
      (sum, item) => sum + item.interestAmount,
      0,
    );

    // Calculate accrued interest till foreclosure date
    let accruedInterest = 0;
    if (emisPaid > 0) {
      const lastPaidEMI = schedule[emisPaid - 1];
      const daysSinceLastEMI = Math.floor(
        (currentDate.getTime() - lastPaidEMI.dueDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const dailyRate = originalParams.interestRate / (365 * 100);
      accruedInterest =
        Math.round(outstandingPrincipal * dailyRate * daysSinceLastEMI * 100) /
        100;
    }

    const foreclosureCharges =
      Math.round(
        ((outstandingPrincipal * foreclosureChargePercent) / 100) * 100,
      ) / 100;
    const totalForeclosureAmount =
      Math.round(
        (outstandingPrincipal + accruedInterest + foreclosureCharges) * 100,
      ) / 100;
    const interestSaved = Math.max(
      0,
      Math.round((remainingInterest - accruedInterest) * 100) / 100,
    );
    const totalSavings =
      Math.round((interestSaved - foreclosureCharges) * 100) / 100;

    return {
      outstandingPrincipal: Math.round(outstandingPrincipal * 100) / 100,
      outstandingInterest: Math.round(accruedInterest * 100) / 100,
      foreclosureCharges,
      totalForeclosureAmount,
      interestSaved,
      totalSavings,
    };
  }

  /**
   * Calculate prepayment impact
   * Shows new EMI or tenure reduction based on prepayment
   */
  calculatePrepayment(
    originalParams: LoanCalculationParams,
    emisPaid: number,
    prepaymentAmount: number,
    prepaymentChargePercent: number = 1, // Default 1%
    reduceEMI: boolean = false, // If false, reduces tenure; if true, reduces EMI
  ): PrepaymentCalculation {
    const schedule = this.generateEMISchedule(originalParams);

    if (emisPaid >= schedule.length) {
      throw new Error("Loan already completed");
    }

    const currentSchedule = schedule[emisPaid];
    const outstandingPrincipal = currentSchedule
      ? currentSchedule.outstandingBalance
      : originalParams.principalAmount;

    if (prepaymentAmount >= outstandingPrincipal) {
      throw new Error(
        "Prepayment amount cannot be more than outstanding principal",
      );
    }

    const prepaymentCharges =
      Math.round(((prepaymentAmount * prepaymentChargePercent) / 100) * 100) /
      100;
    const netPrepaymentAmount =
      Math.round((prepaymentAmount - prepaymentCharges) * 100) / 100;
    const newOutstandingPrincipal =
      Math.round((outstandingPrincipal - netPrepaymentAmount) * 100) / 100;

    let newEMI: number;
    let newTenure: number;
    let interestSaved = 0;

    if (reduceEMI) {
      // Keep same tenure, reduce EMI
      newTenure = originalParams.tenureMonths - emisPaid;
      const newParams = {
        ...originalParams,
        principalAmount: newOutstandingPrincipal,
        tenureMonths: newTenure,
      };
      newEMI = this.calculateEMI(newParams);

      // Calculate interest saved
      const originalRemainingInterest = schedule
        .slice(emisPaid)
        .reduce((sum, item) => sum + item.interestAmount, 0);
      const newSchedule = this.generateEMISchedule(newParams);
      const newTotalInterest = newSchedule.reduce(
        (sum, item) => sum + item.interestAmount,
        0,
      );
      interestSaved =
        Math.round((originalRemainingInterest - newTotalInterest) * 100) / 100;
    } else {
      // Keep same EMI, reduce tenure
      newEMI = this.calculateEMI(originalParams);

      // Calculate new tenure needed
      let remainingBalance = newOutstandingPrincipal;
      let monthsNeeded = 0;
      const monthlyRate = originalParams.interestRate / (12 * 100);

      while (
        remainingBalance > 0.01 &&
        monthsNeeded < originalParams.tenureMonths
      ) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = newEMI - interestPayment;
        remainingBalance = Math.max(0, remainingBalance - principalPayment);
        monthsNeeded++;
      }

      newTenure = monthsNeeded;

      // Calculate interest saved
      const originalRemainingInterest = schedule
        .slice(emisPaid)
        .reduce((sum, item) => sum + item.interestAmount, 0);
      interestSaved =
        Math.round(
          (originalRemainingInterest -
            (newTenure * newEMI - newOutstandingPrincipal)) *
            100,
        ) / 100;
    }

    return {
      prepaymentAmount,
      prepaymentCharges,
      netPrepaymentAmount,
      newEMI: Math.round(newEMI * 100) / 100,
      newTenure,
      interestSaved: Math.max(0, interestSaved),
      tenureReduction: Math.max(
        0,
        originalParams.tenureMonths - emisPaid - newTenure,
      ),
    };
  }

  /**
   * Calculate penalty for late payment
   */
  calculateLatePenalty(
    emiAmount: number,
    dueDate: Date,
    paymentDate: Date,
    penaltyRate: number = 2, // Default 2% per month
  ): number {
    const daysLate = Math.floor(
      (paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysLate <= 0) {
      return 0;
    }

    const monthsLate = Math.ceil(daysLate / 30);
    const penalty =
      Math.round(((emiAmount * penaltyRate * monthsLate) / 100) * 100) / 100;

    return penalty;
  }

  /**
   * Calculate rebate for early payment
   */
  calculateEarlyPaymentRebate(
    emiAmount: number,
    dueDate: Date,
    paymentDate: Date,
    rebateRate: number = 0.5, // Default 0.5% rebate
  ): number {
    const daysEarly = Math.floor(
      (dueDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysEarly <= 0) {
      return 0;
    }

    // Only give rebate if paid more than 7 days early
    if (daysEarly < 7) {
      return 0;
    }

    const rebate = Math.round(((emiAmount * rebateRate) / 100) * 100) / 100;
    return rebate;
  }

  /**
   * Validate loan parameters
   */
  validateLoanParameters(params: LoanCalculationParams): string[] {
    const errors: string[] = [];

    if (params.principalAmount <= 0) {
      errors.push("Principal amount must be greater than 0");
    }

    if (params.interestRate < 0 || params.interestRate > 50) {
      errors.push("Interest rate must be between 0 and 50%");
    }

    if (params.tenureMonths <= 0 || params.tenureMonths > 360) {
      errors.push("Tenure must be between 1 and 360 months");
    }

    // Loan type specific validations
    switch (params.loanType) {
      case "HOME_LOAN":
        if (params.principalAmount < 100000) {
          errors.push("Home loan minimum amount is ₹1,00,000");
        }
        if (params.tenureMonths > 360) {
          errors.push("Home loan maximum tenure is 30 years");
        }
        break;

      case "VEHICLE_LOAN":
        if (params.principalAmount < 50000) {
          errors.push("Vehicle loan minimum amount is ₹50,000");
        }
        if (params.tenureMonths > 96) {
          errors.push("Vehicle loan maximum tenure is 8 years");
        }
        break;

      case "PERSONAL_LOAN":
        if (params.principalAmount < 10000) {
          errors.push("Personal loan minimum amount is ₹10,000");
        }
        if (params.tenureMonths > 60) {
          errors.push("Personal loan maximum tenure is 5 years");
        }
        break;
    }

    return errors;
  }

  /**
   * Get loan type specific defaults
   */
  getLoanTypeDefaults(loanType: string): Partial<LoanCalculationParams> {
    const defaults: Record<string, Partial<LoanCalculationParams>> = {
      HOME_LOAN: {
        calculationType: "REDUCING_BALANCE",
        interestRate: 8.5,
        tenureMonths: 240, // 20 years
      },
      VEHICLE_LOAN: {
        calculationType: "REDUCING_BALANCE",
        interestRate: 10.5,
        tenureMonths: 60, // 5 years
      },
      PERSONAL_LOAN: {
        calculationType: "REDUCING_BALANCE",
        interestRate: 15.0,
        tenureMonths: 36, // 3 years
      },
      BUSINESS_LOAN: {
        calculationType: "REDUCING_BALANCE",
        interestRate: 12.0,
        tenureMonths: 60, // 5 years
      },
      EDUCATION_LOAN: {
        calculationType: "REDUCING_BALANCE",
        interestRate: 9.5,
        tenureMonths: 120, // 10 years
      },
      GOLD_LOAN: {
        calculationType: "REDUCING_BALANCE",
        interestRate: 11.0,
        tenureMonths: 12, // 1 year
      },
    };

    return defaults[loanType] || {};
  }
}
