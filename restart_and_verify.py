import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

cmds=[
 'cd /var/www/samlogistic/app && docker compose up -d --force-recreate frontend',
 'sleep 4',
 'curl -sk -o /tmp/final_check.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
 'md5sum /tmp/final_check.apk /var/www/samlogistic/app/SamLogisticApp.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk',
 '/opt/android-sdk/build-tools/34.0.0/apksigner verify --print-certs /var/www/samlogistic/app/SamLogisticApp.apk',
]
for c in cmds:
    print(f'\n>>> {c}')
    i,o,e = ssh.exec_command(c, timeout=60)
    o=o.read().decode('utf-8',errors='replace').strip()
    e=e.read().decode('utf-8',errors='replace').strip()
    if o: print(o)
    if e: print('ERR:',e[-300:])
ssh.close()
