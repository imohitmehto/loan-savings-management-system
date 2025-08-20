import { TransactionType } from "@prisma/client";

export class TransactionResponseDto {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt: Date;
}
