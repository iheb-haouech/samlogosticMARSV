import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Update existing DB records to French
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
SELECT 'DONE';
"""

cmd = f"echo '{sql}' | docker exec -i sam-db psql -U postgres -d vanlog"
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print(out if out else 'NO OUTPUT')
if err: print('ERR:', err)

ssh.close()
