import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon clean :app:assembleRelease 2>&1 | tail -50"'
print('>>> Clean building signed APK...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-5000:])
if err: print('ERR:', err[-2000:])

# Verify signature
stdin, stdout, stderr = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner verify -v /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('\nVerify verbose:')
print(out)
if err: print('ERR:', err)

# Show certs
stdin, stdout, stderr = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner verify --print-certs /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nCerts:')
print(out)

# Deploy
stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk /var/www/samlogistic/app/SamLogisticApp.apk && docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /tmp/test_final2.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk && md5sum /tmp/test_final2.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFinal download:')
print(out)

ssh.close()
