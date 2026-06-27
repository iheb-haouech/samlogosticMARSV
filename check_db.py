import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'docker exec sam-db psql -U postgres -d samlogistic -c "SELECT id, statusname FROM order_status ORDER BY id;" 2>&1',
    'docker exec sam-db psql -U postgres -d samlogistic -c "SELECT id, status FROM order_prices_status ORDER BY id;" 2>&1',
    'docker exec sam-backend cat /app/prisma/seeds/order-statuses.seed.js',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-500:])

ssh.close()
