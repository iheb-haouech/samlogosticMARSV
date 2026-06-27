import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    # Generate debug keystore
    'keytool -genkey -v -keystore /opt/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"',

    # Sign the APK
    '/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/debug.keystore --ks-key-alias androiddebugkey --ks-pass pass:android --key-pass pass:android --out /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk',

    # Verify signature
    '/opt/android-sdk/build-tools/34.0.0/apksigner verify /opt/SamLogisticApp-signed.apk',

    # Copy signed APK to web root
    'cp /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',

    # Copy into nginx container
    'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-2000:])
    if err: print('ERR:', err[-1000:])

# Test download
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload test:')
print(out)

ssh.close()
