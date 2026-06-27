import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

# Fix CreateOrderScreen.kt ArrowBack
sed = 'sed -i "s|imageVector = androidx.compose.material.icons.Icons.AutoMirrored.Filled.ArrowBack|imageVector = Icons.Default.ArrowBack|g" /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/CreateOrderScreen.kt'
i,o,e=ssh.exec_command(sed,timeout=10)
o.read(); e.read()

# Ensure OrderCard exists in OrdersScreen after OrdersScreen composable
patch = '''python3 -c "
import re
p='/opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/OrdersScreen.kt'
with open(p,'r',encoding='utf-8') as f: c=f.read()
if 'fun OrderCard(' not in c:
    c=c.replace('}','    Spacer(modifier = Modifier.padding(vertical = 4.dp))\\n            }\\n        }\\n    }\\n}\\n\\n@Composable\\nfun OrderCard(order: OrderResponse, onClick: () -> Unit) {\\n    Card(onClick = onClick, modifier = Modifier.fillMaxWidth()) {\\n        Column(modifier = Modifier.padding(16.dp)) {\\n            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {\\n                Text(text = \\\"Commande #\\\" + order.id, style = MaterialTheme.typography.titleMedium)\\n                Text(text = order.totalPrice?.let { \\\"$it DT\\\" } ?: \\\"---\\\", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.primary)\\n            }\\n            Text(text = \\\"ID: \\\" + (order.trackingId ?: \\\"N/A\\\"), style = MaterialTheme.typography.bodySmall)\\n            order.recipient?.let { r -> Text(text = r.fullName ?: \\\"Destinataire inconnu\\\", style = MaterialTheme.typography.bodySmall) }\\n        }\\n    }\\n}')
    with open(p,'w',encoding='utf-8') as f: f.write(c)
"'''
i,o,e=ssh.exec_command(patch,timeout=20)
o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
print('Patch:',o if o else 'OK')
if e: print('ERR:',e[-300:])

# Verify fixes
cmds=[
 'tail -25 /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/CreateOrderScreen.kt',
 'grep -n "fun OrderCard" /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/OrdersScreen.kt',
]
for c in cmds:
 print(f'\n>>> {c}'); i,o,e=ssh.exec_command(c,timeout=10)
 o=o.read().decode('utf-8',errors='replace').strip(); print(o if o else 'EMPTY')

# Build APK
cmd='bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon clean :app:assembleRelease 2>&1 | tail -40"'
print('\n>>> Building...')
i,o,e=ssh.exec_command(cmd,timeout=900)
o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
print(o[-4000:])
if e: print('ERR:',e[-1000:])

# Sign + deploy
stdin, stdout, stderr = ssh.exec_command('/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk')
stdout.read()
ssh.exec_command('cp /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk && docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk').read()
stdin, stdout, stderr = ssh.exec_command('curl -sk -o /tmp/final_apk.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk')
out=stdout.read().decode('utf-8',errors='replace').strip(); print('\nAPK:',out)
ssh.close()
