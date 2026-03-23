export const InitCarTypes = async (prismaClient: any) => {
  await prismaClient.car_type.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, typeName: 'Moto' },
  });
  await prismaClient.car_type.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, typeName: 'Voiture' },
  });
  await prismaClient.car_type.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, typeName: 'Camion' },
  });
  await prismaClient.car_type.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, typeName: 'Remorque' },
  });
};
