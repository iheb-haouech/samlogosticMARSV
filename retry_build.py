import paramiko, sys, io, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LOCAL = r'C:\Users\Administrateur\Desktop\vanlog-master\SamLogisticApp'
TAR = r'C:\Users\Administrateur\AppData\Local\Temp\SamLogisticApp_retry.tar'

if os.path.exists(TAR): os.remove(TAR)
subprocess.run(['tar','-cf',TAR,'-C',os.path.dirname(LOCAL),'--exclude=node_modules','--exclude=dist','--exclude=.git',os.path.basename(LOCAL)], check=True, capture_output=True)
print(f'Tar size: {os.path.getsize(TAR)} bytes')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.227.76.200', username='root', password='we62pLUjAYqb5', timeout=30)

sftp = ssh.open_sftp()
sftp.put(TAR, '/tmp/SamLogisticApp_retry.tar')
sftp.close()

for c in [
    'rm -rf /opt/SamLogisticApp && mkdir -p /opt && tar -xf /tmp/SamLogisticApp_retry.tar -C /opt/ && rm /tmp/SamLogisticApp_retry.tar',
    "bash -lc \"echo sdk.dir=/opt/android-sdk > /opt/SamLogisticApp/local.properties\"",
    'rm -f /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/navigation/Screen.kt',
]:
    i,o,e = ssh.exec_command(c, timeout=60)
    o.read(); e.read()
    print(f'OK: {c[:60]}')

# Fix duplicate OrderCard in OrdersScreen.kt
fix = '''python3 -c "
p='/opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/OrdersScreen.kt'
with open(p,'r',encoding='utf-8') as f: c=f.read()
# Remove duplicate OrderCard definitions, keep only the last one
parts=c.split('@Composable\\nfun OrderCard(')
if len(parts)>2:
    c=parts[0]+'@Composable\\nfun OrderCard('+parts[-1]
    with open(p,'w',encoding='utf-8') as f: f.write(c)
    print('Fixed duplicate OrderCard')
else:
    print('No duplicate found')
"'''
i,o,e = ssh.exec_command(fix, timeout=20)
o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
print(o if o else 'OK')
if e: print('ERR:',e[-300:])

# Build
cmd='bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon clean :app:assembleRelease 2>&1 | tail -30"'
print('\n>>> Building...')
i,o,e = ssh.exec_command(cmd, timeout=900)
out=o.read().decode('utf-8',errors='replace').strip(); err=e.read().decode('utf-8',errors='replace').strip()
print(out[-5000:])
if err: print('ERR:',err[-1000:])

# Sign + deploy
i,o,e = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release.apk')
o.read(); e.read()
print('Signed')

for c in [
    'cp /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',
    'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',
    'curl -sk -o /tmp/retry_apk.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
]:
    i,o,e = ssh.exec_command(c)
    o=o.read().decode('utf-8',errors='replace').strip()
    if 'HTTP' in c: print('APK:',o)
    else: print(f'OK: {c[:40]}')
    e.read()
ssh.close()
