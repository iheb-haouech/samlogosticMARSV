import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Check download headers
stdin, stdout, stderr = ssh.exec_command('curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Headers:')
print(out)

# Download and verify
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /tmp/final_verify.apk https://samlogistic.tn/SamLogisticApp.apk && md5sum /tmp/final_verify.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nMD5:')
print(out)

ssh.close()
