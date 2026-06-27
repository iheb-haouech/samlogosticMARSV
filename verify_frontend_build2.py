import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Search for evidence of the thunk in the bundled JS
cmds = [
    'docker exec sam-frontend sh -c "grep -o orderStatusesFetched /usr/share/nginx/html/assets/index-DW-4fiC_.js | head -3"',
    'docker exec sam-frontend sh -c "grep -o fetchOrderStatuses /usr/share/nginx/html/assets/index-DW-4fiC_.js | head -3"',
    'docker exec sam-frontend sh -c "grep -o order-statuses-list /usr/share/nginx/html/assets/index-DW-4fiC_.js | head -3"',
    'docker exec sam-frontend sh -c "grep -c /order-statuses-list /usr/share/nginx/html/assets/index-DW-4fiC_.js"',
    'docker exec sam-frontend sh -c "wc -c /usr/share/nginx/html/assets/index-DW-4fiC_.js"',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
