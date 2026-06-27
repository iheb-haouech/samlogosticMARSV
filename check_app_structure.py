import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

stdin, stdout, stderr = ssh.exec_command('ls -la /opt/SamLogisticApp/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Root:')
print(out)

stdin, stdout, stderr = ssh.exec_command('ls -la /opt/SamLogisticApp/app/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nApp:')
print(out)

stdin, stdout, stderr = ssh.exec_command('ls -la /opt/SamLogisticApp/app/src/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nApp src:')
print(out)

ssh.close()
