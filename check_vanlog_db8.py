import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Use double quotes for the SQL column identifier, escaped for shell
sql = 'SELECT id, "statusName" FROM order_status ORDER BY id;'
cmd = f"echo '{sql}' | docker exec -i sam-db psql -U postgres -d vanlog"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('ORDER_STATUS:')
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

# Also check order_prices_status
cmd2 = "echo 'SELECT * FROM order_prices_status ORDER BY id;' | docker exec -i sam-db psql -U postgres -d vanlog"
stdin2, stdout2, stderr2 = ssh.exec_command(cmd2, timeout=20)
out2 = stdout2.read().decode('utf-8', errors='replace').strip()
err2 = stderr2.read().decode('utf-8', errors='replace').strip()
print('\nORDER_PRICES_STATUS:')
print(out2 if out2 else 'NO OUTPUT')

ssh.close()
