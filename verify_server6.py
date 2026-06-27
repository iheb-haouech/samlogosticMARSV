import paramiko, sys, io, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

cmds = [
    'curl -sk -o /dev/null -w "%{http_code}" http://127.0.0.1:6001/order-statuses-list -H "Authorization: Bearer invalid" 2>&1',
    'curl -sk http://127.0.0.1:3000/ 2>&1 | head -c 300',
    'docker exec sam-frontend sh -c "ls /usr/share/nginx/html/assets/client-*"',
    'docker exec sam-frontend sh -c "grep -c client-DARK /usr/share/nginx/html/assets/index-DW-4fiC_.js || echo NO_IMG"',
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
