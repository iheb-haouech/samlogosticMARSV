import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'
APP = '/var/www/samlogistic/app'

cmds = [
    f'cd {APP} && docker compose build --no-cache backend 2>&1 | tail -30',
    f'cd {APP} && docker compose up -d --force-recreate backend 2>&1',
    'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"',
]
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=600)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-4000:])
    if err: print('ERR:', err[-2000:])
ssh.close()
