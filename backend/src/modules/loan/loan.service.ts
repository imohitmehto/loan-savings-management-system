import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma.service";
import { LoanInterestFactory } from "./loan-interest.factory";
import { InterestType } from "@prisma/client";
import { EmiBreakdownDto, LoanDetailsDto } from "./dtos";

@Injectable()
export class LoanService {
  constructor(private readonly prisma: PrismaService) {}

  calculateTotalInterest(loan: LoanDetailsDto): number {
    const calculator = LoanInterestFactory.getCalculator(loan.interestType);
    return calculator.calculateTotalInterest(loan);
  }

  calculateEmiSchedule(loan: LoanDetailsDto): EmiBreakdownDto[] {
    if (
      loan.interestType !== InterestType.REDUCING &&
      loan.interestType !== InterestType.MORTGAGE
    ) {
      throw new Error(
        "EMI schedule calculation supported only for REDUCING and MORTGAGE interest types.",
      );
    }

    const calculator = LoanInterestFactory.getCalculator(loan.interestType);

    if (!calculator.generateEmiSchedule) {
      throw new Error(
        "EMI schedule generation not implemented for this interest type.",
      );
    }

    return calculator.generateEmiSchedule(loan);
  }

  async getAllLoans() {
    return this.prisma.loan.findMany();
  }
}
