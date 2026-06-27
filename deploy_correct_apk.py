import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'find /opt/SamLogisticApp/app/build/outputs -name "*.apk" -type f -ls',
    '/opt/android-sdk/build-tools/34.0.0/apksigner verify --print-certs /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk',
    'file /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

# Deploy the correct signed APK
stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk /var/www/samlogistic/app/SamLogisticApp.apk && docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /tmp/test_final3.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk && md5sum /tmp/test_final3.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFinal download:')
print(out)

ssh.close()
