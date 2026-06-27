import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    "docker exec sam-db psql -U postgres -c '\\l'",
    "docker exec sam-db psql -U postgres -c \"SELECT datname FROM pg_database WHERE datistemplate = false;\"",
    "docker exec sam-backend sh -c 'cat /app/prisma/.env' 2>/dev/null || echo NO_ENV",
    "docker exec sam-backend sh -c 'env | grep DATABASE_URL'",
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-500:])

ssh.close()
