export const InitUsers = async (prismaClient: any) => {
  await prismaClient.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@samlogistic.tn',
      password: '$2b$10$K7xdHxFYMM9A.JoDXqpcTOVlQSjH1fW8Vyd.dOOJqWhjhwKoxVjfu',
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
};
