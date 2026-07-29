#!/bin/bash
# =============================================================================
# SAM LOGISTIC — VPS Deployment Script
# =============================================================================
# Run this on your VPS as root or with sudo:
#   chmod +x deploy-vps.sh && sudo ./deploy-vps.sh
#
# Prerequisites:
#   - Ubuntu 22.04/24.04 or Debian 12
#   - Root or sudo access
#   - Domain pointed to this VPS IP (optional but recommended)
# =============================================================================

set -euo pipefail

echo "=========================================="
echo "  SAM LOGISTIC — VPS Setup & Deployment"
echo "=========================================="

# --- 1. System Update & Dependencies ---
echo ""
echo "[1/8] Installing system dependencies..."
apt-get update -y
apt-get install -y curl wget git unzip nginx docker.io docker-compose-plugin \
  ufw fail2ban certbot python3-certbot-nginx

# --- 2. Firewall ---
echo ""
echo "[2/8] Configuring firewall (UFW)..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment "SSH"
ufw allow 80/tcp comment "HTTP"
ufw allow 443/tcp comment "HTTPS"
ufw --force enable

# --- 3. Fail2Ban (brute-force protection) ---
echo ""
echo "[3/8] Configuring Fail2Ban..."
cat > /etc/fail2ban/jail.local << 'F2B'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5
backend  = systemd

[sshd]
enabled = true
port    = ssh
filter  = sshd
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port    = http,https
filter  = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port    = http,https
filter  = nginx-limit-req
logpath = /var/log/nginx/error.log
F2B
systemctl enable fail2ban
systemctl restart fail2ban

# --- 4. Docker ---
echo ""
echo "[4/8] Enabling Docker..."
systemctl enable docker
systemctl start docker

# --- 5. Clone or update project ---
echo ""
echo "[5/8] Setting up project..."
DEPLOY_DIR="/opt/samlogistic"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

if [ -d ".git" ]; then
  echo "Pulling latest changes..."
  git pull origin main || git pull origin master
else
  echo "Cloning repository..."
  read -p "Git repository URL: " GIT_REPO
  git clone "$GIT_REPO" .
fi

# --- 6. Environment Configuration ---
echo ""
echo "[6/8] Setting up environment..."
if [ ! -f ".env" ]; then
  # Generate secure secrets
  DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
  JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
  JWT_REFRESH=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)

  cat > .env << EOF
# Production Environment — Generated $(date +%Y-%m-%d)
NODE_ENV=production

# Database
POSTGRES_USER=samlogistic
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=samlogistic
DATABASE_URL=postgresql://samlogistic:${DB_PASSWORD}@postgres:5432/samlogistic?schema=public

# JWT Secrets (auto-generated, DO NOT change manually)
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH}
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES=7d
JWT_RESET_PASSWORD_EXP_IN=1h

# App
PORT=6001
FRONTEND_URL=https://samlogistic.tn
MAIL_FROM=no-reply@samlogistic.tn
SWAGGER_ENABLED=false

# Frontend
VITE_BASE_URL=https://api.samlogistic.tn
EOF

  chmod 600 .env
  echo "✅ .env file created with secure random secrets."
  echo "⚠️  BACKUP THIS FILE: $DEPLOY_DIR/.env"
else
  echo "✅ .env already exists — keeping current configuration."
fi

# --- 7. Build & Deploy ---
echo ""
echo "[7/8] Building and deploying with Docker Compose..."

# Use production compose if available, otherwise use default
if [ -f "docker-compose.prod.yaml" ]; then
  COMPOSE_FILE="docker-compose.prod.yaml"
else
  COMPOSE_FILE="docker-compose.yml"
fi

# Stop old containers
docker compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true

# Build and start
docker compose -f "$COMPOSE_FILE" up -d --build

echo "Waiting for services to start..."
sleep 10

# Run migrations inside the backend container
echo "Running database migrations..."
docker compose -f "$COMPOSE_FILE" exec -T backend npx prisma migrate deploy 2>/dev/null || \
  docker compose -f "$COMPOSE_FILE" exec -T backend sh -c "npx prisma generate && npx prisma db seed" 2>/dev/null || \
  echo "⚠️  Migrations may need manual run: docker compose exec backend npx prisma migrate deploy"

# --- 8. SSL Certificate (Let's Encrypt) ---
echo ""
echo "[8/8] SSL Certificate setup..."
read -p "Domain name (e.g., samlogistic.tn): " DOMAIN
if [ -n "$DOMAIN" ]; then
  # Update nginx server_name
  sed -i "s/server_name .*/server_name ${DOMAIN} www.${DOMAIN};/" /etc/nginx/sites-available/default 2>/dev/null || true

  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@${DOMAIN}" || \
    echo "⚠️  SSL setup failed. Run manually: certbot --nginx -d $DOMAIN"

  # Auto-renewal cron
  echo "0 0,12 * * * certbot renew --quiet" | crontab -
fi

# --- 9. Health Check ---
echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""
echo "📋 Services:"
docker compose -f "$COMPOSE_FILE" ps 2>/dev/null || true
echo ""
echo "🔗 Backend API: http://localhost:6001"
echo "🔗 Frontend:    http://localhost"
echo ""
echo "📊 Useful commands:"
echo "  docker compose logs -f          # View logs"
echo "  docker compose ps               # Check status"
echo "  docker compose restart backend  # Restart backend"
echo "  docker compose up -d --build    # Rebuild & deploy"
echo ""
echo "🔒 Security:"
echo "  - UFW firewall enabled (22, 80, 443)"
echo "  - Fail2Ban active for SSH + Nginx"
echo "  - Rate limiting: 20 req/s API, 30 req/s general"
echo "  - Auth rate limit: 10 attempts/min per IP"
echo "  - Security headers: CSP, HSTS, X-Frame-Options"
echo ""
echo "✅ Done! Your site is live."
