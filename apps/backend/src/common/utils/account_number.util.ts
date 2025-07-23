import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";

@Injectable()
export class AccountNumberUtil {
  constructor(private readonly prisma: PrismaService) {}

  async generateAccountNumber(): Promise<string> {
    const prefix = "SMS9300";

    // ❶ Find the latest account number
    const lastAccount = await this.prisma.account.findFirst({
      where: {
        accountNumber: { startsWith: prefix },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        accountNumber: true,
      },
    });

    // ❷ Extract last sequence number
    let nextSeq = 1001; // start from 1001

    if (lastAccount?.accountNumber) {
      const lastSeq = parseInt(
        lastAccount.accountNumber.slice(prefix.length),
        10,
      );
      nextSeq = lastSeq + 1;
    }

    // ❸ Pad sequence to ensure 5 digits
    const paddedSeq = nextSeq.toString().padStart(5, "0");

    const accountNumber = `${prefix}${paddedSeq}`;

    // ❹ Ensure uniqueness (in case of race condition)
    const existing = await this.prisma.account.findUnique({
      where: { accountNumber },
    });

    if (existing) {
      return this.generateAccountNumber(); // retry if duplicate
    }

    return accountNumber;
  }
}
