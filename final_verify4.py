import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    '''echo 'SELECT id, "statusName" FROM order_status ORDER BY id; SELECT id, "statusName" FROM order_prices_status ORDER BY id;' | docker exec -i sam-db psql -U postgres -d vanlog''',
    'docker exec sam-backend grep -n "roleId === 1 || roleId === 4" /app/dist/src/orders/orders.service.js',
    'docker exec sam-backend grep -c "order-statuses-list" /app/dist/src/app.controller.js || echo NO_ROUTE',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
