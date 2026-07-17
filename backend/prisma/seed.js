const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.user_role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, roleName: 'ADMIN' },
  });
  await prisma.user_role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, roleName: 'TRANSPORTER' },
  });
  await prisma.user_role.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, roleName: 'CLIENT' },
  });
  await prisma.user_role.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, roleName: 'SUPERADMIN' },
  });

  await prisma.company_type.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, typeName: 'Mise a la consommation' },
  });
  await prisma.company_type.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, typeName: 'Totalement exportatrice' },
  });
  await prisma.company_type.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, typeName: 'Partiellement exportatrice' },
  });
  await prisma.company_type.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, typeName: 'Autre' },
  });

  await prisma.company_activity.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, typeName: 'Industries agro-alimentaires' },
  });
  await prisma.company_activity.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, typeName: 'Industries des matériaux de construction céramique et verre' },
  });
  await prisma.company_activity.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, typeName: 'Industries mécaniques et métallurgiques' },
  });
  await prisma.company_activity.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, typeName: "Industries électriques, électroniques et de l'électroménager" },
  });
  await prisma.company_activity.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, typeName: 'Industries chimiques' },
  });
  await prisma.company_activity.upsert({
    where: { id: 6 },
    update: {},
    create: { id: 6, typeName: 'Industries textiles et habillement' },
  });
  await prisma.company_activity.upsert({
    where: { id: 7 },
    update: {},
    create: { id: 7, typeName: "Industries du bois, du liège et de l'ameublement" },
  });
  await prisma.company_activity.upsert({
    where: { id: 8 },
    update: {},
    create: { id: 8, typeName: 'Industries du cuir et de la chaussure' },
  });
  await prisma.company_activity.upsert({
    where: { id: 9 },
    update: {},
    create: { id: 9, typeName: 'Industries diverses' },
  });
  await prisma.company_activity.upsert({
    where: { id: 10 },
    update: {},
    create: { id: 10, typeName: 'Autre' },
  });

  await prisma.order_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'En attente' },
  });
  await prisma.order_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'En cours chargement' },
  });
  await prisma.order_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'En transit' },
  });
  await prisma.order_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: 'Livré' },
  });
  await prisma.order_status.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, statusName: 'Annulé' },
  });

  await prisma.car_type.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, typeName: 'Voiture' },
  });
  await prisma.car_type.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, typeName: 'Camion' },
  });
  await prisma.car_type.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, typeName: 'Moto' },
  });

  await prisma.order_prices_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'En attente' },
  });
  await prisma.order_prices_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'Accepté' },
  });
  await prisma.order_prices_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'Refusé' },
  });

  await prisma.claim_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'En attente' },
  });
  await prisma.claim_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'En cours' },
  });
  await prisma.claim_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'Résolu' },
  });
  await prisma.claim_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: 'Fermé' },
  });

  const superadminPassword = '$2b$10$oy6AUJUUUA5WPrDDIttb6ux1vzDI.1vNFX7kCz5cbCQgsDdEwq.ru';
  const adminPassword = '$2b$10$oy6AUJUUUA5WPrDDIttb6ux1vzDI.1vNFX7kCz5cbCQgsDdEwq.ru';

  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@samlogistic.tn',
      password: superadminPassword,
      roleId: 4,
      verified: true,
      phone: '',
      companyName: 'SAM LOGISTIC',
      city: 'Tunis',
      country: 'Tunisie',
      address: 'Tunisie',
      websiteUrl: 'https://samlogistic.tn/',
      zipCode: '10000',
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      firstName: 'Admin',
      lastName: 'User',
      email: 'arbifadhli@samlogistic.tn',
      password: adminPassword,
      roleId: 1,
      verified: true,
      phone: '',
      companyName: 'SAM LOGISTIC',
      city: 'Tunis',
      country: 'Tunisie',
      address: 'Tunisie',
      websiteUrl: 'https://samlogistic.tn/',
      zipCode: '10000',
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
