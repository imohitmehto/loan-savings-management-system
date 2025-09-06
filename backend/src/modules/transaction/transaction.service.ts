// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   ForbiddenException,
//   InternalServerErrorException,
// } from "@nestjs/common";
// import { PrismaService } from "src/infrastructure/database/prisma.service";
// import { CreateTransactionDto } from "./dtos";
// import { TransactionType, Role } from "@prisma/client";

// @Injectable()
// export class TransactionService {
//   constructor(private readonly prisma: PrismaService) {}

//   /**
//    * Create a new transaction record and update the community fund accordingly
//    * @param dto - DTO containing the transaction data
//    * @param userId - ID of the user creating the transaction
//    * @returns The created transaction object
//    */
//   async createTransaction(dto: CreateTransactionDto, userId: string) {
//     try {
//       // Validate linked account existence
//       const account = await this.prisma.account.findUnique({
//         where: { id: dto.accountId },
//       });
//       if (!account) {
//         throw new NotFoundException("Account not found");
//       }

//       // Create the transaction with createdById reference
//       const transaction = await this.prisma.transaction.create({
//         data: {
//           ...dto,
//           createdById: userId,
//         },
//       });

//       // Update community fund balance based on transaction type and amount
//       await this.updateCommunityFund(dto.type, dto.amount);

//       return transaction;
//     } catch (error) {
//       // Log and rethrow with generic error to avoid leaking details
//       console.error("Error in createTransaction:", error);
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Failed to create transaction");
//     }
//   }

//   /**
//    * Update community fund balances in accordance with transaction type
//    * @param type - Transaction type enum
//    * @param amount - Monetary amount of the transaction
//    */
//   private async updateCommunityFund(type: TransactionType, amount: number) {
//     try {
//       // Fetch the single community fund record (assumed singleton)
//       const fund = await this.prisma.communityFund.findFirst();
//       if (!fund) {
//         throw new NotFoundException("Community fund record not initialized");
//       }

//       // Define credit and debit transaction classifications
//       const creditTypes: TransactionType[] = [
//         "DEPOSIT",
//         "LOAN_REPAYMENT",
//         "INTEREST",
//       ];
//       const debitTypes: TransactionType[] = [
//         "WITHDRAWAL",
//         "LOAN_ISSUE",
//         "FINE",
//       ];

//       const isCredit = creditTypes.includes(type);
//       const isDebit = debitTypes.includes(type);

//       if (!isCredit && !isDebit) {
//         throw new BadRequestException(`Unsupported transaction type: ${type}`);
//       }

//       // Compute new balances
//       const totalDeposit = isCredit
//         ? fund.totalDeposit + amount
//         : fund.totalDeposit;
//       const totalWithdraw = isDebit
//         ? fund.totalWithdraw + amount
//         : fund.totalWithdraw;
//       const netBalance = totalDeposit - totalWithdraw;

//       // Persist updated fund balances
//       await this.prisma.communityFund.update({
//         where: { id: fund.id },
//         data: {
//           totalDeposit,
//           totalWithdraw,
//           netBalance,
//         },
//       });
//     } catch (error) {
//       console.error("Error updating community fund:", error);
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Failed to update community fund");
//     }
//   }

//   /**
//    * Retrieve all transactions with linked account and creator details
//    * Restricted to admins - ensure controller guard enforces this
//    * @returns Array of transactions with related data
//    */
//   async getAllTransactions() {
//     try {
//       return await this.prisma.transaction.findMany({
//         include: {
//           account: true,
//           createdBy: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching all transactions:", error);
//       throw new InternalServerErrorException("Failed to fetch transactions");
//     }
//   }

//   /**
//    * Retrieve a single transaction by ID with authorization check
//    * @param id - Transaction ID
//    * @param user - Logged-in user object containing id and role
//    * @returns The transaction if found and authorized
//    */
//   async getTransactionById(id: string, user: { id: string; role: Role }) {
//     try {
//       const transaction = await this.prisma.transaction.findUnique({
//         where: { id },
//         include: { account: true, createdBy: true },
//       });

//       if (!transaction) {
//         throw new NotFoundException("Transaction not found");
//       }

//       // Authorization: ADMIN has full access, USER only if created the transaction
//       if (user.role !== "ADMIN" && transaction.createdById !== user.id) {
//         throw new ForbiddenException("Access denied to this transaction");
//       }

