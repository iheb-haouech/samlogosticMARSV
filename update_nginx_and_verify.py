import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Copy updated nginx.conf into running container
stdin, stdout, stderr = ssh.exec_command('docker cp /var/www/samlogistic/app/frontend/nginx.conf sam-frontend:/etc/nginx/conf.d/default.conf')
stdout.read()

# Verify APK exists in container
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('APK file:')
print(out)

# Test nginx config
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend nginx -t')
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('\nNginx test:')
print(out)
if err: print('ERR:', err)

# Reload nginx
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend nginx -s reload')
stdout.read()

# Test download with correct headers
stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nHeaders after reload:')
print(out)

# Test full download
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload test:')
print(out)

# Verify docker-compose.yml has volume mount
stdin, stdout, stderr = ssh.exec_command('grep -A 2 "volumes:" /var/www/samlogistic/app/docker-compose.yml | head -10')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDocker compose volumes:')
print(out)

ssh.close()
