export const InitUsers = async (prismaClient: any) => {
  const superadminPassword = '$2b$10$oy6AUJUUUA5WPrDDIttb6ux1vzDI.1vNFX7kCz5cbCQgsDdEwq.ru';
  const adminPassword = '$2b$10$oy6AUJUUUA5WPrDDIttb6ux1vzDI.1vNFX7kCz5cbCQgsDdEwq.ru';

  await prismaClient.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
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

  await prismaClient.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
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
};
