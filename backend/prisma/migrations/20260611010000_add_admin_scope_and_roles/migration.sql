UPDATE "user_role" SET "roleName" = 'ADMIN' WHERE "id" = 1;
UPDATE "user_role" SET "roleName" = 'TRANSPORTER' WHERE "id" = 2;
UPDATE "user_role" SET "roleName" = 'CLIENT' WHERE "id" = 3;
UPDATE "user_role" SET "roleName" = 'SUPERADMIN' WHERE "id" = 4;

INSERT INTO "user_role" ("id", "roleName")
VALUES
  (1, 'ADMIN'),
  (2, 'TRANSPORTER'),
  (3, 'CLIENT'),
  (4, 'SUPERADMIN')
ON CONFLICT ("id") DO UPDATE SET "roleName" = EXCLUDED."roleName";

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "adminManagedCities" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isMainAdmin" BOOLEAN NOT NULL DEFAULT false;
