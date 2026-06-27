import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',
    "docker exec sam-frontend sh -c \"cat > /etc/nginx/conf.d/download.conf << 'EOF'\\nserver {\\n    listen 80;\\n    server_name localhost;\\n    location = /SamLogisticApp.apk {\\n        root /usr/share/nginx/html;\\n        add_header Content-Type application/vnd.android.package-archive;\\n        add_header Content-Disposition attachment;\\n    }\\n}\\nEOF\"",
    'docker exec sam-frontend nginx -s reload',
    'curl -sk -o /dev/null -w "%{http_code}" https://samlogistic.tn/SamLogisticApp.apk',
    'curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -10',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-2000:])
    if err: print('ERR:', err[-500:])

ssh.close()
