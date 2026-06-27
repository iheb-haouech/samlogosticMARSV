import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

cmds = [
    'docker exec sam-backend find /app/dist -type f -name "orders.service.js" -o -name "orders.controller.js" -o -name "orders.service.d.ts" | head -10',
    'docker exec sam-backend grep -n "SUPERADMIN\\|superadmin" /app/dist/src/orders/orders.service.js || echo NOT_FOUND',
    'docker exec sam-backend grep -n "findAll\\|role" /app/dist/src/orders/orders.service.js | head -20',
    'docker exec sam-frontend grep -c "headers" /usr/share/nginx/html/assets/index-DW-4fiC_.js || echo NO_HEADERS',
    'docker exec sam-frontend grep -c "Authorization" /usr/share/nginx/html/assets/index-DW-4fiC_.js || echo NO_AUTH',
    'docker exec sam-backend grep -n "orderStatuses" /app/dist/src/orders/orders.service.js | head -20',
    'docker exec sam-backend grep -n "transporterPrice" /app/dist/src/orders/dto/update-order.dto.js',
    'docker exec sam-backend grep -n "IsOptional" /app/dist/src/orders/dto/update-order.dto.js | head -10',
]
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-500:])
ssh.close()
