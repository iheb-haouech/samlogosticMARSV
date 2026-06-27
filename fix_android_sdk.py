import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    'mkdir -p /opt/android-sdk/cmdline-tools/latest',
    'ls /opt/android-sdk/cmdline-tools/',
    'cp -r /opt/android-sdk/cmdline-tools/* /opt/android-sdk/cmdline-tools/latest/ || true',
    'ls /opt/android-sdk/cmdline-tools/latest/',
]

for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-2000:])
    if err: print('ERR:', err[-500:])

# Accept licenses
lic_cmd = 'bash -lc "yes | /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager --licenses >/dev/null 2>&1 || true"'
stdin, stdout, stderr = ssh.exec_command(lic_cmd, timeout=60)
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\n>>> Accept licenses')
if out: print(out[-1000:])

# Install SDK components with explicit sdk_root
sdk_cmd = 'bash -lc "/opt/android-sdk/cmdline-tools/latest/bin/sdkmanager --sdk_root=/opt/android-sdk \\\"platform-tools\\\" \\\"platforms;android-34\\\" \\\"build-tools;34.0.0\\\""'
stdin, stdout, stderr = ssh.exec_command(sdk_cmd, timeout=120)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('\n>>> Install SDK components')
if out: print(out[-2000:])
if err: print('ERR:', err[-1000:])

# Verify
stdin, stdout, stderr = ssh.exec_command('bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools && sdkmanager --list | head -20"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\n>>> sdkmanager list:')
print(out[-2000:])

ssh.close()
