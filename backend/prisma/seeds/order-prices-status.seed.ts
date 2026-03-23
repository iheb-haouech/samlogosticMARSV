export const IniOrderPricesStatuses = async (prismaClient: any) => {
  await prismaClient.order_prices_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'No action' },
  });
  await prismaClient.order_prices_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'Waiting' },
  });
  await prismaClient.order_prices_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'Confirmed' },
  });
  await prismaClient.order_prices_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: 'Refused' },
  });
};
