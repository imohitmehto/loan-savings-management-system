/*
  Warnings:

  - You are about to drop the column `Company_institute` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `Account` table. All the data in the column will be lost.
  - Added the required column `company_institute` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "Company_institute",
DROP COLUMN "LastName",
ADD COLUMN     "company_institute" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
