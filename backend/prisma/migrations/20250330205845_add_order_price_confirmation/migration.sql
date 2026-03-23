-- AlterTable
ALTER TABLE "order" ADD COLUMN     "clientPriceStatusId" INTEGER DEFAULT 1,
ADD COLUMN     "transporterPriceStatusId" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "order_prices_status" (
    "id" SERIAL NOT NULL,
    "statusName" VARCHAR(20),

    CONSTRAINT "order_prices_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_clientPriceStatusId_fkey" FOREIGN KEY ("clientPriceStatusId") REFERENCES "order_prices_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_transporterPriceStatusId_fkey" FOREIGN KEY ("transporterPriceStatusId") REFERENCES "order_prices_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
