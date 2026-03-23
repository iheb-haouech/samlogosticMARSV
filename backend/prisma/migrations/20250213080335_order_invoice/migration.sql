-- CreateTable
CREATE TABLE "order_invoice" (
    "id" SERIAL NOT NULL,
    "matricule" TEXT,
    "totalHt" DOUBLE PRECISION,
    "tva" DOUBLE PRECISION,
    "ttc" DOUBLE PRECISION,
    "invoiceType" INTEGER,
    "generatedBy" INTEGER,
    "generatedFor" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "order_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_orderInvoices" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "order_invoice_matricule_key" ON "order_invoice"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "_orderInvoices_AB_unique" ON "_orderInvoices"("A", "B");

-- CreateIndex
CREATE INDEX "_orderInvoices_B_index" ON "_orderInvoices"("B");

-- AddForeignKey
ALTER TABLE "_orderInvoices" ADD CONSTRAINT "_orderInvoices_A_fkey" FOREIGN KEY ("A") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_orderInvoices" ADD CONSTRAINT "_orderInvoices_B_fkey" FOREIGN KEY ("B") REFERENCES "order_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
