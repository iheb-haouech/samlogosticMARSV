export const InitOrderStatuses = async (prismaClient: any) => {
  await prismaClient.order_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'Created' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'Pending' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'In transit' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: 'Delivered' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, statusName: 'Canceled' },
  });
};
