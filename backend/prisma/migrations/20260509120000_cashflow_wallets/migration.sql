ALTER TABLE "user"
ADD COLUMN "blocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;

CREATE TABLE "cashflow_transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cashflow_transaction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cashflow_transaction_userId_idx" ON "cashflow_transaction"("userId");

ALTER TABLE "cashflow_transaction"
ADD CONSTRAINT "cashflow_transaction_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
