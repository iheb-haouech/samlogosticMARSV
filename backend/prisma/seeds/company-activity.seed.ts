export const InitCompanyActivities = async (prismaClient: any) => {
  await prismaClient.company_activity.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, typeName: 'Industries agro-alimentaires' },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      typeName: 'Industries des matériaux de construction céramique et verre',
    },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, typeName: 'Industries mécaniques et métallurgiques' },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      typeName: "Industries électriques, électroniques et de l'électroménager",
    },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, typeName: 'Industries chimiques' },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 6 },
    update: {},
    create: { id: 6, typeName: 'Industries textiles et habillement' },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      typeName: "Industries du bois, du liège et de l'ameublement",
    },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 8 },
    update: {},
    create: { id: 8, typeName: 'Industries du cuir et de la chaussure' },
  });
  await prismaClient.company_activity.upsert({
    where: { id: 9 },
    update: {},
    create: { id: 9, typeName: 'Industries diverses' },
  });

  await prismaClient.company_activity.upsert({
    where: { id: 10 },
    update: {},
    create: { id: 10, typeName: 'Autre' },
  });
};
