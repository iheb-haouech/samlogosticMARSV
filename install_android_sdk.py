import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Install Java and Android SDK command-line tools
cmds = [
    'apt-get update -qq && apt-get install -y -qq openjdk-17-jdk unzip wget',
    'wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip',
    'mkdir -p /opt/android-sdk/cmdline-tools /opt/android-sdk/platform-tools',
    'unzip -q /tmp/cmdline-tools.zip -d /opt/android-sdk/cmdline-tools-temp',
    'mv /opt/android-sdk/cmdline-tools-temp/cmdline-tools/* /opt/android-sdk/cmdline-tools/',
    'rm -rf /opt/android-sdk/cmdline-tools-temp /tmp/cmdline-tools.zip',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=120)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-2000:])
    if err: print('ERR:', err[-1000:])

# Accept licenses and install SDK components
licenses_cmd = 'bash -lc "yes | /opt/android-sdk/cmdline-tools/bin/sdkmanager --licenses >/dev/null 2>&1 || true"'
stdin, stdout, stderr = ssh.exec_command(licenses_cmd, timeout=60)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('\n>>> Accept licenses')
if out: print(out[-1000:])
if err: print('ERR:', err[-500:])

sdk_cmd = 'bash -lc "/opt/android-sdk/cmdline-tools/bin/sdkmanager \\\"platform-tools\\\" \\\"platforms;android-34\\\" \\\"build-tools;34.0.0\\\""'
stdin, stdout, stderr = ssh.exec_command(sdk_cmd, timeout=120)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
print('\n>>> Install SDK components')
if out: print(out[-2000:])
if err: print('ERR:', err[-1000:])

# Verify Java
stdin, stdout, stderr = ssh.exec_command('java -version 2>&1')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\n>>> Java version:')
print(out)

# Set env vars for subsequent commands
env_setup = 'export ANDROID_HOME=/opt/android-sdk && export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools'
stdin, stdout, stderr = ssh.exec_command(f'bash -lc "{env_setup} && java -version && which sdkmanager"')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\n>>> Env check:')
print(out)

ssh.close()
