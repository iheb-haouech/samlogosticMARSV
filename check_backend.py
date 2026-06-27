import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'curl -sk https://api.samlogistic.tn/orders/all-orders -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlkIjoxLCJyb2xlIjoxLCJpYXQiOjE3MjE1MjExNzMsImV4cCI6MTcyMTYwNzU3M30.dummy" 2>&1 | head -c 500',
    'curl -sk https://api.samlogistic.tn/order-statuses-list 2>&1 | head -c 500',
    'curl -sk https://api.samlogistic.tn/statistics 2>&1 | head -c 500',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-500:])
    if err: print('ERR:', err[-200:])

ssh.close()
