import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

sql = """UPDATE order_status SET "statusName" = 'Créé' WHERE id = 1;
UPDATE order_status SET "statusName" = 'En attente' WHERE id = 2;
UPDATE order_status SET "statusName" = 'En livraison' WHERE id = 3;
UPDATE order_status SET "statusName" = 'Livré' WHERE id = 4;
UPDATE order_status SET "statusName" = 'Annulé' WHERE id = 5;
UPDATE order_status SET "statusName" = 'Retourné' WHERE id = 6;
UPDATE order_prices_status SET "statusName" = 'Aucune action' WHERE id = 1;
UPDATE order_prices_status SET "statusName" = 'En attente' WHERE id = 2;
UPDATE order_prices_status SET "statusName" = 'Confirmé' WHERE id = 3;
UPDATE order_prices_status SET "statusName" = 'Refusé' WHERE id = 4;
"""

# Use a file in a shared tmp (on host, but we need it in container)
# Better: write to a file that persists, then docker cp into container
sftp = ssh.open_sftp()
with sftp.open('/tmp/update_french.sql', 'w') as f:
    f.write(sql)
sftp.close()

# Copy file into container
copy_cmd = "docker cp /tmp/update_french.sql sam-db:/tmp/update_french.sql"
stdin, stdout, stderr = ssh.exec_command(copy_cmd, timeout=10)
stdout.read()

# Run inside container
cmd = "docker exec sam-db psql -U postgres -d vanlog -f /tmp/update_french.sql"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print("UPDATE RESULT:")
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

# Verify both tables
cmd2 = "echo \"SELECT id, statusName FROM order_status ORDER BY id; SELECT * FROM order_prices_status ORDER BY id;\" | docker exec -i sam-db psql -U postgres -d vanlog"
stdin2, stdout2, stderr2 = ssh.exec_command(cmd2, timeout=20)
out2 = stdout2.read().decode('utf-8', errors='replace').strip()
err2 = stderr2.read().decode('utf-8', errors='replace').strip()
print("\nVERIFY:")
print(out2 if out2 else 'NO OUTPUT')

ssh.close()
