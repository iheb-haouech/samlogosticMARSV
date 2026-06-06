-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('B2B', 'B2C');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "mainType" TEXT,
ADD COLUMN     "otherMessage" TEXT,
ADD COLUMN     "subType" TEXT,
ADD COLUMN     "tradeType" TEXT,
ADD COLUMN     "transportType" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'B2B';
