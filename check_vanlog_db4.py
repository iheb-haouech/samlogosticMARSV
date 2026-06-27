import paramiko, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Upload a small SQL script via SFTP
sql = "SELECT id, statusName FROM order_status ORDER BY id;\nSELECT * FROM order_prices_status ORDER BY id;\n"
sftp = ssh.open_sftp()
with sftp.open('/tmp/check.sql', 'w') as f:
    f.write(sql)
sftp.close()

cmd = "docker exec sam-db psql -U postgres -d vanlog -f /tmp/check.sql"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

ssh.close()
