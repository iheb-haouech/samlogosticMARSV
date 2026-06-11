export const InitUsers = async (prismaClient: any) => {
  // Create Admin account
  await prismaClient.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      firstName: 'Arbi',
      lastName: 'Fadhli',
      email: 'contact@samlogistic.tn',
      password: '$2b$10$Wh1oiyCQAeKvZTZGzWPU5eUlPFpLvFG6HvwEyf7KfvB6xirfAyawa',
      roleId: 1,
      verified: true,
      phone: '26244098',
      companyName: 'SAM LOGISTIC',
      city: 'Tunis',
      country: 'Tunisie',
      address: 'tunisie',
      websiteUrl: 'https://samlogistic.tn/',
      zipCode: '10000',
    },
  });

};