//       return transaction;
//     } catch (error) {
//       console.error("Error fetching transaction by id:", error);
//       if (
//         error instanceof NotFoundException ||
//         error instanceof ForbiddenException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Failed to fetch transaction");
//     }
//   }

//   /**
//    * Update an existing transaction by ID with validation and permission check
//    * @param id - Transaction ID to update
//    * @param dto - UpdateTransactionDto with new data
//    * @param user - Logged-in user object
//    * @returns Updated transaction entity
//    */
//   // async updateTransaction(
//   //   id: string,
//   //   dto: UpdateTransactionDto,
//   //   user: { id: string; role: Role },
//   // ) {
//   //   try {
//   //     // Fetch transaction to update
//   //     const transaction = await this.prisma.transaction.findUnique({
//   //       where: { id },
//   //     });
//   //     if (!transaction) {
//   //       throw new NotFoundException("Transaction not found");
//   //     }

//   //     // Authorization: only ADMIN or owner can update
//   //     if (user.role !== "ADMIN" && transaction.createdById !== user.id) {
//   //       throw new ForbiddenException("Unauthorized to update this transaction");
//   //     }

//   //     // Optionally validate accountId if being updated
//   //     if (dto.accountId && dto.accountId !== transaction.accountId) {
//   //       const account = await this.prisma.account.findUnique({
//   //         where: { id: dto.accountId },
//   //       });
//   //       if (!account) {
//   //         throw new NotFoundException("New account not found");
//   //       }
//   //     }

//   //     // Perform update
//   //     const updatedTransaction = await this.prisma.transaction.update({
//   //       where: { id },
//   //       data: dto,
//   //     });

//   //     // If amount or type changed, recalculate community fund balances
//   //     // Note: For simplicity, community fund update on update can be complex (requires rollback logic).
//   //     // Here, assume updates do not affect community fund; if they do, implement appropriate handling.

//   //     return updatedTransaction;
//   //   } catch (error) {
//   //     console.error("Error updating transaction:", error);
//   //     if (
//   //       error instanceof NotFoundException ||
//   //       error instanceof ForbiddenException ||
//   //       error instanceof BadRequestException
//   //     ) {
//   //       throw error;
//   //     }
//   //     throw new InternalServerErrorException("Failed to update transaction");
//   //   }
//   // }

//   /**
//    * Delete a transaction by ID with permission checks
//    * @param id - Transaction ID to delete
//    * @param user - Logged-in user object
//    * @returns Deleted transaction entity or confirmation
//    */
//   async deleteTransaction(id: string, user: { id: string; role: Role }) {
//     try {
//       const transaction = await this.prisma.transaction.findUnique({
//         where: { id },
//       });
//       if (!transaction) {
//         throw new NotFoundException("Transaction not found");
//       }

//       // Authorization: only ADMIN or owner can delete
//       if (user.role !== "ADMIN" && transaction.createdById !== user.id) {
//         throw new ForbiddenException("Unauthorized to delete this transaction");
//       }

//       await this.prisma.transaction.delete({ where: { id } });

//       return { message: "Transaction deleted successfully" };
//     } catch (error) {
//       console.error("Error deleting transaction:", error);
//       if (
//         error instanceof NotFoundException ||
//         error instanceof ForbiddenException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Failed to delete transaction");
//     }
//   }

//   /**
//    * Retrieve all transactions for a specific account with authorization
//    * @param accountId - Account ID to fetch transactions for
//    * @param user - Logged-in user object
//    * @returns Array of transactions for the given account
//    */
//   async getTransactionsByAccount(
//     accountId: string,
//     user: { id: string; role: Role },
//   ) {
//     try {
//       // Validate account existence
//       const account = await this.prisma.account.findUnique({
//         where: { id: accountId },
//       });
//       if (!account) {
//         throw new NotFoundException("Account not found");
//       }

//       // Authorization:
//       // ADMIN: full access
//       // USER: only if the user owns the account (assuming account has ownerId)
//       if (user.role !== "ADMIN" && account.id !== user.id) {
//         throw new ForbiddenException(
//           "Unauthorized access to account transactions",
//         );
//       }

//       // Fetch transactions belonging to the account
//       return await this.prisma.transaction.findMany({
//         where: { accountId },
//         include: { createdBy: true },
//         orderBy: { createdAt: "desc" },
//       });
//     } catch (error) {
//       console.error("Error fetching transactions by account:", error);
//       if (
//         error instanceof NotFoundException ||
//         error instanceof ForbiddenException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         "Failed to fetch transactions for account",
//       );
//     }
//   }
// }
