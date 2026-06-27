import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Update docker-compose.yml on server with volume mount
stdin, stdout, stderr = ssh.exec_command('cat /var/www/samlogistic/app/docker-compose.yml')
original = stdout.read().decode('utf-8', errors='replace')

# Add volume mount to frontend service
updated = original.replace(
    '    depends_on:\n      - backend',
    '    volumes:\n      - /var/www/samlogistic/app/SamLogisticApp.apk:/usr/share/nginx/html/SamLogisticApp.apk:ro\n    depends_on:\n      - backend'
)

if updated != original:
    with io.BytesIO(updated.encode('utf-8')) as bio:
        sftp = ssh.open_sftp()
        with sftp.open('/var/www/samlogistic/app/docker-compose.yml', 'w') as f:
            f.write(updated)
        sftp.close()
    print('docker-compose.yml updated with volume mount')
else:
    print('docker-compose.yml already has volume mount')

# Copy APK into running container
stdin, stdout, stderr = ssh.exec_command('docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

# Restart with updated compose file
stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app && docker compose up -d --force-recreate frontend')
stdout.read()

import time
time.sleep(5)

# Verify mount is present
stdin, stdout, stderr = ssh.exec_command('docker inspect sam-frontend --format "{{.Mounts}}"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nContainer mounts:')
print(out)

# Verify APK in container
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK in container:')
print(out)

# Test download
stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -12')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nHeaders:')
print(out)

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload:')
print(out)

ssh.close()
