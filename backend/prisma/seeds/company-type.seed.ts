export const InitCompanyTypes = async (prismaClient: any) => {
  await prismaClient.company_type.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, typeName: 'Mise a la consommation' },
  });
  await prismaClient.company_type.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, typeName: 'Totalement exportatrice' },
  });
  await prismaClient.company_type.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, typeName: 'Partiellement exportatrice' },
  });
  await prismaClient.company_type.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, typeName: 'Autre' },
  });
};
