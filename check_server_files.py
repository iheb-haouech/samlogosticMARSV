import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'head -30 /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/navigation/NavGraph.kt',
    'head -5 /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/navigation/Screen.kt',
    'head -5 /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/CreateOrderScreen.kt',
    'head -5 /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/OrdersScreen.kt',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=10)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    else: print('EMPTY')

ssh.close()
