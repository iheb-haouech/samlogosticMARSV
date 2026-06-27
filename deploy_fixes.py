import paramiko, sys, os, io, subprocess
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL_BACKEND = r'C:\Users\Administrateur\Desktop\vanlog-master\backend'
LOCAL_FRONTEND = r'C:\Users\Administrateur\Desktop\vanlog-master\frontend'
TAR_BACKEND = r'C:\Users\Administrateur\AppData\Local\Temp\backend_src.tar'
TAR_FRONTEND = r'C:\Users\Administrateur\AppData\Local\Temp\frontend_src.tar'

# Create backend tar (src + prisma/seeds)
if os.path.exists(TAR_BACKEND):
    os.remove(TAR_BACKEND)
subprocess.run(['tar', '-cf', TAR_BACKEND, '-C', LOCAL_BACKEND, 'src', 'prisma/seeds'], check=True, capture_output=True)
print(f'Backend src+seeds tar: {os.path.getsize(TAR_BACKEND)} bytes')

# Create frontend tar
if os.path.exists(TAR_FRONTEND):
    os.remove(TAR_FRONTEND)
subprocess.run(['tar', '-cf', TAR_FRONTEND, '-C', LOCAL_FRONTEND, 'src'], check=True, capture_output=True)
print(f'Frontend src tar: {os.path.getsize(TAR_FRONTEND)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR_BACKEND, '/tmp/backend_src.tar')
sftp.put(TAR_FRONTEND, '/tmp/frontend_src.tar')
sftp.close()

cmds = [
    'cd /var/www/samlogistic/app/backend && tar -xf /tmp/backend_src.tar',
    'cd /var/www/samlogistic/app/frontend && tar -xf /tmp/frontend_src.tar',
    'grep -c "ApiClientWithHeaders(token)" /var/www/samlogistic/app/frontend/src/features/order/orderSlice.ts || echo NOT_FOUND',
    'grep -c "transporterPrice?: number" /var/www/samlogistic/app/backend/src/orders/dto/update-order.dto.ts || echo NOT_FOUND',
    'grep -c Confirmé /var/www/samlogistic/app/backend/prisma/seeds/order-prices-status.seed.js || echo NO_FRENCH',
    'grep -c Livré /var/www/samlogistic/app/backend/prisma/seeds/order-statuses.seed.js || echo NO_FRENCH',
]
for cmd in cmds:
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=15)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stdout.read().decode('utf-8', errors='replace').strip()
    print(f'=== {cmd} ===')
    print('OUT:', out)
    if err: print('ERR:', err)

print('\nRebuilding...')
stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app && docker compose build --no-cache backend frontend 2>&1 | tail -30', timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Build:', out[-3000:])

stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app && docker compose up -d --force-recreate')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.CreatedAt}}"')
print('\nContainers:')
print(stdout.read().decode('utf-8', errors='replace').strip())

ssh.close()
print('[DONE]')
