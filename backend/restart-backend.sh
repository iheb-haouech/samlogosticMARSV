#!/bin/bash
# restart-backend.sh - Script to restart backend services

# Start PostgreSQL if not running
if ! docker ps | grep -q sam-db; then
    docker run -d --name sam-db --restart=unless-stopped \
      -e POSTGRES_USER=samlogistic \
      -e POSTGRES_PASSWORD=post123 \
      -e POSTGRES_DB=samlogistic \
      -p 5432:5432 \
      -v app_postgres_data:/var/lib/postgresql/data \
      postgres:13.5
fi

# Wait for DB
sleep 10

# Start Backend
cd /var/www/samlogistic/app/backend
DATABASE_URL="postgresql://samlogistic:post123@127.0.0.1:5432/samlogistic?schema=public"
JWT_SECRET="change-me-secret-for-production-use-strong-secret"
JWT_REFRESH_SECRET="change-me-refresh-for-production-use-strong-secret"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES="7d"
PORT="6001"

nohup node dist/src/main.js > /var/log/backend.log 2>&1 &

echo "Backend restarted"