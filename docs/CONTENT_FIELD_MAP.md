# Content Field Mapping Specification

This document details the mapping between every frontend content element, browser storage field, database model, REST API endpoint, Zod validation schema, and public display location in **Ade2ola/My-website**.

---

## 1. Global Site Configuration (`siteConfig`)

| Field Name | Current Location (`data.js` / `localStorage`) | Admin Control (`admin.html`) | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location (`index.html` / `app.js`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Site Browser Title** | `siteConfig.siteTitle` | `input#site-browser-title` | `SiteSetting.siteTitle` | `GET /api/v1/site` | `PATCH /api/v1/admin/settings` | `z.string().min(1).max(150)` | `<title>` tag |
| **Author Name** | `siteConfig.authorName` | Hardcoded / Settings | `SiteSetting.authorName` | `GET /api/v1/site` | `PATCH /api/v1/admin/settings` | `z.string().min(1).max(100)` | Header, Book spine, Footer |
| **Author Subtitle** | `siteConfig.authorSubtitle` | Hardcoded / Settings | `SiteSetting.authorSubtitle` | `GET /api/v1/site` | `PATCH /api/v1/admin/settings` | `z.string().max(150)` | Hero tagline fallback |
| **Desk Sticky Note** | `siteConfig.deskStickyNote` | `input#desk-sticky-note-edit` | `SiteSetting.deskStickyNote` | `GET /api/v1/site` | `PATCH /api/v1/admin/settings` | `z.string().min(1).max(250)` | `#desk-sticky-text` (Floating yellow note) |
| **Music Box Label** | `siteConfig.musicBoxLabel` | `input#music-box-label-edit` | `SiteSetting.musicBoxLabel` | `GET /api/v1/site` | `PATCH /api/v1/admin/settings` | `z.string().min(1).max(50)` | `#music-box-label` (Music box crank) |
| **Social Link Name** | `siteConfig.socialLinks[].name` | `input#new-social-name` | `SocialLink.name` | `GET /api/v1/site` | `POST /api/v1/admin/social-links` | `z.string().min(1).max(50)` | `#footer-social-stamps` link label |
| **Social Link Icon** | `siteConfig.socialLinks[].icon` | `input#new-social-icon` | `SocialLink.icon` | `GET /api/v1/site` | `POST /api/v1/admin/social-links` | `z.string().min(1).max(10)` | `#footer-social-stamps` stamp icon |
| **Social Link URL** | `siteConfig.socialLinks[].url` | `input#new-social-url` | `SocialLink.url` | `GET /api/v1/site` | `POST /api/v1/admin/social-links` | `z.string().url()` | `#footer-social-stamps` href |
| **Social Link Active** | `siteConfig.socialLinks[].active` | `window.toggleAdminSocial(idx)` | `SocialLink.active` | `GET /api/v1/site` | `PATCH /api/v1/admin/social-links/:id` | `z.boolean()` | Controls footer rendering |

---

## 2. Homepage Content (`homeData`)

| Field Name | Current Location | Admin Control | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Welcome Greeting** | `homeData.welcomeGreeting` | `input#home-welcome-greeting` | `HomeSetting.welcomeGreeting` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().max(100)` | Hero handwritten note |
| **Hero Title** | `homeData.heroTitle` | `input#home-hero-title` | `HomeSetting.heroTitle` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().min(1).max(150)` | Hero `<h1>` header |
| **Hero Tagline** | `homeData.heroTagline` | `input#home-hero-tagline` | `HomeSetting.heroTagline` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().max(300)` | Hero tagline `<p>` |
| **About Card Title** | `homeData.aboutCardTitle` | `input#home-about-title` | `HomeSetting.aboutCardTitle` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().min(1).max(100)` | About card `<h2>` header |
| **About Card Quote** | `homeData.aboutCardQuote` | `input#home-about-quote` | `HomeSetting.aboutCardQuote` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().max(250)` | About card handwritten quote |
| **About Card Summary** | `homeData.aboutCardSummary` | `textarea#home-about-summary` | `HomeSetting.aboutCardSummary` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().min(1)` | About card summary paragraph |
| **About Card Closing** | `homeData.aboutCardClosing` | `textarea#home-about-closing` | `HomeSetting.aboutCardClosing` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string()` | About card callout paragraph |
| **Featured Book ID** | `homeData.featuredBookId` | `select#home-featured-book-select` | `HomeSetting.featuredBookId` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().uuid().nullable()` | Homepage polaroid book card |
| **Banner Prefix** | `homeData.bannerTitlePrefix` | `input#home-banner-prefix` | `HomeSetting.bannerTitlePrefix` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().max(100)` | Ongoing WIP banner title |
| **Banner Button Text** | `homeData.bannerButtonText` | `input#home-banner-btn-text` | `HomeSetting.bannerButtonText` | `GET /api/v1/site/home` | `PATCH /api/v1/admin/home` | `z.string().max(50)` | Ongoing WIP banner CTA button |

---

## 3. About Page Content (`aboutData`)

| Field Name | Current Location | Admin Control | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `aboutData.pageTitle` | `input#about-page-title` | `AboutSetting.pageTitle` | `GET /api/v1/site/about` | `PATCH /api/v1/admin/about` | `z.string().min(1).max(100)` | About section `<h2>` header |
| **Page Subtitle** | `aboutData.pageSubtitle` | `input#about-page-subtitle` | `AboutSetting.pageSubtitle` | `GET /api/v1/site/about` | `PATCH /api/v1/admin/about` | `z.string().max(200)` | About section tagline |
| **Why I Write** | `aboutData.whyIWrite` | `textarea#about-why-i-write` | `AboutSetting.whyIWrite` | `GET /api/v1/site/about` | `PATCH /api/v1/admin/about` | `z.string().min(1)` | "Why I Write" paper card |
| **Anonymity Location** | `aboutData.anonymityDetails.location` | `input#anon-location` | `AboutSetting.anonLocation` | `GET /api/v1/site/about` | `PATCH /api/v1/admin/about` | `z.string().max(150)` | Writing retreat location log |
| **Anonymity Companion**| `aboutData.anonymityDetails.companion` | `input#anon-companion` | `AboutSetting.anonCompanion` | `GET /api/v1/site/about` | `PATCH /api/v1/admin/about` | `z.string().max(150)` | Writing companion log |
| **Anonymity Beverage** | `aboutData.anonymityDetails.beverage` | `input#anon-beverage` | `AboutSetting.anonBeverage` | `GET /api/v1/site/about` | `PATCH /api/v1/admin/about` | `z.string().max(150)` | Preferred brew log |
| **Trope Name** | `aboutData.favoriteTropes[].name` | `input#new-trope-name` | `Trope.name` | `GET /api/v1/site/about` | `POST /api/v1/admin/tropes` | `z.string().min(1).max(80)` | Favorite Tropes list item |
| **Trope Description** | `aboutData.favoriteTropes[].description` | `input#new-trope-desc` | `Trope.description` | `GET /api/v1/site/about` | `POST /api/v1/admin/tropes` | `z.string().max(250)` | Favorite Tropes hover tooltip |
| **Genre Name** | `aboutData.favoriteGenres[]` | `input#new-genre-input` | `Genre.name` | `GET /api/v1/site/about` | `POST /api/v1/admin/genres` | `z.string().min(1).max(80)` | Favorite Genres list |
| **Hobby Text** | `aboutData.hobbies[]` | `input#new-hobby-input` | `Hobby.name` | `GET /api/v1/site/about` | `POST /api/v1/admin/hobbies` | `z.string().min(1).max(100)` | Hobbies & Musings list |
| **Fun Fact Text** | `aboutData.funFacts[]` | `textarea#new-fact-text` | `FunFact.text` | `GET /api/v1/site/about` | `POST /api/v1/admin/fun-facts` | `z.string().min(1).max(500)` | Corkboard fun fact note |

---

## 4. Bookshelf & Book Catalog (`booksData` & `bookshelfConfig`)

| Field Name | Current Location | Admin Control | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Bookshelf Title** | `bookshelfConfig.pageTitle` | `input#bookshelf-title` | `BookshelfConfig.pageTitle` | `GET /api/v1/books` | `PATCH /api/v1/admin/bookshelf-config` | `z.string().min(1).max(100)` | Bookshelf section header |
| **Bookshelf Subtitle** | `bookshelfConfig.pageSubtitle` | `input#bookshelf-sub` | `BookshelfConfig.pageSubtitle` | `GET /api/v1/books` | `PATCH /api/v1/admin/bookshelf-config` | `z.string().max(250)` | Bookshelf section tagline |
| **Book Title** | `booksData[].title` | `input#book-edit-title` | `Book.title` | `GET /api/v1/books` | `POST/PATCH /api/v1/admin/books` | `z.string().min(1).max(150)` | 3D Book cover & Modal `<h2>` |
| **Book Slug / ID** | `booksData[].id` | Form auto-slug / edit | `Book.slug` | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | `z.string().min(1).max(100).regex(/^[a-z0-9-]+$/)` | URL hash & Modal target |
| **Book Genre** | `booksData[].genre` | `input#book-edit-genre` | `Book.genre` | `GET /api/v1/books` | `POST/PATCH /api/v1/admin/books` | `z.string().max(100)` | Modal genre badge |
| **Book Tagline** | `booksData[].tagline` | `input#book-edit-tagline` | `Book.tagline` | `GET /api/v1/books` | `POST/PATCH /api/v1/admin/books` | `z.string().max(250)` | Bookshelf item caption |
| **Book Synopsis** | `booksData[].synopsis` | `textarea#book-edit-synopsis` | `Book.synopsis` | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | `z.string().min(1)` | Modal synopsis paragraph |
| **Cover Image Path** | `booksData[].coverImage` | `input#book-edit-cover-img` / Upload | `Book.coverImage` | `GET /api/v1/books` | `POST/PATCH /api/v1/admin/books` | `z.string().nullable()` | 3D Book cover element |
| **Cover Color** | `booksData[].coverColor` | `input#book-edit-cover-color` | `Book.coverColor` | `GET /api/v1/books` | `POST/PATCH /api/v1/admin/books` | `z.string().regex(/^#[0-9A-Fa-f]{6}$/)` | 3D Book cover CSS variable |
| **Cover Doodle** | `booksData[].coverDoodle` | `select#book-edit-cover-doodle` | `Book.coverDoodle` | `GET /api/v1/books` | `POST/PATCH /api/v1/admin/books` | `z.enum(['quill','key','star','candle','moon','potion','dagger','heart','book','leaf'])` | 3D Book cover fallback SVG |
| **Character Profiles** | `booksData[].characters` | Form dynamic rows | `BookCharacter` (Relation) | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | Array of `{ name, role, desc }` | Modal character dossier cards |
| **Character Studio Art**| `booksData[].characterArtImage` | Upload / URL input | `Book.characterArtImage` | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | `z.string().nullable()` | Modal character art card |
| **Character Art Caption**| `booksData[].characterArtCaption`| Text input | `Book.characterArtCaption` | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | `z.string().nullable()` | Modal character art caption |
| **Pinterest Moodboard** | `booksData[].pinterestMoodboard`| `input#book-edit-pinterest` | `Book.pinterestMoodboard` | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | `z.string().url().nullable()` | Modal Pinterest banner link |
| **Playlist Tracks** | `booksData[].playlist` | Form dynamic rows | `BookPlaylistTrack` (Relation) | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | Array of `{ title, artist }` | Modal Soundtrack Archive list |
| **Purchase Links** | `booksData[].purchaseLinks` | Form dynamic rows | `BookPurchaseLink` (Relation) | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | Array of `{ store, url, disabled }` | Modal purchase tags |
| **Author Notes** | `booksData[].authorNotes` | `textarea#book-edit-notes` | `Book.authorNotes` | `GET /api/v1/books/:slug` | `POST/PATCH /api/v1/admin/books` | `z.string()` | Modal Letter from the Desk |

---

## 5. Writing Desk & WIP Tracker (`deskData`)

| Field Name | Current Location | Admin Control | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Project Title**| `deskData.projects[0].title` | `input#wip-title` | `WritingProject.title` | `GET /api/v1/writing-projects` | `PATCH /api/v1/admin/writing-projects/:id` | `z.string().min(1).max(150)` | Progress tracker & Home banner |
| **Project Status** | `deskData.projects[0].status` | `input#wip-status` | `WritingProject.status` | `GET /api/v1/writing-projects` | `PATCH /api/v1/admin/writing-projects/:id` | `z.string().max(100)` | Progress tracker status label |
| **Progress Percentage**| `deskData.projects[0].progress` | `input#wip-progress` | `WritingProject.progress` | `GET /api/v1/writing-projects` | `PATCH /api/v1/admin/writing-projects/:id` | `z.number().int().min(0).max(100)` | Progress bar fill width |
| **Word Count Text** | `deskData.projects[0].wordCount` | `input#wip-wordcount` | `WritingProject.wordCount` | `GET /api/v1/writing-projects` | `PATCH /api/v1/admin/writing-projects/:id` | `z.string().max(100)` | Progress bar metrics text |
| **Project Synopsis** | `deskData.projects[0].synopsis` | `textarea#wip-synopsis` | `WritingProject.synopsis` | `GET /api/v1/writing-projects` | `PATCH /api/v1/admin/writing-projects/:id` | `z.string()` | Progress card synopsis text |
| **Desk Log Date** | `deskData.updates[].date` | `input#new-log-date` | `DeskLog.date` | `GET /api/v1/writing-projects` | `POST /api/v1/admin/desk-logs` | `z.string().min(1)` | Desk logs timeline date |
| **Desk Log Text** | `deskData.updates[].text` | `textarea#new-log-text` | `DeskLog.text` | `GET /api/v1/writing-projects` | `POST /api/v1/admin/desk-logs` | `z.string().min(1)` | Desk logs timeline text |
| **Snippet Source** | `deskData.snippets[].source` | `input#new-snippet-source` | `ManuscriptSnippet.source` | `GET /api/v1/writing-projects` | `POST /api/v1/admin/snippets` | `z.string().min(1).max(100)` | Manuscript scrap header |
| **Snippet Text** | `deskData.snippets[].text` | `textarea#new-snippet-text` | `ManuscriptSnippet.text` | `GET /api/v1/writing-projects` | `POST /api/v1/admin/snippets` | `z.string().min(1)` | Typewriter scrap body |
| **Desk Quote Text** | `deskData.quotes[]` | `textarea#new-quote-text` | `DeskQuote.text` | `GET /api/v1/quotes` | `POST /api/v1/admin/quotes` | `z.string().min(1)` | Rotating quote slider card |
| **Sneak Peek Title** | `deskData.sneakPeeks[].title` | `input#new-sneak-title` | `SneakPeek.title` | `GET /api/v1/writing-projects` | `POST /api/v1/admin/sneak-peeks` | `z.string().min(1).max(150)` | Sneak Peek item header |
| **Sneak Peek Desc** | `deskData.sneakPeeks[].desc` | `textarea#new-sneak-desc` | `SneakPeek.desc` | `GET /api/v1/writing-projects` | `POST /api/v1/admin/sneak-peeks` | `z.string().min(1)` | Sneak Peek item description |

---

## 6. Mascot & Audio Settings (`mascot`)

| Field Name | Current Location | Admin Control | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mascot Name** | `siteConfig.mascot.name` | `input#mascot-name-edit` | `MascotConfig.name` | `GET /api/v1/mascot` | `PATCH /api/v1/admin/mascot` | `z.string().min(1).max(80)` | Mascot title tag |
| **Initial Speech** | `siteConfig.mascot.initialSpeech` | `input#mascot-initial-speech` | `MascotConfig.initialSpeech` | `GET /api/v1/mascot` | `PATCH /api/v1/admin/mascot` | `z.string().min(1).max(150)` | `#mascot-speech` default text |
| **Mascot Quotes** | `siteConfig.mascot.quotes[]` | `textarea#new-cat-quote-text` | `MascotQuote.text` | `GET /api/v1/mascot` | `POST /api/v1/admin/mascot/quotes` | `z.string().min(1).max(300)` | Interactive cat speech bubble |

---

## 7. Store & Merchandise (`storeData`)

| Field Name | Current Location | Admin Control | Database Model & Column | Read API Endpoint | Write API Endpoint | Validation Rules (Zod) | Public Display Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Product Title** | `storeData[].title` | `input#product-title` | `StoreProduct.title` | `GET /api/v1/products` | `POST/PATCH /api/v1/admin/products` | `z.string().min(1).max(150)` | Boutique item card header |
| **Product Description**| `storeData[].description` | `textarea#product-desc` | `StoreProduct.description` | `GET /api/v1/products` | `POST/PATCH /api/v1/admin/products` | `z.string().min(1)` | Boutique item card summary |
| **Product Price** | `storeData[].price` | `input#product-price` | `StoreProduct.price` | `GET /api/v1/products` | `POST/PATCH /api/v1/admin/products` | `z.string().min(1).max(30)` | Boutique item card price tag |
| **Product Status** | `storeData[].status` | `select#product-status` | `StoreProduct.status` | `GET /api/v1/products` | `POST/PATCH /api/v1/admin/products` | `z.enum(['active','coming-soon','out-of-stock'])` | Boutique item status badge |
| **Purchase Link** | `storeData[].link` | `input#product-link` | `StoreProduct.link` | `GET /api/v1/products` | `POST/PATCH /api/v1/admin/products` | `z.string().min(1)` | Boutique purchase button URL |
