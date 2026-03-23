-- AlterTable
ALTER TABLE "order" ADD COLUMN     "paymentAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;
