import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

cmds = [
    # Fix nginx config: remove leading slash in filename, add cache-bust headers
    """cat > /var/www/samlogistic/app/frontend/nginx.conf << 'EOF'
server {
  listen 80;
  server_name localhost;
  root /usr/share/nginx/html;
  index index.html;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  types {
    application/vnd.android.package-archive apk;
  }

  location = /index.html {
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;
    try_files $uri =404;
  }

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    try_files $uri =404;
  }

  location ~* \.(apk)$ {
    add_header Content-Type application/vnd.android.package-archive;
    add_header Content-Disposition "attachment; filename=\\"SamLogisticApp.apk\\"";
    add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0";
    add_header Pragma "no-cache";
    try_files $uri =404;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF""",

    # Apply nginx config to running container
    'docker cp /var/www/samlogistic/app/frontend/nginx.conf sam-frontend:/etc/nginx/conf.d/default.conf',
    'docker exec sam-frontend nginx -t',
    'docker exec sam-frontend nginx -s reload',

    # Verify APK in container
    'docker exec sam-frontend md5sum /usr/share/nginx/html/SamLogisticApp.apk',
    'docker exec sam-frontend apksigner verify /usr/share/nginx/html/SamLogisticApp.apk || echo VERIFY_DONE',

    # Force download with no cache
    'curl -sk -H "Cache-Control: no-cache" -o /tmp/download_test.apk -w "HTTP:%{http_code} SIZE:%{size_download} ETAG:%{etag}" https://samlogistic.tn/SamLogisticApp.apk',
    'md5sum /tmp/download_test.apk',
]
for cmd in cmds:
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[-3000:])
    if err: print('ERR:', err[-1000:])

ssh.close()
