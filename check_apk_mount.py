import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'ls -la /var/www/samlogistic/app/SamLogisticApp.apk',
    'docker inspect sam-frontend --format "{{.Mounts}}"',
    'docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk',
    'docker exec sam-frontend cat /etc/nginx/conf.d/default.conf',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
