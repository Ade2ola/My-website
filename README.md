# ✒️ Dessy Ackerman | Storyteller & Dreamer - Production CMS

> **A database-driven author website, interactive scrapbook journal, and secure Owner Ledger Content Management System.**  
> Built with HTML5, CSS3, Vanilla JavaScript, Node.js Express, Prisma ORM, and PostgreSQL.
---

## 🌟 Architecture & Features Overview

- **Tactile Scrapbook Interface:** Authentic parchment pages, wood desk background, washi tape, paperclips, floating sticky notes, and pressed botanical ferns.
- **Single-Page Application (SPA):** Hash-based smooth tab routing (`#home`, `#about`, `#books`, `#desk`).
- **Database-Driven Content**: Fully backed by PostgreSQL with Prisma ORM. No manual `data.js` file replacing or Git pushing required to publish edits.
- **Owner Ledger Admin Studio (`admin.html`)**: Production-ready admin CMS protected by server-side authentication (Argon2id password hashing, HTTP-only session cookies, CSRF tokens, rate limiting).
- **Media Asset Manager**: Secure uploader accepting JPEG, PNG, WEBP, and GIF images with MIME type and signature verification.
- **Cozy Music Box**: Interactive procedural Web Audio API lullaby synthesizer.
- **Poe the Desk Cat**: SVG mascot with blinking animations and interactive speech bubble wisdom generator.
- **Candlelight Night Mode**: Ambient warm glow lighting toggle.

---

## 📁 Repository Structure

```text
My-website/
├── index.html              # Public Scrapbook SPA Frontend
├── admin.html              # Owner Ledger Admin Portal Frontend
├── styles.css              # Master Scrapbook & Admin Stylesheet
├── app.js                  # Public SPA Client Router & API Renderer
├── admin.js                # Owner Ledger CMS Client Script & API Gateway
├── data.js                 # Baseline Historical Data Archive
├── assets/                 # Default Book Covers & Art
├── uploads/                # Dynamic Uploaded Media Storage
├── docs/                   # Complete Engineering Documentation
│   ├── IMPLEMENTATION_PLAN.md
│   ├── CONTENT_FIELD_MAP.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── server/                 # Express REST API & Database Service
│   ├── src/
│   │   ├── server.js       # Server Process Entry Point
│   │   ├── app.js          # Express App Configuration
│   │   ├── config/         # Environment Settings
│   │   ├── middleware/     # Auth, CSRF, Error Handler, Rate Limiting
│   │   ├── controllers/    # Request Processing Logic
│   │   ├── routes/         # REST API Routing (/api/v1)
│   │   ├── validators/     # Zod Validation Schemas
│   │   └── utils/          # Logger, Prisma Client, Session Store
│   ├── prisma/
│   │   ├── schema.prisma   # PostgreSQL Models & Constraints
│   │   └── seed.js         # Content Migration Script
│   ├── tests/              # Jest Integration Test Suite
│   └── package.json        # Dependencies
├── Dockerfile              # Production Multi-Stage Container Manifest
├── docker-compose.yml      # Isolated Production Stack Definition
├── .env.example            # Environment Configuration Template
└── README.md               # Technical Documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+ LTS
- PostgreSQL 14+ database running locally (or via Docker on port 5432)

### 1. Installation
```bash
cd server
npm install
```

### 2. Environment Configuration
Create a `.env` file in `server/` (or copy `.env.example`):
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mywebsite_db?schema=public"
SESSION_SECRET="super_secret_session_key_dessy_ackerman_archive_2026"
CSRF_SECRET="super_secret_csrf_key_dessy_ackerman_archive_2026"
APP_BASE_URL="http://localhost:3000"
ADMIN_INITIAL_EMAIL="admin@dessyackerman.com"
ADMIN_INITIAL_PASSWORD="dessy123"
UPLOAD_DIR="./uploads"
```

### 3. Database Migration & Content Seeding
```bash
cd server
npx prisma db push
npm run db:seed
```

### 4. Start Development Server
```bash
cd server
npm run dev
```
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Owner Ledger Admin**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
  - **Email**: `admin@dessyackerman.com`
  - **Password**: `dessy123`

---

## 🧪 Automated Testing

Run the automated API, authentication, and security test suite:
```bash
cd server
npm test
```

---

## 🔐 Security Architecture

- **Password Hashing**: Argon2id with memory cost 64MB, time cost 3 iterations.
- **Session Protection**: Server-side sessions stored in PostgreSQL via custom PrismaSessionStore. Issued via HTTP-only, SameSite=Lax, Secure cookies.
- **CSRF Tokens**: Double-submit token verification (`X-CSRF-Token` header) enforced on all state-changing endpoints (`POST`, `PATCH`, `DELETE`).
- **Rate Limiting**: Auth endpoints limited to 15 attempts per 15 minutes per IP.
- **Input Validation**: All inbound payloads strictly validated using Zod.
- **Auditing**: Administrative actions logged to `AuditLog` in PostgreSQL.

---

## 📦 Production VPS Deployment

The website is containerized using Docker Compose and operates on host port `3000` / PostgreSQL port `5434`.
### 1. Build and Launch Containers
```bash
docker-compose up -d --build
```

### 2. Run Database Migrations in Container
```bash
docker-compose exec mywebsite-app npx prisma migrate deploy
docker-compose exec mywebsite-app node src/prisma/seed.js
```

### 3. Nginx Reverse Proxy Setup (`/etc/nginx/sites-available/mywebsite.conf`)
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

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 💾 Backups & Disaster Recovery

### Manual Database Dump
```bash
docker exec -t mywebsite-db pg_dump -U mywebsite_user mywebsite_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restoration Command
```bash
gunzip -c backup_YYYYMMDD.sql.gz | docker exec -i mywebsite-db psql -U mywebsite_user -d mywebsite_db
```

---

## 📄 License & Credits

Created for **Dessy Ackerman**. All original design elements, scrapbook styling, and vector sketches are maintained.
