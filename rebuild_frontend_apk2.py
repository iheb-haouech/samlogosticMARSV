import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL_FRONTEND = r'C:\Users\Administrateur\Desktop\vanlog-master\frontend'
TAR_FRONTEND = r'C:\Users\Administrateur\AppData\Local\Temp\frontend_src_small.tar'

if os.path.exists(TAR_FRONTEND):
    os.remove(TAR_FRONTEND)

# Create tar excluding node_modules, dist, .git
subprocess.run([
    'tar', '-cf', TAR_FRONTEND, '-C', LOCAL_FRONTEND,
    '--exclude=node_modules',
    '--exclude=dist',
    '--exclude=.git',
    '.'
], check=True, capture_output=True)
print(f'Frontend tar: {os.path.getsize(TAR_FRONTEND)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR_FRONTEND, '/tmp/frontend_src_small.tar')
sftp.close()

stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app/frontend && rm -rf src dist node_modules && tar -xf /tmp/frontend_src_small.tar')
stdout.read()

# Rebuild frontend
cmd = 'cd /var/www/samlogistic/app && docker compose build --no-cache frontend 2>&1 | tail -20'
print('\n>>> Building frontend (this may take a few minutes)...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=600)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-3000:])
if err: print('ERR:', err[-1000:])

# Restart
stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app && docker compose up -d --force-recreate frontend')
stdout.read()

# Verify
import time
time.sleep(5)

stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -12')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload headers:')
print(out)

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload test:')
print(out)

stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK in container:')
print(out)

ssh.close()
