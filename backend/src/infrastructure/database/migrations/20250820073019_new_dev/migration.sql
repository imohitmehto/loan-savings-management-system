/*
  Warnings:

  - The `status` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `occupation` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `description` to the `AccountGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AccountStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "accountOpeningFee" DROP NOT NULL,
DROP COLUMN "occupation",
ADD COLUMN     "occupation" "public"."OccupationType" NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "companyInstitute" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."AccountGroup" ADD COLUMN     "description" TEXT NOT NULL;
