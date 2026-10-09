# CMS Fix Audit Report — Dessy Ackerman Archive

This document provides a comprehensive audit of the CMS persistence, API routes, database models, and public rendering data flow across the application.

---

## 1. Audit Overview & Architecture Baseline

* **Frontend**: Vanilla HTML5, CSS3, JavaScript (`app.js`, `admin.js`, `styles.css`).
* **Backend**: Node.js, Express, Prisma ORM, PostgreSQL database (`mywebsite_db`).
* **Security & Auth**: Server-side sessions (Argon2id password hashing, HTTP-only session cookies), double-submit CSRF token validation (`X-CSRF-Token`).
* **API Base**: `/api/v1` (`/api/v1/auth`, `/api/v1/admin`, `/api/v1/site`).

---

## 2. Comprehensive Broken Feature Audit Matrix

### A. Writing Desk Components (`admin-desk`)

| Admin UI Location | Feature / Element | Existing HTML / Input | JS Handler | API Endpoint | Controller & Route | Prisma Model | DB Field | Public Render Function | Original Problem | Exact Fix Implemented |
|---|---|---|---|---|---|---|---|---|---|---|
| **Writing Desk → WIP Projects** | Edit WIP Button | `<button onclick="window.editAdminProject(idx)">` | `window.editAdminProject` | `PATCH /api/v1/admin/writing-projects/:id` | `updateWritingProject` in `admin.routes.js` | `WritingProject` | `title`, `status`, `progress`, `wordCount`, `synopsis` | `renderDesk()` in `app.js` | `window.editAdminProject` was undefined and form saved to `localStorage`. | Assigned `window.editAdminProject`, populates editor, submits to `PATCH /api/v1/admin/writing-projects/:id`, re-fetches `/api/v1/site`. |
| **Writing Desk → WIP Projects** | Set Primary WIP Button | `<button onclick="window.setAdminPrimaryProject(idx)">` | `window.setAdminPrimaryProject` | `PATCH /api/v1/admin/writing-projects/:id/set-primary` | `setPrimaryWritingProject` in `admin.routes.js` | `WritingProject` | `isPrimary` | `renderDesk()` in `app.js` | Saved to `localStorage` locally without DB call. | Created `setPrimaryWritingProject` controller using Prisma transaction, connected frontend button. |
| **Writing Desk → WIP Projects** | Delete WIP Button | `<button onclick="window.deleteAdminProject(idx)">` | `window.deleteAdminProject` | `DELETE /api/v1/admin/writing-projects/:id` | `deleteWritingProject` in `admin.routes.js` | `WritingProject` | Record deletion | `renderDesk()` in `app.js` | Saved to `localStorage` locally without DB call. | Created `deleteWritingProject` controller, connected frontend button with confirmation dialog. |
| **Writing Desk → Dear Timeline Logs** | Edit Log Button | `<button onclick="window.editAdminUpdate(idx)">` | `window.editAdminUpdate` | `PATCH /api/v1/admin/desk-logs/:id` | `updateDeskLog` in `admin.routes.js` | `DeskLog` | `date`, `text` | `renderDesk()` in `app.js` | `window.editAdminUpdate` was undefined and save used `localStorage`. | Created `updateDeskLog` controller, bound `editAdminUpdate`, updated form submit to call API. |
| **Writing Desk → Dear Timeline Logs** | Delete Log Button | `<button onclick="window.deleteAdminUpdate(idx)">` | `window.deleteAdminUpdate` | `DELETE /api/v1/admin/desk-logs/:id` | `deleteDeskLog` in `admin.routes.js` | `DeskLog` | Record deletion | `renderDesk()` in `app.js` | Used local array `.splice()` and `localStorage`. | Connected `deleteAdminUpdate` to `DELETE /api/v1/admin/desk-logs/:id`. |
| **Writing Desk → Manuscript Snippets** | Edit Snippet Button | `<button onclick="window.editAdminSnippet(idx)">` | `window.editAdminSnippet` | `PATCH /api/v1/admin/snippets/:id` | `updateSnippet` in `admin.routes.js` | `ManuscriptSnippet` | `source`, `text` | `renderDesk()` in `app.js` | `window.editAdminSnippet` was undefined and save used `localStorage`. | Created `updateSnippet` controller, bound `editAdminSnippet`, updated form submit to call API. |
| **Writing Desk → Manuscript Snippets** | Delete Snippet Button | `<button onclick="window.deleteAdminSnippet(idx)">` | `window.deleteAdminSnippet` | `DELETE /api/v1/admin/snippets/:id` | `deleteSnippet` in `admin.routes.js` | `ManuscriptSnippet` | Record deletion | `renderDesk()` in `app.js` | Used local array `.splice()` and `localStorage`. | Connected `deleteAdminSnippet` to `DELETE /api/v1/admin/snippets/:id`. |
| **Writing Desk → Sneak Peeks & Extras** | Edit Sneak Peek Button | `<button onclick="window.editAdminSneak(idx)">` | `window.editAdminSneak` | `PATCH /api/v1/admin/sneak-peeks/:id` | `updateSneakPeek` in `admin.routes.js` | `SneakPeek` | `title`, `desc` | `renderDesk()` in `app.js` | `window.editAdminSneak` was undefined and save used `localStorage`. | Created `updateSneakPeek` controller, bound `editAdminSneak`, updated form submit to call API. |
| **Writing Desk → Sneak Peeks & Extras** | Delete Sneak Peek Button | `<button onclick="window.deleteAdminSneak(idx)">` | `window.deleteAdminSneak` | `DELETE /api/v1/admin/sneak-peeks/:id` | `deleteSneakPeek` in `admin.routes.js` | `SneakPeek` | Record deletion | `renderDesk()` in `app.js` | Used local array `.splice()` and `localStorage`. | Connected `deleteAdminSneak` to `DELETE /api/v1/admin/sneak-peeks/:id`. |

