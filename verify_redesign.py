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

# Verify design elements in built assets
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend sh -c "grep -o backdrop-filter /usr/share/nginx/html/assets/index-*.js | head -3"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nBackdrop filter (glassmorphism):')
print(out if out else 'NOT FOUND')

stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend sh -c "grep -o clamp /usr/share/nginx/html/assets/index-*.js | wc -l"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nClamp usage count:')
print(out)

# Verify download link still there
stdin, stdout, stderr = ssh.exec_command('docker exec sam-frontend sh -c "grep -o Télécharger /usr/share/nginx/html/assets/index-*.js | head -1"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload text:')
print(out if out else 'NOT FOUND')

# Quick browser check
stdin, stdout, stderr = ssh.exec_command('curl -sk https://samlogistic.tn/ 2>&1 | head -c 500')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nHomepage HTML:')
print(out)

ssh.close()
