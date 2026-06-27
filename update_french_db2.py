import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Write SQL file via SFTP (avoids shell quoting issues)
sql = """UPDATE order_status SET statusName = 'Créé' WHERE id = 1;
UPDATE order_status SET statusName = 'En attente' WHERE id = 2;
UPDATE order_status SET statusName = 'En cours de livraison' WHERE id = 3;
UPDATE order_status SET statusName = 'Livré' WHERE id = 4;
UPDATE order_status SET statusName = 'Annulé' WHERE id = 5;
UPDATE order_status SET statusName = 'Retourné' WHERE id = 6;
UPDATE order_prices_status SET statusName = 'Aucune action' WHERE id = 1;
UPDATE order_prices_status SET statusName = 'En attente' WHERE id = 2;
UPDATE order_prices_status SET statusName = 'Confirmé' WHERE id = 3;
UPDATE order_prices_status SET statusName = 'Refusé' WHERE id = 4;
"""

sftp = ssh.open_sftp()
with sftp.open('/tmp/update_french.sql', 'w') as f:
    f.write(sql)
sftp.close()

cmd = "docker exec -i sam-db psql -U postgres -d vanlog -f /tmp/update_french.sql"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

# Verify
cmd2 = "echo \"SELECT id, statusName FROM order_status ORDER BY id;\" | docker exec -i sam-db psql -U postgres -d vanlog"
stdin2, stdout2, stderr2 = ssh.exec_command(cmd2, timeout=20)
out2 = stdout2.read().decode('utf-8', errors='replace').strip()
err2 = stderr2.read().decode('utf-8', errors='replace').strip()
print('\nVERIFY ORDER_STATUS:')
print(out2 if out2 else 'NO OUTPUT')

cmd3 = "echo \"SELECT * FROM order_prices_status ORDER BY id;\" | docker exec -i sam-db psql -U postgres -d vanlog"
stdin3, stdout3, stderr3 = ssh.exec_command(cmd3, timeout=20)
out3 = stdout3.read().decode('utf-8', errors='replace').strip()
err3 = stderr3.read().decode('utf-8', errors='replace').strip()
print('\nVERIFY ORDER_PRICES_STATUS:')
print(out3 if out3 else 'NO OUTPUT')

ssh.close()
