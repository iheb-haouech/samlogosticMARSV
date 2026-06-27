import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Fix lint issue by disabling lintVital for now
stdin, stdout, stderr = ssh.exec_command('cat /opt/SamLogisticApp/app/build.gradle.kts')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('Current build.gradle.kts:')
print(out[-3000:])

# Copy APK to web-accessible location
stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk /var/www/samlogistic/app/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('ls -la /var/www/samlogistic/app/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nAPK in web root:')
print(out)

# Check frontend directory
stdin, stdout, stderr = ssh.exec_command('ls /var/www/samlogistic/app/frontend/dist/assets/')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nFrontend assets:')
print(out)

ssh.close()
