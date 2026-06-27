import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

stdin, stdout, stderr = ssh.exec_command('cd /var/www/samlogistic/app && docker compose up -d --force-recreate frontend')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Containers:')
print(out)

# Verify the download link is live
stdin, stdout, stderr = ssh.exec_command('curl -sk https://samlogistic.tn/ 2>&1 | grep -o "Télécharger l\'application" || echo NOT_FOUND')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFrench download text found:')
print(out)

# Quick APK check
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK size (bytes):')
print(out)

ssh.close()
