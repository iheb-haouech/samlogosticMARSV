import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

cmds=[
 '/opt/android-sdk/build-tools/34.0.0/apksigner verify --print-certs /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk',
 'cat /opt/SamLogisticApp/app/build/outputs/apk/release/output-metadata.json 2>/dev/null || echo NO_METADATA',
]
for c in cmds:
    print(f'\n>>> {c}')
    i,o,e = ssh.exec_command(c, timeout=20)
    o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
    if o: print(o)
    if e: print('ERR:',e[-300:])
ssh.close()
