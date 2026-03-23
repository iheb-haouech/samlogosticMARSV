export const InitUsers = async (prismaClient: any) => {
  // Create Admin account
  await prismaClient.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      firstName: 'Arbi',
      lastName: 'Fadhli',
      email: 'support@vanlog-express.com',
      password: '$2b$10$Wh1oiyCQAeKvZTZGzWPU5eUlPFpLvFG6HvwEyf7KfvB6xirfAyawa',
      roleId: 2,
      verified: true,
      phone: '26244098',
      companyName: 'Vanlog Express',
      city: 'Tunis',
      country: 'Tunisie',
      address: 'tunisie',
      websiteUrl: 'https://vanlog-express.com/',
      zipCode: '10000',
    },
  });

  /*
  // Create Provider account
  await prismaClient.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'provider@gmail.com',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      roleId: 3,
      verified: true,
      phone: '2345678901',
      companyName: 'Provider Inc.',
      city: 'Provider City',
      country: 'Provider Country',
      address: '234 Provider Avenue',
      websiteUrl: 'https://provider.com',
      commercialRegister: 'CR654321',
      patent: 'PAT654321',
      zipCode: '37004',
    },
  });

  // Create Transporter Verified account
  await prismaClient.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      roleId: 4,
      verified: true,
      phone: '3456789012',
      companyName: 'Transporter Co.',
      city: 'Transport City',
      country: 'Transport Country',
      address: '345 Transport Road',
      websiteUrl: 'https://transporter.com',
      commercialRegister: 'CR789012',
      patent: 'PAT789012',
      carNumber: 'TRANS123',
      carWidth: 2.8,
      carHeight: 3.2,
      carWeight: 1600.0,
      carTypeId: 3,
      zipCode: '40004',
    },
  });

  // Create Transporter Not Verified account
  await prismaClient.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'transporter2@gmail.com',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      roleId: 4,
      verified: false,
      phone: '4567890123',
      companyName: 'Quick Transport',
      city: 'Quick City',
      country: 'Quick Country',
      address: '456 Quick Street',
      websiteUrl: 'https://quicktransport.com',
      commercialRegister: 'CR890123',
      patent: 'PAT890123',
      carNumber: 'QUICK123',
      carWidth: 2.4,
      carHeight: 2.8,
      carWeight: 1400.0,
      carTypeId: 3,
      zipCode: '27004',
    },
  });
  */
};