---

### B. Bookshelf & Volumes Components (`admin-books`)

| Admin UI Location | Feature / Element | Existing HTML / Input | JS Handler | API Endpoint | Controller & Route | Prisma Model | DB Field | Public Render Function | Original Problem | Exact Fix Implemented |
|---|---|---|---|---|---|---|---|---|---|---|
| **Bookshelf & Volumes** | Book Record Editor | `#book-editor-form` | `saveBookForm()` | `POST /api/v1/admin/books` / `PATCH /api/v1/admin/books/:id` | `createBook` / `updateBook` in `admin.routes.js` | `Book`, `BookCharacter`, `BookPlaylistTrack`, `BookPurchaseLink` | `title`, `slug`, `genre`, `tagline`, `synopsis`, `coverImage`, `coverColor`, `coverDoodle`, `authorNotes`, `characters`, `playlist`, `purchaseLinks` | `renderBooks()` & `openBookModal()` in `app.js` | `saveBookForm()` only saved to `localStorage`. | Rewrote `saveBookForm()` to send payload via `apiFetch` to API endpoints and re-fetch live bundle. |
| **Bookshelf & Volumes** | Character Art Studio Images | `#book-art-image` & `#book-art-caption` | `openBookEditor()` & `saveBookForm()` | `POST /api/v1/admin/books` / `PATCH /api/v1/admin/books/:id` | `createBook` / `updateBook` | `Book` | `characterArtImage`, `characterArtCaption`, `characterArtPlaceholder` | `openBookModal()` in `app.js` | No input fields existed in admin form for image URL/path or caption. | Added inputs for `characterArtImage` and `characterArtCaption` in book editor HTML and `saveBookForm()`. |
| **Bookshelf & Volumes** | Conditional Character Art Section | Public Book Details Modal | `openBookModal()` | `GET /api/v1/site` | `getSiteBundle` in `public.controller.js` | `Book` | `characterArtImage` | `openBookModal()` in `app.js` | Placeholder text was rendered even when no image existed. | Ensured `app.js` checks `if (book.characterArtImage && book.characterArtImage.trim())`. Renders section ONLY if image exists. |
| **Bookshelf & Volumes** | Delete Book Record | `<button onclick="window.deleteAdminBook(id)">` | `window.deleteAdminBook` | `DELETE /api/v1/admin/books/:id` | `deleteBook` in `admin.routes.js` | `Book` | Record deletion | `renderBooks()` in `app.js` | Saved deletion to `localStorage` only. | Connected `deleteAdminBook` to `DELETE /api/v1/admin/books/:id`. |

