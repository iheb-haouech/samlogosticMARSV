import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

stdin, stdout, stderr = ssh.exec_command('curl -sk https://samlogistic.tn/SamLogisticApp.apk | head -c 200')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('APK content start:')
print(out)

stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -20')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK headers:')
print(out)

# Check if the download link text is in the JS bundle
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend sh -c "grep -o Télécharger /usr/share/nginx/html/assets/index-*.js | head -1"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFrench download text in JS:')
print(out if out else 'NOT FOUND')

# Check nginx config
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend cat /etc/nginx/conf.d/default.conf')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nNginx config:')
print(out)

ssh.close()
