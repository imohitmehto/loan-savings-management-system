-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "aadhaarCard" TEXT,
ADD COLUMN     "panCard" TEXT,
ALTER COLUMN "photo" DROP NOT NULL;
