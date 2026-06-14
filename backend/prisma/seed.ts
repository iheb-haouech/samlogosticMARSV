import { PrismaClient } from '@prisma/client';
import { InitUserRoles } from './seeds/user-role.seed';
import { InitCompanyTypes } from './seeds/company-type.seed';
import { InitOrderStatuses } from './seeds/order-statuses.seed';
import { InitCarTypes } from './seeds/car-types.seed';
import { InitUsers } from './seeds/user.seed';
import { InitClaimStatuses } from './seeds/claim-statuses.seed';
import { InitCompanyActivities } from './seeds/company-activity.seed';
import { IniOrderPricesStatuses } from './seeds/order-prices-status.seed';

const prisma = new PrismaClient();

async function main() {
  await InitUserRoles(prisma);
  await InitCompanyTypes(prisma);
  await InitCompanyActivities(prisma);
  await InitCarTypes(prisma);
  await InitOrderStatuses(prisma);
  await IniOrderPricesStatuses(prisma);
  await InitUsers(prisma);
  await InitClaimStatuses(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
