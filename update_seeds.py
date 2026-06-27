import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ORDER_STATUSES = """export const InitOrderStatuses = async (prismaClient: any) => {
    await prismaClient.order_status.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, statusName: 'Créé' },
    });
    await prismaClient.order_status.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, statusName: 'En attente' },
    });
    await prismaClient.order_status.upsert({
        where: { id: 3 },
        update: {},
        create: { id: 3, statusName: 'En livraison' },
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
    await prismaClient.order_status.upsert({
        where: { id: 6 },
        update: {},
        create: { id: 6, statusName: 'Retourné' },
    });
};
"""

ORDER_PRICES = """export const IniOrderPricesStatuses = async (prismaClient: any) => {
    await prismaClient.order_prices_status.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, statusName: 'Aucune action' },
    });
    await prismaClient.order_prices_status.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, statusName: 'En attente' },
    });
    await prismaClient.order_prices_status.upsert({
        where: { id: 3 },
        update: {},
        create: { id: 3, statusName: 'Confirmé' },
    });
    await prismaClient.order_prices_status.upsert({
        where: { id: 4 },
        update: {},
        create: { id: 4, statusName: 'Refusé' },
    });
};
"""

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Write updated seed files
sftp = ssh.open_sftp()
with sftp.open('/var/www/samlogistic/app/backend/prisma/seeds/order-statuses.seed.ts', 'w') as f:
    f.write(ORDER_STATUSES)
with sftp.open('/var/www/samlogistic/app/backend/prisma/seeds/order-prices-status.seed.ts', 'w') as f:
    f.write(ORDER_PRICES)
sftp.close()

# Verify
for path in [
    '/var/www/samlogistic/app/backend/prisma/seeds/order-statuses.seed.ts',
    '/var/www/samlogistic/app/backend/prisma/seeds/order-prices-status.seed.ts'
]:
    stdin, stdout, stderr = ssh.exec_command(f'grep -n Créé {path}; grep -n Confirmé {path}')
    out = stdout.read().decode('utf-8', errors='replace').strip()
    print(f'\n{path}:')
    print(out if out else 'NO FRENCH LABELS FOUND')

ssh.close()
