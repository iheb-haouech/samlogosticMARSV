import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

cmds=[
 'curl -sk -I https://samlogistic.tn/SamLogisticApp.apk 2>&1 | head -12',
 'curl -sk -o /tmp/apk_check.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
 '/opt/android-sdk/build-tools/34.0.0/apksigner verify --print-certs /var/www/samlogistic/app/SamLogisticApp.apk',
 'docker exec sam-frontend ls -la /usr/share/nginx/html/SamLogisticApp.apk',
]
for c in cmds:
    print(f'\n>>> {c}')
    i,o,e = ssh.exec_command(c, timeout=30)
    o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
    if o: print(o)
    if e: print('ERR:',e[-300:])
ssh.close()
