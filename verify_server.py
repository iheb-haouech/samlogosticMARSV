import paramiko, sys, io, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

cmds = [
    'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:6001/orders/statuses 2>&1',
    'curl -sk -o /dev/null -w "%{http_code}" https://api.samlogistic.tn/health 2>&1 || echo DOMAIN_FAIL',
    'curl -sk https://api.samlogistic.tn 2>&1 | head -c 500 || echo DOMAIN_FAIL',
    'docker exec sam-backend sh -c "grep -c transporterPrice /app/dist/src/orders/dto/update-order.dto.js || echo NOT_IN_BUILD"',
    'docker exec sam-backend sh -c "grep -c ApiClientWithHeaders /app/dist/src/features/order/orderSlice.js || echo NOT_IN_BUILD"',
]
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-1000:])
    if err: print('ERR:', err[-500:])
ssh.close()
