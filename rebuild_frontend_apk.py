import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL_FRONTEND = r'C:\Users\Administrateur\Desktop\vanlog-master\frontend'
TAR_FRONTEND = r'C:\Users\Administrateur\AppData\Local\Temp\frontend_src.tar'

if os.path.exists(TAR_FRONTEND):
    os.remove(TAR_FRONTEND)
subprocess.run(['tar', '-cf', TAR_FRONTEND, '-C', LOCAL_FRONTEND, '.'], check=True, capture_output=True)
print(f'Frontend tar: {os.path.getsize(TAR_FRONTEND)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR_FRONTEND, '/tmp/frontend_src.tar')
sftp.close()

stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app/frontend && rm -rf src dist node_modules && tar -xf /tmp/frontend_src.tar')
stdout.read()

# Ensure APK exists on host
stdin, stdout, stderr = ssh.exec_command('ls -la /var/www/samlogistic/app/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('APK on host:')
print(out)

# Rebuild frontend
cmd = 'cd /var/www/samlogistic/app && docker compose build --no-cache frontend 2>&1 | tail -20'
print('\n>>> Building frontend...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=300)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-3000:])
if err: print('ERR:', err[-1000:])

# Restart with volume mount for APK
stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app && docker compose up -d --force-recreate frontend')
stdout.read()

# Verify
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend cat /etc/nginx/conf.d/default.conf')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nNginx config in container:')
print(out[-1000:])

stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -12')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload headers:')
print(out)

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload test:')
print(out)

# Verify APK in container persists after recreate
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK in container:')
print(out)

ssh.close()
