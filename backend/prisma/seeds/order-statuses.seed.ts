export const InitOrderStatuses = async (prismaClient: any) => {
  await prismaClient.order_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'En attente' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'En cours chargement' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'En transit' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: 'Livré' },
  });
  await prismaClient.order_status.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, statusName: 'Annulé' },
  });
};
