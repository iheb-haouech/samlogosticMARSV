import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL = r'C:\Users\Administrateur\Desktop\vanlog-master\SamLogisticApp'
TAR = r'C:\Users\Administrateur\AppData\Local\Temp\SamLogisticApp_final.tar'

if os.path.exists(TAR):
    os.remove(TAR)
subprocess.run(['tar', '-cf', TAR, '-C', os.path.dirname(LOCAL), '--exclude=node_modules', '--exclude=dist', '--exclude=.git', os.path.basename(LOCAL)], check=True, capture_output=True)
print(f'Tar size: {os.path.getsize(TAR)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR, '/tmp/SamLogisticApp_final.tar')
sftp.close()

stdin, stdout, stderr = ssh.exec_command('rm -rf /opt/SamLogisticApp && mkdir -p /opt && tar -xf /tmp/SamLogisticApp_final.tar -C /opt/ && rm /tmp/SamLogisticApp_final.tar')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('bash -lc "echo sdk.dir=/opt/android-sdk > /opt/SamLogisticApp/local.properties"')
stdout.read()

# Build signed APK
cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon clean :app:assembleRelease 2>&1 | tail -40"'
print('\n>>> Building APK...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-5000:])
if err: print('ERR:', err[-2000:])

# Find signed APK
stdin, stdout, stderr = ssh.exec_command('find /opt/SamLogisticApp/app/build/outputs -name "*.apk" -type f -ls')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK files:')
print(out)

# Sign if needed
stdin, stdout, stderr = ssh.exec_command('for f in $(find /opt/SamLogisticApp/app/build/outputs -name "*.apk" -type f); do /opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out ${f%.*}-signed.apk $f 2>/dev/null; done')
stdout.read()

# Deploy latest APK
stdin, stdout, stderr = ssh.exec_command('cp $(find /opt/SamLogisticApp/app/build/outputs -name "*-signed.apk" -type f | head -1) /var/www/samlogistic/app/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /tmp/final_test.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk && md5sum /tmp/final_test.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFinal APK:')
print(out)

ssh.close()
