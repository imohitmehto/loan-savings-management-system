import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma.service";
import { CreateTransactionDto } from "./dtos";
import { TransactionType } from "@prisma/client";

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new transaction record and update the community fund accordingly
   * @param dto - Data Transfer Object containing transaction details
   * @param userId - ID of the user creating the transaction
   * @returns The created transaction object
   */
  async createTransaction(dto: CreateTransactionDto, userId: string) {
    try {
      // Validate if account exists
      const account = await this.prisma.account.findUnique({
        where: { id: dto.accountId },
      });

      if (!account) {
        throw new NotFoundException("Account not found");
      }

      // Create transaction entry
      const transaction = await this.prisma.transaction.create({
        data: {
          ...dto,
          createdById: userId,
        },
      });

      // Update community fund based on transaction type
      await this.updateCommunityFund(dto.type, dto.amount);

      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new InternalServerErrorException("Failed to create transaction");
    }
  }

  /**
   * Updates the central community fund balance based on the transaction type
   * @param type - Type of the transaction (DEPOSIT, WITHDRAWAL, etc.)
   * @param amount - Amount of the transaction
   */
  private async updateCommunityFund(type: TransactionType, amount: number) {
    try {
      const fund = await this.prisma.communityFund.findFirst();

      if (!fund) {
        throw new NotFoundException("Community fund not initialized");
      }

      const isCredit = ["DEPOSIT", "LOAN_REPAYMENT", "INTEREST"].includes(type);
      const isDebit = ["WITHDRAWAL", "LOAN_ISSUE", "FINE"].includes(type);

      if (!isCredit && !isDebit) {
        throw new BadRequestException(`Unsupported transaction type: ${type}`);
      }

      const totalDeposit = isCredit
        ? fund.totalDeposit + amount
        : fund.totalDeposit;
      const totalWithdraw = isDebit
        ? fund.totalWithdraw + amount
        : fund.totalWithdraw;
      const netBalance = totalDeposit - totalWithdraw;

      await this.prisma.communityFund.update({
        where: { id: fund.id },
        data: {
          totalDeposit,
          totalWithdraw,
          netBalance,
        },
      });
    } catch (error) {
      console.error("Error updating community fund:", error);
      throw new InternalServerErrorException("Failed to update community fund");
    }
  }

  /**
   * Fetches all transactions with account and creator info
   * @returns List of transactions
   */
  async getAllTransactions() {
    try {
      return await this.prisma.transaction.findMany({
        include: {
          account: true,
          createdBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new InternalServerErrorException("Failed to fetch transactions");
    }
  }
}
