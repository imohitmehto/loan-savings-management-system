/*
  Warnings:

  - You are about to drop the column `companyInstitute` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `Account` table. All the data in the column will be lost.
  - Added the required column `companyInstitute` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "companyInstitute",
DROP COLUMN "LastName",
ADD COLUMN     "companyInstitute" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
