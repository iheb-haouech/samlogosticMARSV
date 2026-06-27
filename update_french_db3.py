import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

sql = b"""UPDATE order_status SET statusName = 'Cr\xc3\xa9\xc3\xa9' WHERE id = 1;
UPDATE order_status SET statusName = 'En attente' WHERE id = 2;
UPDATE order_status SET statusName = 'En cours de livraison' WHERE id = 3;
UPDATE order_status SET statusName = 'Livr\xc3\xa9' WHERE id = 4;
UPDATE order_status SET statusName = 'Annul\xc3\xa9' WHERE id = 5;
UPDATE order_status SET statusName = 'Retourn\xc3\xa9' WHERE id = 6;
UPDATE order_prices_status SET statusName = 'Aucune action' WHERE id = 1;
UPDATE order_prices_status SET statusName = 'En attente' WHERE id = 2;
UPDATE order_prices_status SET statusName = 'Confirm\xc3\xa9' WHERE id = 3;
UPDATE order_prices_status SET statusName = 'Refus\xc3\xa9' WHERE id = 4;
"""

bio = io.BytesIO(sql)
sftp = ssh.open_sftp()
sftp.putfo(bio, '/tmp/update_french.sql')
sftp.close()

# Verify file exists
stdin, stdout, stderr = ssh.exec_command("ls -la /tmp/update_french.sql")
print("FILE:", stdout.read().decode('utf-8', errors='replace').strip())

# Run SQL
cmd = "docker exec -i sam-db psql -U postgres -d vanlog -f /tmp/update_french.sql"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print("UPDATE RESULT:")
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

# Verify
cmd2 = "echo \"SELECT id, statusName FROM order_status ORDER BY id; SELECT * FROM order_prices_status ORDER BY id;\" | docker exec -i sam-db psql -U postgres -d vanlog"
stdin2, stdout2, stderr2 = ssh.exec_command(cmd2, timeout=20)
out2 = stdout2.read().decode('utf-8', errors='replace').strip()
err2 = stderr2.read().decode('utf-8', errors='replace').strip()
print("\nVERIFY:")
print(out2 if out2 else 'NO OUTPUT')

ssh.close()
