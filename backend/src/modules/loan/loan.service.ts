// import {
//   Injectable,
//   BadRequestException,
//   ForbiddenException,
// } from "@nestjs/common";
// import { PrismaService } from "src/infrastructure/database/prisma.service";
// import { CalculateLoanDto } from "./dtos/calculate-loan.dto";

// @Injectable()
// export class LoanService {
//   constructor(private readonly prisma: PrismaService) {}

//   async calculateLoan(dto: CalculateLoanDto) {
//     const {
//       policyId,
//       principal,
//       interestRate: rawRate,
//       tenureMonths
//     } = dto;

//     let policy: LoanPolicy | null = null;
//     let rate: number;

//     // 1️⃣ Fetch and validate policy if provided
//     if (policyId) {
//       policy = await this.prisma.loanPolicy.findUnique({
//         where: { id: policyId },
//       });

//       if (!policy || !policy.isActive) {
//         throw new BadRequestException("Invalid or inactive policy");
//       }

//       // // Validate credit score and principal against policy constraints
//       // if (creditScore < policy.minCreditScore) {
//       //   throw new ForbiddenException(
//       //     `Insufficient credit score: Minimum required is ${policy.minCreditScore}`,
//       //   );
//       // }

//       if (principal > policy.maxLoanAmount) {
//         throw new BadRequestException(
//           `Loan amount exceeds max allowed by this policy`,
//         );
//       }

//       rate = policy.interestRate;
//     } else {
//       // 2️⃣ Fallback to DTO interest rate if no policy
//       if (rawRate === undefined || rawRate <= 0) {
//         throw new BadRequestException(
//           "Interest rate is required when no policy is selected",
//         );
//       }
//       rate = rawRate;
//     }

//     // 3️⃣ EMI calculation using amortized formula
//     const monthlyRate = rate / 12 / 100;
//     const emi =
//       (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
//       (Math.pow(1 + monthlyRate, tenureMonths) - 1);

//     const totalPayment = emi * tenureMonths;
//     const totalInterest = totalPayment - principal;

//     return {
//       source: policy ? "Policy-Based" : "Manual Input",
//       policyName: policy?.name,
//       interestRate: rate,
//       emi: parseFloat(emi.toFixed(2)),
//       totalPayable: parseFloat(totalPayment.toFixed(2)),
//       totalInterest: parseFloat(totalInterest.toFixed(2)),
//       tenureMonths,
//     };
//   }
// }
