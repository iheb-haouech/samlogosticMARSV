import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

cmds = [
    'docker exec sam-backend grep -n "roleId === 1" /app/dist/src/orders/orders.service.js',
    'docker exec sam-backend grep -n "roleId === 4" /app/dist/src/orders/orders.service.js',
    'docker exec sam-frontend sh -c "grep -o \"fr\" /usr/share/nginx/html/index.html | head -3"',
    'docker exec sam-frontend sh -c "grep -c \"lang=\\\\\"fr\\\\\"\" /usr/share/nginx/html/index.html || echo NO_LANG"',
    'docker exec sam-backend sh -c "ls /app/dist/src/orders/dto/"',
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
