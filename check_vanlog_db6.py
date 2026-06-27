import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Use a heredoc via shell to create the SQL file
sql = """SELECT id, statusName FROM order_status ORDER BY id;
SELECT * FROM order_prices_status ORDER BY id;
"""

# Write via shell with a heredoc
create_cmd = """cat > /tmp/check.sql << 'PYEOF'
""" + sql + """PYEOF"""
stdin, stdout, stderr = ssh.exec_command(create_cmd, timeout=10)
stdout.read()
stderr.read()

# Verify file exists
check_cmd = "ls -la /tmp/check.sql"
stdin, stdout, stderr = ssh.exec_command(check_cmd, timeout=10)
print("FILE CHECK:", stdout.read().decode('utf-8', errors='replace').strip())

# Run SQL
run_cmd = "docker exec sam-db psql -U postgres -d vanlog -f /tmp/check.sql"
stdin, stdout, stderr = ssh.exec_command(run_cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print("DB OUTPUT:")
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

ssh.close()
