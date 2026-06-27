import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    # Check APK file in nginx html
    'docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk',
    # Check nginx config
    'docker exec sam-frontend cat /etc/nginx/conf.d/default.conf',
    'docker exec sam-frontend cat /etc/nginx/conf.d/download.conf 2>/dev/null || echo NO_DOWNLOAD_CONF',
    # Check nginx mime types
    'docker exec sam-frontend cat /etc/nginx/mime.types',
    # Test download with headers
    'curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1',
    # Try to download and check file size
    'curl -sk -o /tmp/test.apk https://samlogistic.tn/SamLogisticApp.apk && ls -la /tmp/test.apk && file /tmp/test.apk',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-1000:])

ssh.close()
