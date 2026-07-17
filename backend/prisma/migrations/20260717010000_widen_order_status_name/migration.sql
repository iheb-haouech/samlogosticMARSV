-- Widen order_status.statusName to fit longer labels (e.g. "En cours de livraison" = 22 chars)
ALTER TABLE "order_status" ALTER COLUMN "statusName" SET DATA TYPE VARCHAR(30);
