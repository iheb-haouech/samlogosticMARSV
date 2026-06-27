import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

cmds = [
    'docker exec sam-backend find /app/dist -type f -name "*.js" | head -20',
    'docker exec sam-backend sh -c "grep -rl SUPERADMIN /app/dist/ 2>/dev/null | head -5"',
    'docker exec sam-backend sh -c "grep -rl orderStatusesList /app/dist/ 2>/dev/null | head -5"',
    'docker exec sam-frontend ls /usr/share/nginx/html/assets/',
    'docker exec sam-frontend sh -c "cat /usr/share/nginx/html/assets/index-*.js 2>/dev/null | grep -l ApiClientWithHeaders || echo NO_MATCH"',
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
