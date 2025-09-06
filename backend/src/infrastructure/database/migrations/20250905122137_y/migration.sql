-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'LOAN_ISSUE', 'LOAN_REPAYMENT', 'INTEREST', 'FINE', 'OTHER', 'CAPITAL_INFUSION', 'CASH_TO_BANK', 'BANK_TO_CASH');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "public"."InterestType" AS ENUM ('FLAT', 'REDUCING', 'FIXED', 'VARIABLE', 'HYBRID', 'ONE_TIME', 'MORTGAGE');

-- CreateEnum
CREATE TYPE "public"."TermPeriod" AS ENUM ('DAYS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "public"."FeeType" AS ENUM ('FLAT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "public"."LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'DEFAULTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."RepaymentStatus" AS ENUM ('PENDING', 'PAID', 'LATE', 'PARTIALLY_PAID');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('LEDGER', 'ANNUAL', 'QUARTERLY', 'MONTHLY', 'ACCOUNT_HISTORY', 'TRANSACTION_HISTORY', 'LOAN_SUMMARY', 'CUSTOM', 'COLLECTION');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'CLOSED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."PaymentMode" AS ENUM ('CASH', 'BANK', 'CHEQUE', 'ONLINE', 'FD', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "public"."TransactionCategory" AS ENUM ('ACCOUNT_DEPOSIT', 'ACCOUNT_WITHDRAWAL', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'INTEREST_INCOME', 'FEE', 'FUND_ALLOCATION', 'PROFIT_DISTRIBUTION', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fatherSpouse" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "companyInstitute" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "gender" "public"."Gender" NOT NULL,
    "dob" DATE NOT NULL,
    "photo" TEXT,
    "panCard" TEXT,
    "aadhaarCard" TEXT,
    "type" "public"."AccountType" NOT NULL,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "linkedAccountId" TEXT,
    "accountOpeningFee" DECIMAL(65,30) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "public"."AccountStatus" NOT NULL DEFAULT 'PENDING',
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "userId" TEXT NOT NULL,
    "groupId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "landmark" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nominee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "accountId" TEXT NOT NULL,
    "addressId" TEXT,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Loan" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "loanType" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "interestRate" DECIMAL(5,2) NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "emiAmount" DECIMAL(12,2) NOT NULL,
    "status" "public"."LoanStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "userId" TEXT,
    "loanPolicyId" TEXT,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoanPayment" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" "public"."PaymentMode" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "public"."RepaymentStatus" NOT NULL DEFAULT 'PAID',

    CONSTRAINT "LoanPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balanceAfter" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Repayment" (
    "id" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "public"."RepaymentStatus" NOT NULL,
    "loanId" TEXT NOT NULL,

    CONSTRAINT "Repayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoanPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "minAmount" DECIMAL(65,30) NOT NULL,
    "maxAmount" DECIMAL(65,30) NOT NULL,
    "interestType" "public"."InterestType" NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "termPeriod" "public"."TermPeriod" NOT NULL,
    "maxTerm" INTEGER NOT NULL,
    "applicationFeeType" "public"."FeeType" NOT NULL,
    "applicationFee" DECIMAL(65,30) NOT NULL,
    "processingFeeType" "public"."FeeType" NOT NULL,
    "processingFee" DECIMAL(65,30) NOT NULL,
    "latePaymentPenaltiesType" "public"."FeeType" NOT NULL,
    "latePaymentPenalties" DECIMAL(65,30) NOT NULL,
    "rules" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LedgerEntry" (
    "id" TEXT NOT NULL,
    "category" "public"."TransactionCategory" NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "debitAccount" TEXT,
    "creditAccount" TEXT,
    "balanceAfter" DECIMAL(12,2),
    "accountId" TEXT,
    "loanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "public"."User"("phone");

-- CreateIndex
CREATE INDEX "Otp_userId_otp_idx" ON "public"."Otp"("userId", "otp");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_otp_key" ON "public"."Otp"("userId", "otp");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "public"."Account"("accountNumber");

-- CreateIndex
CREATE INDEX "Account_accountNumber_idx" ON "public"."Account"("accountNumber");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE INDEX "Account_groupId_idx" ON "public"."Account"("groupId");

-- CreateIndex
CREATE INDEX "Account_status_idx" ON "public"."Account"("status");

-- CreateIndex
CREATE INDEX "Account_email_idx" ON "public"."Account"("email");

-- CreateIndex
CREATE INDEX "Account_phone_idx" ON "public"."Account"("phone");

-- CreateIndex
CREATE INDEX "LoanPayment_loanId_idx" ON "public"."LoanPayment"("loanId");

-- CreateIndex
CREATE INDEX "Transaction_accountId_idx" ON "public"."Transaction"("accountId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "public"."Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "public"."Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "public"."Transaction"("userId");

-- CreateIndex
CREATE INDEX "Repayment_loanId_idx" ON "public"."Repayment"("loanId");

-- CreateIndex
CREATE INDEX "Repayment_dueDate_idx" ON "public"."Repayment"("dueDate");

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_idx" ON "public"."LedgerEntry"("accountId");

-- CreateIndex
CREATE INDEX "LedgerEntry_loanId_idx" ON "public"."LedgerEntry"("loanId");

-- CreateIndex
CREATE INDEX "LedgerEntry_createdAt_idx" ON "public"."LedgerEntry"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."AccountGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nominee" ADD CONSTRAINT "Nominee_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nominee" ADD CONSTRAINT "Nominee_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_loanPolicyId_fkey" FOREIGN KEY ("loanPolicyId") REFERENCES "public"."LoanPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoanPayment" ADD CONSTRAINT "LoanPayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoanPayment" ADD CONSTRAINT "LoanPayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Repayment" ADD CONSTRAINT "Repayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
