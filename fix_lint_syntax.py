import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

stdin, stdout, stderr = ssh.exec_command('cat /opt/SamLogisticApp/app/build.gradle.kts')
content = stdout.read().decode('utf-8', errors='replace')

# Fix syntax: abortOnError false -> abortOnError = false
content = content.replace('abortOnError false', 'abortOnError = false')

with ssh.open_sftp() as sftp:
    with sftp.open('/opt/SamLogisticApp/app/build.gradle.kts', 'w') as f:
        f.write(content)

print('Fixed syntax')

cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon :app:assembleRelease 2>&1 | tail -40"'
print('\n>>> Building...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-4000:])
if err: print('ERR:', err[-1000:])

# Deploy
stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk /var/www/samlogistic/app/SamLogisticApp.apk && docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload:')
print(out)

ssh.close()
