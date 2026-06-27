import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'md5sum /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',
    'docker exec sam-frontend md5sum /usr/share/nginx/html/SamLogisticApp.apk',
    'docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk',
    'docker exec sam-frontend unzip -l /usr/share/nginx/html/SamLogisticApp.apk | head -40',
    'file /var/www/samlogistic/app/SamLogisticApp.apk',
    '/opt/android-sdk/build-tools/34.0.0/apksigner verify /var/www/samlogistic/app/SamLogisticApp.apk',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-1000:])

ssh.close()
