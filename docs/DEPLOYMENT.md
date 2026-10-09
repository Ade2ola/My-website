# Production Deployment & Operations Guide

This guide details the deployment, configuration, resource isolation, backup strategy, and maintenance operations for **Dessy Ackerman's Author Website & Owner Ledger CMS** on an Ubuntu VPS alongside DeRoyal Hotspot OS (DHOS).

---

## 1. System Requirements & Infrastructure Context

### VPS Environment
- **Operating System**: Ubuntu 20.04 / 22.04 LTS
- **Runtime Dependencies**: Docker 24+, Docker Compose v2+, Nginx (Reverse Proxy)
- **Existing Services**: DeRoyal Hotspot OS (DHOS) running on PostgreSQL (`hotspot-db` / `dhos-postgres` on port 5432).

### Strict Isolation Rules
1. **Database Isolation**: The author website MUST run on a distinct database instance or dedicated port/database credentials (`mywebsite-db` on internal network / host port `5434` if mapped).
2. **Network Isolation**: Dedicated Docker network (`mywebsite-network`). Do not join or alter DHOS networks.
3. **No Overwrite**: Never modify DHOS containers, environment files, or Nginx configurations belonging to DHOS.

---

## 2. Docker Architecture & Configuration

### Services Stack (`docker-compose.yml`)

1. **`mywebsite-app`**: Node.js 24 Alpine container running the Express REST API and serving static files.
2. **`mywebsite-db`**: PostgreSQL 16 Alpine container reserved exclusively for the author website.

### Environment Configuration (`.env`)

```env
# Application Settings
NODE_ENV=production
PORT=3000
APP_BASE_URL=https://dessyackerman.com

# PostgreSQL Connection String
DATABASE_URL=postgresql://mywebsite_user:SuperSecureDBPassword123!@mywebsite-db:5432/mywebsite_db?schema=public

# Database Service Environment
POSTGRES_USER=mywebsite_user
POSTGRES_PASSWORD=SuperSecureDBPassword123!
POSTGRES_DB=mywebsite_db

# Security & Session Secrets
SESSION_SECRET=a_very_long_random_cryptographic_secret_string_32_chars_min
CSRF_SECRET=another_super_secret_cryptographic_key_for_csrf_protection

# Initial Admin Creation (Used only on first seed)
ADMIN_INITIAL_EMAIL=admin@dessyackerman.com
ADMIN_INITIAL_PASSWORD=InitialAdminPasswordToChangeOnFirstLogin!

# Upload Settings
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE_MB=5

# Reverse Proxy Trust
TRUST_PROXY=true
```

---

## 3. Reverse Proxy & Nginx Setup

Create a dedicated virtual host configuration in `/etc/nginx/sites-available/mywebsite.conf`:

```nginx
server {
    listen 80;
    server_name dessyackerman.com www.dessyackerman.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dessyackerman.com www.dessyackerman.com;

    ssl_certificate /etc/letsencrypt/live/dessyackerman.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dessyackerman.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Client upload size limit
    client_max_body_size 10M;

    # Static Assets & Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads directory
    location /uploads/ {
        proxy_pass http://127.0.0.1:3000/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Health Check
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }
}
```

Enable configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mywebsite.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Resource Limits & System Health

To prevent interference with DHOS, set explicit container memory and CPU limits in `docker-compose.yml`:

```yaml
services:
  mywebsite-app:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          memory: 128M

  mywebsite-db:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          memory: 128M
```

---

## 5. Backup & Disaster Recovery Strategy

### Automated Nightly Database Backup Script (`/opt/backups/backup-mywebsite.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/opt/backups/mywebsite"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="mywebsite-db"
DB_USER="mywebsite_user"
DB_NAME="mywebsite_db"
UPLOADS_DIR="/var/www/mywebsite/uploads"

mkdir -p "${BACKUP_DIR}"

# 1. PostgreSQL Dump
docker exec -t "${DB_CONTAINER}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"

# 2. Uploaded Media Archive
tar -czf "${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz" -C "${UPLOADS_DIR}" .

# 3. Retention policy: Keep last 30 days
find "${BACKUP_DIR}" -type f -mtime +30 -delete

echo "Backup complete: ${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
```

Make executable and add to crontab:
```bash
chmod +x /opt/backups/backup-mywebsite.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/backups/backup-mywebsite.sh >> /var/log/mywebsite-backup.log 2>&1") | crontab -
```

### Restoration Procedure

```bash
# 1. Restore Database Dump
gunzip -c /opt/backups/mywebsite/db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i mywebsite-db psql -U mywebsite_user -d mywebsite_db

# 2. Restore Uploaded Files
tar -xzf /opt/backups/mywebsite/uploads_YYYYMMDD_HHMMSS.tar.gz -C /var/www/mywebsite/uploads/
```

---

## 6. Deployment & Rollback Commands

### Safe Initial Deployment
```bash
cd /var/www/My-website
docker-compose up -d --build
docker-compose exec mywebsite-app npx prisma migrate deploy
docker-compose exec mywebsite-app node src/prisma/seed.js
```

### Emergency Rollback
```bash
docker-compose down
git checkout <previous-commit-hash>
docker-compose up -d --build
```
