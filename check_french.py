import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'docker exec sam-backend find /app -name "*.seed.js" -o -name "seed*.ts" -o -name "*.seed.ts" | head -10',
    'docker exec sam-backend find /app/prisma -type f | head -20',
    'docker exec sam-backend grep -n "statusname" /app/prisma/schema.prisma | head -20',
    'docker exec sam-db psql -U samlogistic -d samlogistic -c "SELECT statusname FROM order_status WHERE statusname LIKE \'%livré%\' OR statusname LIKE \'%expédié%\' OR statusname LIKE \'%En cours%\' ORDER BY id;" 2>&1 || echo DB_FAIL',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-500:])

ssh.close()
