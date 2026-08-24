# InkForge — Professional Book Editing & Layout Software

> A premium, Vellum-inspired book formatting application built with React and Vite. Design beautiful print-ready books with professional themes, live page previews, and full typography control.

---

## ✨ Features

### 📖 Professional Book Themes (25 Presets)
Every theme is designed to match the quality of professional book formatting software like Vellum, each with its own unique identity:

| Category | Themes |
|---|---|
| **Traditional** | Classic Novel, Elegant Serif, Literary Fiction, Historical, Victorian |
| **Contemporary** | Modern Minimal, Art Deco, Vintage, Sci-Fi, Thriller |
| **Fantasy** | Epic Fantasy, Dark Fantasy, Medieval |
| **Romance** | Cozy Romance, Regency, Botanical |
| **Dark** | Gothic, Dark Academia, Mystery, Horror |
| **Whimsical** | Fairy Tale, Celestial, Children's Storybook |
| **Nature** | Nature, Ocean Breeze |

Each theme includes:
- **Unique fonts** — Curated heading and body font pairings (15+ Google Fonts)
- **Custom ornaments** — SVG-based decorative dividers (floral, geometric, celtic, gothic, celestial, and more)
- **Chapter opening designs** — Per-theme layout, spacing, and ornament positioning
- **Page layouts** — Typography settings, line heights, indentation, and paragraph spacing

### 📑 Dual Chapter Headings
Every chapter page displays two headings, matching professional book standards:

```
        CHAPTER ONE              ← Auto-generated from chapter position
        The Broken Crown         ← User-entered chapter title
             ❦                   ← Theme ornament
```

The chapter number label is automatically generated based on the chapter's index position. Supported numbering formats:
- **CHAPTER ONE** — Full uppercase word
- **Chapter One** — Capitalized word
- **Chapter 1** — Arabic numeral
- **CHAPTER I** — Roman numeral
- **None** — Title only (no chapter label)

### 📄 Running Headers & Page Numbers
On all regular pages (regardless of theme):
1. **Author name** — Top left header
2. **Book title** — Top right header
3. **Page number** — Top outer corner (left on even pages, right on odd pages)
4. **No headers on chapter opening pages** — By default, chapter pages are clean. Users can toggle headers on via the Chapter Designer.

### 🎨 Theme Customization Without Breaking Identity
Users can customize individual elements while the theme's overall look and identity is preserved:

- **Fonts** — Override body, heading, and header fonts independently
- **Ornaments** — Choose from 12+ chapter ornament styles and 10+ scene break symbols
- **Spacing** — Adjust font size, line height, chapter top offset, and margins
- **Chapter Style** — Change numbering format, title alignment, drop caps, and first paragraph style
- **Headers** — Toggle running headers, change page number position, show/hide on opening pages

### 🖥️ Live Page Preview
A real-time book page preview showing exactly how your printed book will look:
- **Paperback & Hardcover** — Two-page spread view with realistic crease shadow
- **EPUB & Kindle** — Device-frame preview for digital formats
- **Zoom** — 40% to 150% adjustable zoom
- **Page Navigation** — Flip through pages with automatic pagination

### ✍️ Rich Text Editor
- Full formatting toolbar (bold, italic, headings, blockquotes, lists)
- Scene break insertion with theme-matched divider symbols
- Markdown shortcuts (`#` → heading, `*` → list, `>` → blockquote)
- Find and replace
- Live word count, character count, and reading time

### 📚 Book Structure Management
- **Front Matter** — Title page, copyright, dedication, epigraph, foreword, preface
- **Chapters** — Drag-and-drop reordering, duplicate, delete
- **Back Matter** — Acknowledgements, about the author, also by, newsletter signup
- **Cover Image** — Upload or auto-generated canvas preview

### 💾 Auto-Save & Persistence
All book data, theme selections, and customizations are automatically saved to `localStorage` with debounced auto-save (800ms delay).

### 🖨️ Print & Export
- Native browser print with custom print CSS
- Export modal with format options

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/editing-software.git
cd editing-software

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Build for Production

```bash
npm run build
npm run preview  # Preview the production build
```

---

## 🏗️ Project Structure

```
src/
├── App.jsx                  # Main application — state management hub
├── main.jsx                 # React entry point
├── index.css                # Global styles, CSS variables, utilities
├── App.css                  # App-specific overrides
├── themes/
│   ├── presets.js            # 25 theme presets + SVG ornament library
│   └── defaultBook.js       # Default book data (sample content)
└── components/
    ├── TopNav.jsx            # Menu bar + toolbar
    ├── LeftSidebar.jsx       # Book structure panel (chapters, front/back matter)
    ├── Editor.jsx            # Rich text editor (contentEditable)
    ├── RightPreview.jsx      # Live page preview with pagination
    ├── ThemeGallery.jsx      # Theme selection modal with live mini-previews
    ├── ChapterDesigner.jsx   # Theme & layout customizer modal
    ├── SetupModal.jsx        # Book metadata setup
    ├── StatsPanel.jsx        # Word count & pricing stats
    └── ExportModal.jsx       # Export options modal
```

