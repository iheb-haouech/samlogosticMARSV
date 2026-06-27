import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'wget -q https://services.gradle.org/distributions/gradle-8.6-bin.zip -O /tmp/gradle-8.6-bin.zip',
    'mkdir -p /opt/gradle/gradle-8.6',
    'unzip -q /tmp/gradle-8.6-bin.zip -d /opt/gradle/',
    'rm /tmp/gradle-8.6-bin.zip',
    'export PATH=/opt/gradle/gradle-8.6/bin:$PATH && gradle --version',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=120)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-2000:])
    if err: print('ERR:', err[-1000:])

ssh.close()
