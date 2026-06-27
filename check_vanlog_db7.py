import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Pipe SQL directly to psql
sql = "SELECT id, statusName FROM order_status ORDER BY id;\nSELECT * FROM order_prices_status ORDER BY id;\n"
cmd = f"echo '{sql}' | docker exec -i sam-db psql -U postgres -d vanlog"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

ssh.close()
