import { PrismaClient } from '@prisma/client';
import { InitUserRoles } from './seeds/user-role.seed';
import { InitCompanyTypes } from './seeds/company-type.seed';
import { InitOrderStatuses } from './seeds/order-statuses.seed';
import { InitCarTypes } from './seeds/car-types.seed';
import { InitUsers } from './seeds/user.seed';
import { InitClaimStatuses } from './seeds/claim-statuses.seed';
import { InitCompanyActivities } from './seeds/company-activity.seed';
import { IniOrderPricesStatuses } from './seeds/order-prices-status.seed';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // INIT ROLES
  await InitUserRoles(prisma);
  // INIT COmpany types and activities
  await InitCompanyTypes(prisma);
  await InitCompanyActivities(prisma);
  // INIT car types
  await InitCarTypes(prisma);
  // INIT order statuses
  await InitOrderStatuses(prisma);
  // INIT order Prices statuses
  await IniOrderPricesStatuses(prisma);
  //INIT Users
  await InitUsers(prisma);
  // INIT claim statuses
  await InitClaimStatuses(prisma);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
