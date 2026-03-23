export const InitClaimStatuses = async (prismaClient: any) => {
  await prismaClient.claim_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: 'Pending' },
  });
  await prismaClient.claim_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: 'In Progress' },
  });
  await prismaClient.claim_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: 'Resolved' },
  });
  await prismaClient.claim_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: 'Closed' },
  });
};
