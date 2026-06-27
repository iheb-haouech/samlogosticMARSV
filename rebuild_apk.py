import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL = r'C:\Users\Administrateur\Desktop\vanlog-master\SamLogisticApp'
TAR = r'C:\Users\Administrateur\AppData\Local\Temp\SamLogisticApp2.tar'

if os.path.exists(TAR):
    os.remove(TAR)
subprocess.run(['tar', '-cf', TAR, '-C', os.path.dirname(LOCAL), os.path.basename(LOCAL)], check=True, capture_output=True)
print(f'Tar size: {os.path.getsize(TAR)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR, '/tmp/SamLogisticApp2.tar')
sftp.close()

stdin, stdout, stderr = ssh.exec_command('rm -rf /opt/SamLogisticApp && mkdir -p /opt && tar -xf /tmp/SamLogisticApp2.tar -C /opt/ && rm /tmp/SamLogisticApp2.tar')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('bash -lc "echo sdk.dir=/opt/android-sdk > /opt/SamLogisticApp/local.properties"')
stdout.read()

# Verify settings
stdin, stdout, stderr = ssh.exec_command('cat /opt/SamLogisticApp/settings.gradle.kts')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('settings.gradle.kts:')
print(out)

# Build
cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=/opt/gradle/gradle-8.6/bin:$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools && cd /opt/SamLogisticApp && gradle :app:assembleRelease 2>&1 | tail -100"'
print('\n>>> Building APK...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-5000:])
if err: print('ERR:', err[-2000:])

stdin, stdout, stderr = ssh.exec_command('bash -lc "find /opt/SamLogisticApp -name \\"*.apk\\" -type f -ls"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK files:')
print(out if out else 'NO APK FOUND')

ssh.close()
