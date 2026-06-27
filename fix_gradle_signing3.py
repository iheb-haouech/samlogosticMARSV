import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

build_gradle = '''plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.samlogistic.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.samlogistic.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
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

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs["release"]
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.navigation:navigation-compose:2.7.6")
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.05.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.constraintlayout:constraintlayout-compose:1.0.1")

    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    implementation("io.coil-kt:coil-compose:2.5.0")
    implementation("androidx.compose.material:material-icons-extended:1.6.5")
    implementation("org.osmdroid:osmdroid-android:6.1.18")
    implementation("com.jakewharton.threetenabp:threetenabp:1.4.6")
    implementation("com.google.zxing:core:3.5.2")
    implementation("com.google.zxing:android-core:3.3.0")
    implementation("com.journeyapps:zxing-android-embedded:4.3.0")
    implementation("com.google.android.gms:play-services-location:21.2.0")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.05.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
'''

with ssh.open_sftp() as sftp:
    with sftp.open('/opt/SamLogisticApp/app/build.gradle.kts', 'w') as f:
        f.write(build_gradle)

print('Wrote clean build.gradle.kts with signing config')

cmd = 'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon --refresh-dependencies :app:assembleRelease 2>&1 | tail -60"'
print('\n>>> Building...')
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=900)
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out[-5000:])
if err: print('ERR:', err[-2000:])

# Verify and deploy
stdin, stdout, stderr = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner verify /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk && echo VERIFIED')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('cp /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk /var/www/samlogistic/app/SamLogisticApp.apk && docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk')
stdout.read()

stdin, stdout, stderr = ssh.exec_command('curl -sk -o /dev/null -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out = stdout.read().decode('utf-8', errors='replace').strip()
print('\nDownload:')
print(out)

ssh.close()
