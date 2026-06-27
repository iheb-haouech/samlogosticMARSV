import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

xml1='''<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="sharedpref" path="."/>
    </cloud-backup>
</data-extraction-rules>
'''

xml2='''<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <include domain="sharedpref" path="."/>
</full-backup-content>
'''

files = {
    '/opt/SamLogisticApp/app/src/main/res/xml/data_extraction_rules.xml': xml1,
    '/opt/SamLogisticApp/app/src/main/res/xml/backup_rules.xml': xml2,
}
for path,content in files.items():
    i,o,e = ssh.exec_command(f'cat > {path}', timeout=10)
    i.write(content)
    i.close()
    o.read(); e.read()
    print(f'Wrote {path}')

cmd='bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon clean :app:assembleRelease 2>&1 | tail -30"'
print('\n>>> Building...')
i,o,e = ssh.exec_command(cmd, timeout=900)
out=o.read().decode('utf-8',errors='replace').strip(); err=e.read().decode('utf-8',errors='replace').strip()
print(out[-5000:])
if err: print('ERR:',err[-1000:])

for c in [
    '/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk',
    'cp /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',
    'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',
    'curl -sk -o /tmp/final_apk5.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
]:
    i,o,e = ssh.exec_command(c)
    o=o.read().decode('utf-8',errors='replace').strip()
    if 'HTTP' in c: print('APK:',o)
    else: print(f'OK: {c[:50]}')
    e.read()
ssh.close()
