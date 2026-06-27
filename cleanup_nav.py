import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)
cmds=[
 'rm -f /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/navigation/Screen.kt',
 "sed -i 's|import com.samlogistic.app.ui.navigation.Screen||g' /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/navigation/NavGraph.kt",
 'grep -n "sealed class Screen\|screen.route\|CreateOrder\|OrderCard\|ArrowBack" /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/navigation/NavGraph.kt /opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/ui/orders/*.kt',
]
for c in cmds:
 print(f'\n>>> {c}'); i,o,e=ssh.exec_command(c,timeout=20)
 o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
 print(o if o else 'OK')
 if e: print('ERR:',e[-500:])
ssh.close()