---

## 📐 Architecture

### State Management
All application state lives in `App.jsx` using React `useState` hooks. Data flows down via props to child components:

```
App.jsx (book, activeThemeId, chapterDesigner)
  ├── TopNav          — View switching, dark mode, undo/redo
  ├── LeftSidebar     — Chapter list, reordering, cover upload
  ├── Editor          — Content editing
  ├── RightPreview    — Live preview with theme applied
  ├── ThemeGallery    — Theme selection modal
  └── ChapterDesigner — Theme customization modal
```

### Theme Resolution Chain
Customizations override theme defaults via a cascading resolution:

```
Custom Override (chapterDesigner) → Theme Preset → Hardcoded Default
```

For example:
```javascript
const resolvedBodyFont = chapterDesigner?.customBodyFont || activeTheme?.bodyFont || 'serif';
```

This means users can customize individual settings while the theme's base identity is preserved.

### SVG Ornament Library
20+ inline SVG ornaments are embedded in `presets.js` as string data — no external image files needed. Each theme maps to a specific ornament via the `ornamentSvgKey` field in its `chapterOpening` config.

Available ornaments:
`floralFlourish` · `elegantSwirl` · `diamondGeometric` · `celticKnot` · `gothicCross` · `celestialStars` · `leafNature` · `artDecoGeometric` · `vintageTypewriter` · `swordFantasy` · `roseRomance` · `skullHorror` · `keyMystery` · `starBurst` · `oceanWave` · `thinRule` · `doubleRule` · `ornateCorner`

### Chapter Opening Design System
Each theme defines a `chapterOpening` configuration object:

```javascript
{
  layout: 'centered',          // 'centered' or 'left-aligned'
  numberSize: '0.75em',        // Chapter number label size
  numberLetterSpacing: '3px',  // Letter spacing for "CHAPTER ONE"
  numberWeight: 400,           // Font weight
  numberVariant: 'all-small-caps',
  titleSize: '1.9em',          // Chapter title size
  titleWeight: 500,
  topMargin: '22%',            // Top offset on chapter page
  ornamentType: 'svg',         // 'svg' or 'symbol'
  ornamentSvgKey: 'floralFlourish',
  decorativeBorder: false,     // Corner ornament borders
}
```

---

## 🎨 Theming & Customization

### Selecting a Theme
Open the **Theme Gallery** from the toolbar or `Style > Theme Gallery` menu. Each theme card shows a rich live preview of its chapter opening design with the actual fonts, ornaments, and styling applied.

### Customizing a Theme
Open the **Theme & Layout Customizer** from the toolbar or `Style > Chapter Designer` menu. Changes are applied as overrides — you can reset to theme defaults at any time.

#### Typography Tab
- Body font, heading font, header font (independent overrides)
- Font size (12px–18px)
- Line spacing (1.3–1.7)

#### Headers & Margins Tab
- Running headers visibility
- Page number position (top outer, bottom center, hidden)
- Show/hide headers on chapter opening pages
- Page margins (inside, outside, top, bottom in inches)

#### Chapter Layout Tab
- Title alignment (left, center, right)
- Chapter numbering style
- First page top offset
- Drop caps toggle
- First paragraph style (small caps, bold, uppercase, standard)

#### Ornaments Tab
- Chapter heading ornament (12 options)
- Scene break symbol (10 options)
- Theme ornament preview (SVG)

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool and dev server |
| **Lucide React** | Icon library |
| **Google Fonts** | 15 professional font families |
| **CSS Variables** | Light/dark mode theming |
| **localStorage** | Data persistence |

### Fonts Loaded
EB Garamond · Lora · Cormorant Garamond · Cinzel · Playfair Display · Rochester · IM Fell English · Alice · Spectral · Special Elite · Inter · Montserrat · Courier Prime · Creepster · Quicksand · Outfit

---

## 📝 Usage Guide

### Creating a New Chapter
Click **+ Add Chapter** in the toolbar or use `Insert > Chapter`. The chapter will appear in the sidebar and the chapter number label (e.g., "CHAPTER THREE") is auto-generated based on its position.

### Editing Chapter Titles
Click on the chapter title in the editor to edit it. The title you enter (e.g., "The Broken Crown") appears as the second heading on the chapter page. The chapter number label ("CHAPTER ONE") is generated automatically.

### Reordering Chapters
Drag and drop chapters in the left sidebar, or use the up/down arrow buttons.

### Inserting Scene Breaks
Click the scene break button (⎯) in the editor toolbar to insert a themed divider symbol.

### Switching Preview Modes
Use the preview toolbar buttons to switch between Paperback, Hardcover, EPUB, and Kindle views.

---

## 🌙 Dark Mode
Toggle dark mode from the top-right sun/moon icon. The editor UI switches to a dark theme while the book preview maintains the selected paper color (cream, white, or grey).

---

## 📜 License

This project is open source. See the LICENSE file for details.