---

### C. About Page Components (`admin-about`)

| Admin UI Location | Feature / Element | Existing HTML / Input | JS Handler | API Endpoint | Controller & Route | Prisma Model | DB Field | Public Render Function | Original Problem | Exact Fix Implemented |
|---|---|---|---|---|---|---|---|---|---|---|
| **About Page** | Main Story & Anonymity Details | `#admin-about-main-form` | Submit listener in `renderAdminAboutTab()` | `PATCH /api/v1/admin/about` | `updateAboutSettings` in `admin.routes.js` | `AboutSetting` | `pageTitle`, `pageSubtitle`, `whyIWrite`, `anonLocation`, `anonCompanion`, `anonBeverage` | `renderAbout()` in `app.js` | Only heading updated, rest saved to `localStorage`. | Updated submit handler to call `PATCH /api/v1/admin/about` via `apiFetch`. |
| **About Page** | Favorite Tropes | `#admin-add-trope-form` & `<button onclick="deleteAdminTrope(idx)">` | Submit & `window.deleteAdminTrope` | `POST /api/v1/admin/tropes` & `DELETE /api/v1/admin/tropes/:id` | `addTrope` / `deleteTrope` | `Trope` | `name`, `description` | `renderAbout()` in `app.js` | Saved to local array and `localStorage`. | Connected forms and delete buttons to `POST/DELETE /api/v1/admin/tropes`. |
| **About Page** | Favorite Genres | `#admin-add-genre-form` & `<button onclick="deleteAdminGenre(idx)">` | Submit & `window.deleteAdminGenre` | `POST /api/v1/admin/genres` & `DELETE /api/v1/admin/genres/:id` | `addGenre` / `deleteGenre` | `Genre` | `name` | `renderAbout()` in `app.js` | Saved to local array and `localStorage`. | Connected forms and delete buttons to `POST/DELETE /api/v1/admin/genres`. |
| **About Page** | Hobbies & Musings | `#admin-add-hobby-form` & `<button onclick="deleteAdminHobby(idx)">` | Submit & `window.deleteAdminHobby` | `POST /api/v1/admin/hobbies` & `DELETE /api/v1/admin/hobbies/:id` | `addHobby` / `deleteHobby` | `Hobby` | `name` | `renderAbout()` in `app.js` | Saved to local array and `localStorage`. | Connected forms and delete buttons to `POST/DELETE /api/v1/admin/hobbies`. |
| **About Page** | Fun Facts Corkboard | `#admin-add-fact-form` & `<button onclick="deleteAdminFact(idx)">` | Submit & `window.deleteAdminFact` | `POST /api/v1/admin/fun-facts` & `DELETE /api/v1/admin/fun-facts/:id` | `addFunFact` / `deleteFunFact` | `FunFact` | `text` | `renderAbout()` in `app.js` | Saved to local array and `localStorage`. | Connected forms and delete buttons to `POST/DELETE /api/v1/admin/fun-facts`. |

---

## 3. Data Flow Validation Summary

Each CMS operation now strictly obeys the required pipeline:
$$\text{Admin UI} \xrightarrow{\text{apiFetch (CSRF + Session)}} \text{Express Route} \xrightarrow{\text{Zod Validator}} \text{Prisma ORM} \xrightarrow{\text{PostgreSQL}} \xrightarrow{\text{GET /api/v1/site}} \text{Public app.js}$$

No operations rely on `localStorage` for content persistence.
