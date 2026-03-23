# vanlog-express

## RUN project on Gitpod

```sh
./start_all.sh
```

Then the backend will start automatically with the mobile application.

## Features:

- PDF files generation
- Orders & Packages CRUD
- Users CRUD
- Upload images
- Transporters CRUD
- Github CI-CD deployment on VPS

## Prod:

### 1. Configure server for the first time

Generate SSH key:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
ls -la
cd .ssh
ls
cat id_29B222.pub
```

Copy the file content then go to GitHub [SSH Keys](https://github.com/settings/keys) and add the copied text to give you SSH access to clone the repository into your server.

Install Docker:

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce
sudo systemctl status docker
```

Install Docker Compose:

```sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

Log in to Docker to pull built containers from your private repo:

```sh
docker login
```

Then type your username and password of your Docker Hub account.

Change [GitHub project secrets](https://github.com/Hassenamri005/vanlog/settings/secrets/actions) variables to be used as secrets in the pipeline:

```bash
DOCKER_USERNAME: docker account username
DOCKER_PASSWORD: docker account password
FRONTEND_URL: Frontend server URL (http://92.0.0.0:3000)
BACKEND_URL: Frontend server URL (http://92.0.0.0:6001)
HOST: Server IP address (92.0.0.0)
HOST_PASSWORD: Server user password
HOST_PORT: Server SSH port (22)
HOST_USERNAME: Server username (root)
JWT_REFRESH_SECRET: Used key to generate JWT token
JWT_SECRET: Used key to generate JWT token
# [Brevo SMTP server info](https://app.brevo.com/settings/keys/smtp)
MAIL_FROM: Email source
MAIL_HOST: Brevo SMTP Server (smtp-relay.brevo.com)
MAIL_PASSWORD: Brevo SMTP Server key (API Key)
MAIL_USER: Brevo SMTP Server user
MAIL_PORT: 465 (hostinger smtp port)
POSTGRES_DB: PostgreSQL Database name
POSTGRES_HOST: PostgreSQL Server host (postgres or server IP address)
POSTGRES_PASSWORD: PostgreSQL Database password
POSTGRES_USER: PostgreSQL user
VITE_BASE_URL: Backend Server IP address (http://92.0.0.0:6001)
EXPO_TOKEN: expo token (https://expo.dev/accounts/hassenamri005/settings/access-tokens)
```

### Hostinger Firewall Rules

| Action | Protocole | Port (ou plage) | Source | Détail de la source |
| ------ | --------- | --------------- | ------ | ------------------- |
| accept | SSH       | 22              | any    | any                 |
| accept | TCP       | 3000            | any    | any                 |
| accept | TCP       | 6001            | any    | any                 |
| accept | TCP       | 5432            | any    | any                 |
| accept | TCP       | 8080            | any    | any                 |
| accept | TCP       | 80              | any    | any                 |
| accept | TCP       | 465             | any    | any                 |
| accept | TCP       | 587             | any    | any                 |

### 2. Run pipeline

Just commit/merge your code into the main branch (master/develop) to auto-run the pipeline.

### 3. Hostinger Config

#### DNS Config

After bying a Domain name like `vanlog-express.com`, go to (DNS)[https://hpanel.hostinger.com/domain/vanlog-express.com/dns] and add:
| Type | Nom | Priorité | Contenu | TTL |
| ------ | --------- | --------------- | ------------------ | ------ |
| A | @ | 0 | 92.112.194.14 | 60 |
| CNAME | www | 0 | vanlog-express.com | 300 |
| A | adminer | 0 | 92.112.194.14 | 14400 |
| A | api | 0 | 92.112.194.14 | 14400 |

- `adminer`: to create a subdomain like adminer.vanlog-express.com
- `api`: to create a subdomain like adminer.vanlog-express.com
- `www` to redirect to `vanlog-express.com` if you visited `www.vanlog-express.com`
- `@` to redirect all requests to the VPS IP address

#### Firewall HTTPS Rule

Now we should allow https requests in our firewall to config SSL in the nginx server later.
| Action | Protocole | Port (ou plage) | Source | Détail de la source |
| ------ | --------- | --------------- | ------ | ------------------- |
| accept | HTTPS | 443 | any | any |

Then you need to go to you VPS server and config the Nginx server

```bash
#########################################
root@srv575010:/etc/nginx/sites-enabled# ls
adminer  api.vanlog  default  vanlog
root@srv575010:/etc/nginx/sites-enabled# cat api.vanlog
server {
    server_name api.vanlog-express.com;

    location / {
        proxy_pass http://92.112.194.14:6001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Optionally, handle static file serving if needed
    # location /static/ {
    #     root /path/to/static/files;
    # }

    # Add HTTPS configuration if needed
    # listen 443 ssl;
    # ssl_certificate /path/to/certificate.crt;
    # ssl_certificate_key /path/to/private.key;
    # include /path/to/ssl_params.conf;




    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/api.vanlog-express.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/api.vanlog-express.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = api.vanlog-express.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    server_name api.vanlog-express.com;
    listen 80;
    return 404; # managed by Certbot


}
#########################################
```

Here's a refined and professional version of your documentation:

---

### **📧 Email SMTP Configuration (Hostinger)**

After purchasing an email service from **Hostinger**, you need to allow SMTP traffic through your **firewall** to enable email sending.

#### **1️⃣ Allow SMTP Ports in Firewall**

Ensure that your server allows outbound requests on the required **SMTP ports**:

| Action | Protocol | Port | Source | Destination |
| ------ | -------- | ---- | ------ | ----------- |
| Accept | TCP      | 465  | Any    | Any         |
| Accept | TCP      | 587  | Any    | Any         |

#### **2️⃣ Open VPS Terminal and Allow SMTP Traffic**

Run the following commands to update the firewall rules:

```sh
ufw allow out 465/tcp
ufw allow out 587/tcp
ufw reload
```

## File uploading API:

If you have an api of uploading files, nginx by default doesn't accept larger file (>1m) so you need to allow by :

```bash
nano nginx.conf

# add this line
http {
    ...
    client_max_body_size 10M;
    ...
}

# restart the server
sudo systemctl restart nginx
```

## Expo build:

- **development**: Includes the Expo Development Client (expo-dev-client) and is built to run inside mobile simulators, which points to our development API endpoints on our local machines.
- **preview**: Effectively the same as a production build, but specifically built for internal testing/QA purposes (can be installed on real test devices).
- **preview-simulator**: Identical to preview except that it can be installed and tested on mobile simulators if needed (such as when troubleshooting a bug in the Production build).
- **production**: Built for distribution to the Apple/Google Stores, and automatically increments the build number for us.

```bash
cd vanlog
npm i
npm i -g eas-cli
npx expo login
eas build -p android --profile preview
```
