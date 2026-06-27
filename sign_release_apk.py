import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    # Create release keystore (valid 30 years)
    'keytool -genkey -v -keystore /opt/release.keystore -storepass samlogistic2024 -alias samlogistic -keypass samlogistic2024 -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SAM Logistic, OU=Apps, O=SAM Logistic, L=Tunis, ST=Tunis, C=TN"',

    # Sign with release keystore
    '/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out /opt/SamLogisticApp-release-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk',

    # Verify on host
    '/opt/android-sdk/build-tools/34.0.0/apksigner verify /opt/SamLogisticApp-release-signed.apk',

    # Show certificate info
    '/opt/android-sdk/build-tools/34.0.0/apksigner verify --print-certs /opt/SamLogisticApp-release-signed.apk | head -20',

    # Copy to web
    'cp /opt/SamLogisticApp-release-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',
    'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',

    # Test download
    'curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-1000:])

ssh.close()
