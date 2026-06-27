import paramiko, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Copy project to server
LOCAL = r'C:\Users\Administrateur\Desktop\vanlog-master\SamLogisticApp'
REMOTE = '/opt/SamLogisticApp'

sftp = ssh.open_sftp()
for root, dirs, files in os.walk(LOCAL):
    rel = os.path.relpath(root, LOCAL)
    remote_dir = os.path.join(REMOTE, rel).replace('\\', '/')
    try:
        sftp.stat(remote_dir)
    except:
        sftp.mkdir(remote_dir)
        sftp.chdir(remote_dir)
        sftp.chdir('..')
    for f in files:
        local_path = os.path.join(root, f)
        remote_path = os.path.join(remote_dir, f).replace('\\', '/')
        sftp.put(local_path, remote_path)

sftp.close()

# Set up local.properties
stdin, stdout, stderr = ssh.exec_command('bash -lc "echo sdk.dir=/opt/android-sdk > /opt/SamLogisticApp/local.properties"')
stdout.read()

# Verify
stdin, stdout, stderr = ssh.exec_command('ls /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Project copied:')
print(out)

ssh.close()
