# Implementation Plan: My-Website Production CMS & Deployment

## Executive Summary
This document defines the comprehensive step-by-step plan to transform the **Ade2ola/My-website** static author site into a fully database-driven, production-ready web application with a secure admin Content Management System (CMS), server-side authentication, image management, automated testing, and isolated VPS deployment alongside DeRoyal Hotspot OS (DHOS).

---

## Audit & Baseline Findings

### 1. Existing System Architecture
- **Frontend Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+). Single Page Application (SPA) layout utilizing hash/tab-based DOM switching (`#home`, `#about`, `#books`, `#desk`).
- **Styling**: `styles.css` with CSS Custom Properties implementing a tactile scrapbook aesthetic (parchment texture, wood desk background, handwritten fonts via Google Fonts: Caveat, Playfair Display, Lora).
- **Current Data Store**: `data.js` attached to `window.authorData`. Admin edits merge into `localStorage` (`dessy_archive_data`).
- **Current Security Model**: Client-side passcode gate (`dessy123`) checking `sessionStorage.setItem('admin_session', 'true')`. Insecure for production.

### 2. Identified Functional Baseline & Features to Preserve
- **Public SPA Navigation**: Smooth page leaf transitions across Home, About, Bookshelf, and Writing Desk.
- **Interactive Scrapbook Modal**: Book details popup with synopses, character dossiers, moodboards, playlists, retailer links, and author notes.
- **Writing Desk Features**: Work-in-Progress (WIP) percentage progress bar, desk journal timeline, typewriter manuscript scraps, rotating quote carousel, and sneak peeks.
- **Mascot Companion**: "Poe the Desk Cat" SVG with CSS blinking animation and interactive speech bubble quote generator.
- **Audio & Ambient Light**: Web Audio API synthesizer for procedural music box lullabies and Candlelight night-mode toggle.
- **Boutique Catalog**: Merchandise items listing signed hardcovers and sticker packs.

---

## 12-Phase Execution Roadmap

### Phase 1: Audit & Documentation (Completed)
- Conducted full repo inspection (`index.html`, `admin.html`, `app.js`, `admin.js`, `data.js`, `styles.css`).
- Authored four core engineering specifications:
  - `docs/IMPLEMENTATION_PLAN.md`
  - `docs/CONTENT_FIELD_MAP.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DEPLOYMENT.md`

### Phase 2: Backend Core Infrastructure Setup
- Initialize Node.js Express application in `server/`.
- Configure Prisma ORM with PostgreSQL client.
- Setup structured logging (Winston/Pino), global error handler middleware, CORS, Helmet headers, and health checks (`GET /health`).

### Phase 3: Server-Side Security & Authentication
- Implement admin user entity with Argon2id password hashing.
- Configure server-side session management using PostgreSQL session store (`connect-pg-simple` or express-session with DB persistence) and HTTP-only, SameSite=Lax, Secure cookies.
- Implement CSRF token verification for state-changing endpoints (POST, PATCH, DELETE).
- Add login rate-limiting middleware (`express-rate-limit`).
- Implement one-time server seed CLI command for initial admin credential creation.

### Phase 4: Database Schema & Migration Strategy
- Define Prisma Schema (`schema.prisma`) covering:
  - `AdminUser`, `AdminSession`
  - `SiteSetting`, `SocialLink`
  - `HomeSetting`, `AboutSetting`, `Trope`, `Genre`, `Hobby`, `FunFact`
  - `Book`, `BookCharacter`, `BookPlaylistTrack`, `BookPurchaseLink`
  - `BookshelfConfig`, `DeskConfig`, `WritingProject`, `DeskLog`, `ManuscriptSnippet`, `DeskQuote`, `SneakPeek`
  - `MascotConfig`, `MascotQuote`
  - `StoreProduct`, `MediaAsset`, `AuditLog`
- Write migration and import script (`server/prisma/seed.js`) that safely parses `data.js` into PostgreSQL records without duplication.

### Phase 5: Public REST API Development (`/api/v1/public`)
- `GET /api/v1/site`: Complete site bundle for fast initial load.
- `GET /api/v1/site/settings`, `GET /api/v1/site/home`, `GET /api/v1/site/about`
- `GET /api/v1/books`, `GET /api/v1/books/:slug`
- `GET /api/v1/writing-projects`, `GET /api/v1/quotes`, `GET /api/v1/mascot`, `GET /api/v1/products`
- Ensure only active/published items are returned to unauthenticated users.

### Phase 6: Admin REST API Development (`/api/v1/admin`)
- Protect all admin endpoints with authentication and authorization middleware (`requireAdmin`).
- Implement full CRUD operations for Settings, Home, About, Books, Writing Projects, Desk Logs, Snippets, Quotes, Mascot, Products.
- Implement input validation schemas using Zod.
- Record all mutation events in `AuditLog`.

### Phase 7: Owner Ledger Frontend Admin Integration
- Refactor `admin.js` to replace `localStorage` operations with REST API calls (`fetch` wrapper handling CSRF header and session credentials).
- Replace passcode gate UI with real server login form (`POST /api/v1/auth/login`).
- Implement visual feedback: loading states, toast notifications, error handling, and delete confirmation modals.

### Phase 8: Public Website Frontend Integration
- Refactor `app.js` to fetch live data from `/api/v1/site` on launch.
- Fallback gracefully to offline defaults if API is temporarily unreachable.
- Maintain existing DOM structure, animations, canvas note generators, and audio synth.

### Phase 9: Media Management & File Uploads
- Create POST `/api/v1/admin/uploads` endpoint supporting JPEG, PNG, WEBP, and GIF images.
- Validate MIME type, magic number signatures, and file size limits (max 5MB).
- Save files with cryptographically generated unique filenames in `/uploads` directory.
- Expose image previews and reference checks in Owner Ledger prior to deletion.

### Phase 10: Automated Testing & Security Verification
- Build automated test suite (Jest / Supertest):
  - Integration tests for API endpoints and auth protection.
  - Unit tests for password hashing, CSRF verification, and Zod validation.
  - End-to-end acceptance flow verification.

### Phase 11: Production Containerization & VPS Isolation
- Create `docker-compose.yml` for website frontend/backend service and isolated PostgreSQL database (`mywebsite-db` port 5434 / socket isolation).
- Configure Nginx reverse proxy block on host server with SSL.
- Ensure strict isolation from DeRoyal Hotspot OS (DHOS).

### Phase 12: Production Verification & Handover
- Execute database seed and content migration on production VPS.
- Verify live site persistence, public site loading, admin updates, media uploads, and DHOS co-existence.
- Document backup, restoration, and emergency rollback procedures.
