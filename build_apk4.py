import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=/opt/gradle-8.6/bin:$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools && cd /opt/SamLogisticApp && gradle --no-daemon --refresh-dependencies --settings settings.gradle.kts :app:assembleRelease 2>&1 | tail -120"'
print('>>> Building APK with explicit settings...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-6000:])
if err: print('ERR:', err[-2000:])

stdin, stdout, stderr = ssh.exec_command('bash -lc "find /opt/SamLogisticApp -name \\"*.apk\\" -type f -ls"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK files:')
print(out if out else 'NO APK FOUND')

ssh.close()
