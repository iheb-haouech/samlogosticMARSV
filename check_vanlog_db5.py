import paramiko, sys, io, base64
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

sql = "SELECT id, statusName FROM order_status ORDER BY id;\nSELECT * FROM order_prices_status ORDER BY id;\n"
encoded = base64.b64encode(sql.encode('utf-8')).decode('ascii')

# Write file on server using base64 decode
cmd = f"echo {encoded} | base64 -d > /tmp/check.sql"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=10)
stdout.read()

# Run SQL
cmd2 = "docker exec sam-db psql -U postgres -d vanlog -f /tmp/check.sql"
stdin2, stdout2, stderr2 = ssh.exec_command(cmd2, timeout=20)
out = stdout2.read().decode('utf-8', errors='replace').strip()
err = stderr2.read().decode('utf-8', errors='replace').strip()
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

ssh.close()
