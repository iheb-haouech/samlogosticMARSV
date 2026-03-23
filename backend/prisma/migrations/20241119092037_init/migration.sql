-- CreateTable
CREATE TABLE "user_role" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_type" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "company_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_pack" (
    "id" SERIAL NOT NULL,
    "packName" TEXT NOT NULL,

    CONSTRAINT "user_pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_type" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "car_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_activity" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "company_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_dispo" (
    "id" SERIAL NOT NULL,
    "goingTo" TEXT,
    "startDay" TEXT,
    "endDay" TEXT,
    "startAt" TEXT,
    "endAt" TEXT,
    "comment" TEXT,
    "userId" INTEGER,

    CONSTRAINT "user_dispo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(20),
    "lastName" VARCHAR(20),
    "phone" VARCHAR(20),
    "email" VARCHAR(100) NOT NULL,
    "companyName" VARCHAR(50),
    "city" VARCHAR(20),
    "country" VARCHAR(20),
    "address" VARCHAR(50),
    "zipCode" VARCHAR(50),
    "websiteUrl" VARCHAR(50),
    "commercialRegister" VARCHAR(20),
    "patent" VARCHAR(20),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(255) NOT NULL,
    "resetPasswordToken" VARCHAR(255),
    "carNumber" TEXT,
    "carWidth" DOUBLE PRECISION,
    "carHeight" DOUBLE PRECISION,
    "carWeight" DOUBLE PRECISION,
    "carTypeId" INTEGER,
    "companyTypeId" INTEGER,
    "companyActivityId" INTEGER,
    "userPackId" INTEGER,
    "roleId" INTEGER DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_pod" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "podUrl" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT,
    "description" VARCHAR(500),
    "totalWeight" DOUBLE PRECISION,
    "totalLength" DOUBLE PRECISION,
    "totalWidth" DOUBLE PRECISION,
    "totalHeight" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "clientPrice" DOUBLE PRECISION,
    "transporterPrice" DOUBLE PRECISION,
    "totalQuantity" DOUBLE PRECISION,
    "shipmentPrice" DOUBLE PRECISION,
    "refrences" TEXT[],
    "orderStatusId" INTEGER DEFAULT 1,
    "createdByUserId" INTEGER,
    "deliveredByUserId" INTEGER,
    "startTransitAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_source" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "streetAddress" TEXT,
    "secondAddress" TEXT,
    "zipCode" TEXT,
    "email" TEXT,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "order_source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_recipient" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "streetAddress" TEXT,
    "secondAddress" TEXT,
    "zipCode" TEXT,
    "email" TEXT,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "order_recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_packages" (
    "id" SERIAL NOT NULL,
    "width" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "quantity" INTEGER,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "order_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oder_packages_reference" (
    "id" SERIAL NOT NULL,
    "referenceName" TEXT,
    "quantity" INTEGER,
    "packageId" INTEGER,

    CONSTRAINT "oder_packages_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status" (
    "id" SERIAL NOT NULL,
    "statusName" VARCHAR(20),

    CONSTRAINT "order_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_status" (
    "id" SERIAL NOT NULL,
    "statusName" TEXT,

    CONSTRAINT "claim_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_photos" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "claimMessageId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_message" (
    "id" SERIAL NOT NULL,
    "messageContent" TEXT,
    "claimId" INTEGER,
    "senderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim" (
    "id" SERIAL NOT NULL,
    "subject" TEXT,
    "description" TEXT,
    "statusId" INTEGER DEFAULT 1,
    "orderId" TEXT,
    "creatorUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_dispo_userId_key" ON "user_dispo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "order_trackingId_key" ON "order"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "order_source_orderId_key" ON "order_source"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_recipient_orderId_key" ON "order_recipient"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "article_title_key" ON "article"("title");

-- AddForeignKey
ALTER TABLE "user_dispo" ADD CONSTRAINT "user_dispo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "car_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyTypeId_fkey" FOREIGN KEY ("companyTypeId") REFERENCES "company_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyActivityId_fkey" FOREIGN KEY ("companyActivityId") REFERENCES "company_activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_userPackId_fkey" FOREIGN KEY ("userPackId") REFERENCES "user_pack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pod" ADD CONSTRAINT "order_pod_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_orderStatusId_fkey" FOREIGN KEY ("orderStatusId") REFERENCES "order_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_deliveredByUserId_fkey" FOREIGN KEY ("deliveredByUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_source" ADD CONSTRAINT "order_source_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_recipient" ADD CONSTRAINT "order_recipient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_packages" ADD CONSTRAINT "order_packages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oder_packages_reference" ADD CONSTRAINT "oder_packages_reference_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "order_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_photos" ADD CONSTRAINT "claim_photos_claimMessageId_fkey" FOREIGN KEY ("claimMessageId") REFERENCES "claim_message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_message" ADD CONSTRAINT "claim_message_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_message" ADD CONSTRAINT "claim_message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "claim_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
