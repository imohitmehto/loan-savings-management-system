-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'LOAN_ISSUE';
ALTER TYPE "TransactionType" ADD VALUE 'LOAN_REPAYMENT';
ALTER TYPE "TransactionType" ADD VALUE 'INTEREST';
ALTER TYPE "TransactionType" ADD VALUE 'FINE';
ALTER TYPE "TransactionType" ADD VALUE 'OTHER';

-- CreateTable
CREATE TABLE "CommunityFund" (
    "id" TEXT NOT NULL,
    "totalDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdraw" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityFund_pkey" PRIMARY KEY ("id")
);
