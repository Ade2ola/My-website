# Technical Architecture Specification: My-Website CMS

## 1. Architectural Blueprint & Overview

The system follows a lightweight, decoupled **SPA + REST API + PostgreSQL** architecture. It preserves the vanilla HTML/CSS/JS scrapbook frontend while backing all dynamic content with a Node.js Express service, Prisma ORM, and a PostgreSQL database.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌─────────────────────────────┐ ┌───────────────────┐  │
│  │ Public SPA (index.html)     │ │ Owner Ledger Admin│  │
│  │ Vanilla JS + Fetch API      │ │ (admin.html)      │  │
│  └──────────────┬──────────────┘ └─────────┬─────────┘  │
└─────────────────┼──────────────────────────┼────────────┘
                  │ HTTPS / JSON API         │ Session + CSRF
                  ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Node.js Express REST API                          │  │
│  │ Middleware: CORS, Helmet, CSRF, Auth, Rate-Limiter│  │
│  │ Controllers & Zod Validators                      │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ Prisma ORM
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Persistence Layer                    │
│  ┌─────────────────────────────┐ ┌───────────────────┐  │
│  │ PostgreSQL Database         │ │ File System       │  │
│  │ Content & Audit Logs        │ │ Uploads (/uploads)│  │
│  └─────────────────────────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
My-website/
├── public/                     # Static Frontend Assets
│   ├── index.html              # Public Scrapbook SPA
│   ├── admin.html              # Owner Ledger Admin Portal
│   ├── styles.css              # Master Scrapbook Stylesheet
│   ├── app.js                  # Public Client Script
│   ├── admin.js                # Owner Ledger Client Script
│   ├── data.js                 # Baseline Data Archive (Fallback)
│   └── assets/                 # Default Static Artwork & Images
├── server/                     # Backend Node.js Service
│   ├── src/
│   │   ├── app.js              # Express Application Setup
│   │   ├── server.js           # Server Entry Point & Process Listeners
│   │   ├── config/             # Environment & Security Config
│   │   ├── middleware/         # Auth, CSRF, Error Handler, Rate Limiters
│   │   ├── routes/             # API Router Definitions (/api/v1)
│   │   ├── controllers/        # Request Handlers
│   │   ├── services/           # Data Access & Business Logic
│   │   ├── validators/         # Zod Schemas
│   │   └── utils/              # Hash, Token, Logger Utilities
│   ├── prisma/
│   │   ├── schema.prisma       # Database Models & Constraints
│   │   ├── seed.js             # Data Import Script from data.js
│   │   └── migrations/         # Prisma Migration Files
│   ├── tests/                  # API & Security Test Suite
│   └── package.json            # Node Dependencies & Scripts
├── uploads/                    # Local Uploaded Media Directory
├── docs/                       # Project Specifications
│   ├── IMPLEMENTATION_PLAN.md
│   ├── CONTENT_FIELD_MAP.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── docker-compose.yml          # Containerized Deployment Manifest
├── .env.example                # Environment Variable Template
└── README.md                   # Complete Documentation
```

---

## 3. PostgreSQL Database Schema (Prisma)

### Key Entities & Data Models

1. **`AdminUser`**: Stores admin username/email and Argon2id password hash.
2. **`AdminSession`**: Tracks active admin sessions server-side (Token, Expiry, User-Agent, IP).
3. **`SiteSetting`**: Key-value or single row site-wide metadata (Title, Sticky Note, Music Box Label).
4. **`SocialLink`**: Footer social stamps (Name, Icon, URL, Active status, Display order).
5. **`HomeSetting`**: Homepage hero greeting, titles, summaries, and featured book relation.
6. **`AboutSetting`**: About page header, "Why I Write" narrative, and anonymity log details.
7. **`Trope`**: Favorite tropes with name and description for hover tooltips.
8. **`Genre`**: Favorite genres list.
9. **`Hobby`**: Favorite hobbies list.
10. **`FunFact`**: Corkboard fun fact cards.
11. **`BookshelfConfig`**: Header settings for Bookshelf section.
12. **`Book`**: Book records (Title, Slug, Genre, Tagline, Synopsis, Cover Image/Color/Doodle, Pinterest Link, Author Notes, Published status, Display Order).
13. **`BookCharacter`**: Character profiles linked to a Book (Name, Role, Description, Display Order).
14. **`BookPlaylistTrack`**: Soundtrack tracks linked to a Book (Title, Artist, Track Number).
15. **`BookPurchaseLink`**: Retailer links linked to a Book (Store Name, URL, Disabled flag).
16. **`WritingProject`**: Work-In-Progress tracker (Title, Status, Progress %, Word Count, Synopsis).
17. **`DeskLog`**: Writing desk timeline journal logs (Date, Text).
18. **`ManuscriptSnippet`**: Manuscript typewriter scraps (Source, Text, Display Order).
19. **`DeskQuote`**: Quote slider cards (Text, Display Order).
20. **`SneakPeek`**: Writing desk extras (Title, Description).
21. **`MascotConfig`**: Poe the cat initial speech bubble and settings.
22. **`MascotQuote`**: Cat wisdom quotes list.
23. **`StoreProduct`**: Boutique merchandise items (Title, Description, Price, Status, Link).
24. **`MediaAsset`**: Uploaded images metadata (Filename, Original Name, MIME Type, Size, Path, Dimensions).
25. **`AuditLog`**: Administrative action audit trail (User, Action, Entity, Changes, Timestamp).

---

## 4. Security Architecture

### Authentication & Authorization
- **Password Hashing**: Passwords hashed using **Argon2id** (`argon2` npm package) with memory cost 65536 KB, time cost 3, parallelism 4.
- **Session Management**: Server-side session tokens stored in `AdminSession`. Token sent to client via HTTP-only, SameSite=Lax, Secure cookie (`dessy_session_id`).
- **Session Lifetime**: 24 hours of inactivity or absolute 7-day expiration. Session rotated on login to prevent fixation.

### CSRF Protection
- Double-Submit Cookie / Synchronizer Token Pattern.
- Client fetches CSRF token via `GET /api/v1/auth/csrf-token` and passes it in the `X-CSRF-Token` header for state-mutating requests (`POST`, `PATCH`, `PUT`, `DELETE`).

### Input Validation & Sanitization
- All request bodies and query parameters validated against **Zod** schemas.
- Output text safely rendered in DOM using `textContent` or `escapeHtml` to prevent Cross-Site Scripting (XSS).

### Rate Limiting
- Login endpoint (`POST /api/v1/auth/login`) rate-limited to 5 attempts per 15-minute window per IP.
- Public read APIs rate-limited to 100 requests per minute per IP.

---

## 5. Media Upload Architecture

- **Upload Handler**: `multer` middleware with disk storage.
- **Validation**:
  - MIME type check (`image/jpeg`, `image/png`, `image/webp`, `image/gif`).
  - Magic byte file signature verification using `file-type`.
  - Maximum file size limit: 5MB.
- **Storage**: Saved to `uploads/` directory with a UUID v4 sanitized filename (`<uuid>.<ext>`).
- **Asset Cleanup**: Deleting a record checks if the associated media asset is referenced elsewhere before purging from disk.
