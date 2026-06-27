import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'docker exec sam-backend grep -n Livré /app/prisma/seeds/order-statuses.seed.js',
    'docker exec sam-backend grep -n Confirmé /app/prisma/seeds/order-prices-status.seed.js',
    'docker exec sam-backend grep -n "En attente" /app/prisma/seeds/order-statuses.seed.js',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stdout.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

# Final status query from DB
cmd = "echo \"SELECT id, statusName FROM order_status ORDER BY id; SELECT id, statusName FROM order_prices_status ORDER BY id;\" | docker exec -i sam-db psql -U postgres -d vanlog"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\n=== FINAL DB STATUS ===')
print(out if out else 'NO OUTPUT')

ssh.close()
