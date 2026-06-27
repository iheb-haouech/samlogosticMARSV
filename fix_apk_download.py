import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Read local nginx.conf
with open(r'C:\Users\Administrateur\Desktop\vanlog-master\frontend\nginx.conf', 'r', encoding='utf-8') as f:
    nginx_conf = f.read()

# Upload updated nginx.conf
sftp = ssh.open_sftp()
with sftp.open('/var/www/samlogistic/app/frontend/nginx.conf', 'w') as f:
    f.write(nginx_conf)
sftp.close()

# Copy APK into nginx container
stdin, stdout, stderr = ssh.exec_command('docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

# Test nginx config
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend nginx -t')
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('Nginx test:')
print(out)
if err: print('ERR:', err)

# Reload nginx
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend nginx -s reload')
stdout.read()

# Verify APK file in container
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK in container:')
print(out)

# Test download
stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -15')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload headers:')
print(out)

# Test actual download
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload test:')
print(out)

ssh.close()
