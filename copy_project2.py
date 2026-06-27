import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL = r'C:\Users\Administrateur\Desktop\vanlog-master\SamLogisticApp'
TAR = r'C:\Users\Administrateur\AppData\Local\Temp\SamLogisticApp.tar'

# Create tar
if os.path.exists(TAR):
    os.remove(TAR)
subprocess.run(['tar', '-cf', TAR, '-C', os.path.dirname(LOCAL), os.path.basename(LOCAL)], check=True, capture_output=True)
print(f'Tar size: {os.path.getsize(TAR)} bytes')

# Upload via SFTP
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR, '/tmp/SamLogisticApp.tar')
sftp.close()

# Extract on server
stdin, stdout, stderr = ssh.exec_command('mkdir -p /opt && tar -xf /tmp/SamLogisticApp.tar -C /opt/ && rm /tmp/SamLogisticApp.tar')
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('Extract:', out if out else 'OK')
if err: print('ERR:', err)

# Set up local.properties
stdin, stdout, stderr = ssh.exec_command('bash -lc "echo sdk.dir=/opt/android-sdk > /opt/SamLogisticApp/local.properties"')
stdout.read()

# Verify
stdin, stdout, stderr = ssh.exec_command('ls /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nProject files:')
print(out)

ssh.close()
