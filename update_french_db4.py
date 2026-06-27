import paramiko, sys, io, subprocess
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Create SQL file in a location accessible to both host and container via pipe
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

# Write to a temp file on host, then use docker cp to get it into a temp location inside container,
# then run psql from inside container. OR use docker exec with stdin piping.

# Best approach: open a direct exec channel and write SQL to stdin
transport = ssh.get_transport()
channel = transport.open_session()
channel.exec_command('docker exec -i sam-db psql -U postgres -d vanlog')
channel.send(sql.encode('utf-8'))
channel.shutdown_write()

out = channel.recv(4096).decode('utf-8', errors='replace')
err = channel.recv_stderr(4096).decode('utf-8', errors='replace')
print("UPDATE RESULT:")
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

# Verify
stdin, stdout, stderr = ssh.exec_command(
    "echo \"SELECT id, statusName FROM order_status ORDER BY id; SELECT * FROM order_prices_status ORDER BY id;\" | docker exec -i sam-db psql -U postgres -d vanlog",
    timeout=20
)
out2 = stdout.read().decode('utf-8', errors='replace').strip()
err2 = stderr.read().decode('utf-8', errors='replace').strip()
print("\nVERIFY:")
print(out2 if out2 else 'NO OUTPUT')

ssh.close()
