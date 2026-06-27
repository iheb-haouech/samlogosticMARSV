import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'docker exec sam-backend find /app/prisma/seeds -name "*order-statuses*" -o -name "*order-prices*"',
    'docker exec sam-backend sh -c "grep -c Livré /app/prisma/seeds/order-statuses.seed.ts || echo TS_NOT_FOUND"',
    'docker exec sam-backend sh -c "grep -c Confirmé /app/prisma/seeds/order-prices-status.seed.ts || echo TS_NOT_FOUND"',
    'docker exec sam-backend sh -c "grep -c Livré /app/prisma/seeds/order-statuses.seed.js || echo JS_NOT_FOUND"',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stdout.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
