import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Read current build.gradle.kts
stdin, stdout, stderr = ssh.exec_command('cat /opt/SamLogisticApp/app/build.gradle.kts')
content = stdout.read().decode('utf-8', errors='replace')

# Fix signing config - move signingConfigs before buildTypes and use correct syntax
content = content.replace(
    '''    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {''',
    '''    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }

    signingConfigs {
        create("release") {
            storeFile = file("/opt/release.keystore")
            storePassword = "samlogistic2024"
            keyAlias = "samlogistic"
            keyPassword = "samlogistic2024"
        }
    }
}

dependencies {'''
)

# Fix buildTypes to use signingConfig correctly
content = content.replace(
    '''        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(''',
    '''        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs["release"]
            proguardFiles('''
)

# Write back
with ssh.open_sftp() as sftp:
    with sftp.open('/opt/SamLogisticApp/app/build.gradle.kts', 'w') as f:
        f.write(content)

print('Updated build.gradle.kts')

# Rebuild
cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon --refresh-dependencies :app:assembleRelease 2>&1 | tail -60"'
print('\n>>> Building...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-5000:])
if err: print('ERR:', err[-2000:])

# Verify
stdin, stdout, stderr = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner verify /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk && echo VERIFIED')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nVerify:')
print(out)

# Deploy
stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk /var/www/samlogistic/app/SamLogisticApp.apk && docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload:')
print(out)

ssh.close()
