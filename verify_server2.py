import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

cmds = [
    'docker exec sam-frontend ls /usr/share/nginx/html/',
    'docker exec sam-frontend sh -c "grep -l ApiClientWithHeaders /usr/share/nginx/html/*.js 2>/dev/null | head -3"',
    'curl -sk https://api.samlogistic.tn/orders/all 2>&1 | head -c 500',
    'docker exec sam-backend sh -c "grep -c order_statuses /app/dist/src/orders/orders.service.js || echo NO_STATUS"',
    'docker exec sam-backend sh -c "grep -c SUPERADMIN /app/dist/src/orders/orders.service.js || echo NO_SUPERADMIN"',
]
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-2000:])
    if err: print('ERR:', err[-500:])
ssh.close()
