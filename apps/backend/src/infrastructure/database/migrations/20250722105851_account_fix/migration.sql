/*
  Warnings:

  - The values [SAVINGS] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - Added the required column `Company_institute` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastName` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountOpeningFee` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `father_spounce` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine1` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('CURRENT', 'PERMANENT', 'NOMINEE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "OccupationType" AS ENUM ('BUSINESS', 'JOB', 'SELF_EMPLOYED', 'STUDENT', 'UNEMPLOYED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('SAVING', 'CURRENT', 'LOAN', 'FIXED_DEPOSIT');
ALTER TABLE "Account" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "name",
ADD COLUMN     "Company_institute" TEXT NOT NULL,
ADD COLUMN     "LastName" TEXT NOT NULL,
ADD COLUMN     "accountOpeningFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "father_spounce" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "isChildAccount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "occupation" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "district",
DROP COLUMN "pincode",
DROP COLUMN "street",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "pinCode" TEXT NOT NULL,
ADD COLUMN     "type" "AddressType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Nominee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "addressId" TEXT,
    "accountId" TEXT,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
