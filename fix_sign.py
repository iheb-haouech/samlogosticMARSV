import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

cmds=[
 'find /opt/SamLogisticApp/app/build/outputs -name "*.apk" -type f -ls',
 '/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk',
 'cp /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',
 'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',
 'curl -sk -o /tmp/role_apk2.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
 'md5sum /tmp/role_apk2.apk /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk',
]
for c in cmds:
    print(f'\n>>> {c}')
    i,o,e = ssh.exec_command(c, timeout=60)
    o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
    if o: print(o)
    if e: print('ERR:',e[-300:])
ssh.close()
