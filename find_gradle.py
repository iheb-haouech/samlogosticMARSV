import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

stdin, stdout, stderr = ssh.exec_command('ls -la /opt/gradle/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Gradle dir:')
print(out)

stdin, stdout, stderr = ssh.exec_command('find /opt/gradle -type f -name gradle')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nGradle binary:')
print(out)

stdin, stdout, stderr = ssh.exec_command('find /opt/gradle -maxdepth 3 -type f | head -20')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nGradle files:')
print(out)

ssh.close()
