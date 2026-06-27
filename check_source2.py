import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    # Check source for qrCode
    'grep -rn qrCode /var/www/samlogistic/app/frontend/src/ 2>/dev/null | head -10',
    # Check delivery price fix in backend source  
    'grep -n transporterPrice /var/www/samlogistic/app/backend/src/orders/dto/update-order.dto.ts',
    # Check backend source for IsOptional import
    'head -5 /var/www/samlogistic/app/backend/src/orders/dto/update-order.dto.ts',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
