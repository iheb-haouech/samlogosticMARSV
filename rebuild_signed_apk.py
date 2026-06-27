import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL = r'C:\Users\Administrateur\Desktop\vanlog-master\SamLogisticApp'
TAR = r'C:\Users\Administrateur\AppData\Local\Temp\SamLogisticApp_signed.tar'

if os.path.exists(TAR):
    os.remove(TAR)
subprocess.run(['tar', '-cf', TAR, '-C', os.path.dirname(LOCAL), '--exclude=node_modules', '--exclude=dist', '--exclude=.git', os.path.basename(LOCAL)], check=True, capture_output=True)
print(f'Tar size: {os.path.getsize(TAR)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR, '/tmp/SamLogisticApp_signed.tar')
sftp.close()

stdin, stdout, stderr = ssh.exec_command('rm -rf /opt/SamLogisticApp && mkdir -p /opt && tar -xf /tmp/SamLogisticApp_signed.tar -C /opt/ && rm /tmp/SamLogisticApp_signed.tar')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('bash -lc "echo sdk.dir=/opt/android-sdk > /opt/SamLogisticApp/local.properties"')
stdout.read()

cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon --refresh-dependencies :app:assembleRelease 2>&1 | tail -80"'
print('\n>>> Building signed APK...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-6000:])
if err: print('ERR:', err[-2000:])

# Verify signed output
stdin, stdout, stderr = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner verify /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk')
stdout.read()

# Copy signed to web
stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk /var/www/samlogistic/app/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

# Test
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /tmp/test_final.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFinal download test:')
print(out)

stdin, stdout, stderr = ssh.exec_command('md5sum /tmp/test_final.apk /var/www/samlogistic/app/SamLogisticApp.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nMD5 check:')
print(out)

ssh.close()
