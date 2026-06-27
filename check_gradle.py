import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

stdin, stdout, stderr = ssh.exec_command('cat /opt/SamLogisticApp/settings.gradle.kts')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('settings.gradle.kts:')
print(out)

stdin, stdout, stderr = ssh.exec_command('bash -lc "cd /opt/SamLogisticApp && gradle projects 2>&1"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\ngradle projects:')
print(out)

ssh.close()
