import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'which java || echo NO_JAVA',
    'java -version 2>&1 || echo JAVA_FAIL',
    'which gradle || echo NO_GRADLE',
    'which git || echo NO_GIT',
    'uname -m',
    'cat /etc/os-release | head -5',
]
for cmd in cmds:
    print(f'\n===== {cmd} =====')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=15)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
