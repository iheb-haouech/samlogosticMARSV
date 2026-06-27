import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'docker exec sam-backend grep -c Livré /app/prisma/seeds/order-statuses.seed.js',
    'docker exec sam-backend grep -c Confirmé /app/prisma/seeds/order-prices-status.seed.js',
    'echo "SELECT id, statusName FROM order_status ORDER BY id; SELECT id, statusName FROM order_prices_status ORDER BY id;" | docker exec -i sam-db psql -U postgres -d vanlog',
    'docker exec sam-backend grep -n "roleId === 1 || roleId === 4" /app/dist/src/orders/orders.service.js',
    'docker exec sam-backend grep -n "transporterPrice" /app/dist/src/orders/dto/update-order.dto.js',
    'curl -sk http://127.0.0.1:3000/ 2>&1 | head -c 200',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
