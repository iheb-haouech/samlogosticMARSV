import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    # Check for QR code references in bundle
    'docker exec sam-frontend sh -c "grep -o qrCode\\|qrcode\\|qr_code /usr/share/nginx/html/assets/index-DW-4fiC_.js | head -5"',
    # Check for delivery price update in backend
    'docker exec sam-backend grep -n "transporterPrice" /app/dist/src/orders/dto/update-order.dto.js | head -5',
    # Check order_prices_status table has French labels
    'echo "SELECT id, statusName FROM order_prices_status ORDER BY id;" | docker exec -i sam-db psql -U postgres -d vanlog',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stdout.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
