// app.js - SPA Router, Dynamic Page Renderers, and Interactive Elements for Dessy Ackerman's public website.

// --- Global App State ---
let currentTab = 'home';
let activeQuoteIndex = 0;
let isMusicPlaying = false;
let audioContext = null;
let musicIntervalId = null;
let currentBookshelfPage = 1;
const BOOKS_PER_PAGE = 2;

// --- SVG Icons Registry (For clean self-contained vector decorations) ---
const SVG_ICONS = {
  quill: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M7.5,21.5 C7.5,21.5 6.5,20.5 5.5,19 C4.2,17 3.5,14 4.5,10.5 C5.2,8 6.5,5.5 9,3 C8.5,5.5 8.5,8 9.5,10 C10.2,11.5 12,12.5 13.5,13.5 C15,14.5 16.5,16 17.5,17.5 C18,18.5 18,19 16,19 C14.5,19 13.5,18 12.5,17 C11.5,16 10,15.5 9,16.5 C8,17.5 8,18.5 8.5,19.5 C9,20.5 9.5,21 7.5,21.5 Z M21,3 L11.5,12.5 C11.5,12.5 12,13 12.5,13.5 L22,4 L21,3 Z" />
    </svg>`,
  key: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M12.5,2 C8.9,2 6,4.9 6,8.5 C6,10.7 7.1,12.6 8.8,13.7 L5,17.5 L5,20 L7.5,20 L7.5,21.5 L10,21.5 L10,20 L11.2,20 L12.3,14.9 C12.4,14.9 12.4,15 12.5,15 C16.1,15 19,12.1 19,8.5 C19,4.9 16.1,2 12.5,2 Z M12.5,6 C13.3,6 14,6.7 14,7.5 C14,8.3 13.3,9 12.5,9 C11.7,9 11,8.3 11,7.5 C11,6.7 11.7,6 12.5,6 Z" />
    </svg>`,
  star: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M12,17.27 L18.18,21 L16.54,13.97 L22,9.24 L14.81,8.62 L12,2 L9.19,8.62 L2,9.24 L7.45,13.97 L5.82,21 L12,17.27 Z" />
    </svg>`,
  candle: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M9,9 L15,9 L15,22 L9,22 Z M12,2 C12,2 14,4 14,5.5 C14,6.6 13.1,7.5 12,7.5 C10.9,7.5 10,6.6 10,5.5 C10,4 12,2 12,2 Z" />
    </svg>`,
  moon: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M12.3,2 C12.2,2.3 12.1,2.6 12.1,3 C12.1,7.4 15.7,11 20.1,11 C20.5,11 20.8,10.9 21.1,10.8 C19.9,15.6 15.6,19.1 10.5,19.1 C4.7,19.1 0,14.4 0,8.6 C0,3.5 3.5,-0.8 8.3,-2 C10,0.5 12.3,2 12.3,2 Z" transform="translate(1.5, 2.5)" />
    </svg>`,
  potion: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M10,2 L14,2 L14,4 L13,4 L13,7 L19,17 C19.8,18.4 18.8,20 17.2,20 L6.8,20 C5.2,20 4.2,18.4 5,17 L11,7 L11,4 L10,4 Z M10,12 L7.5,16 L16.5,16 L14,12 Z" />
    </svg>`,
  dagger: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M19.7,4.3 C20.1,3.9 20.1,3.3 19.7,2.9 L18.3,1.5 C17.9,1.1 17.3,1.1 16.9,1.5 L10.8,7.6 L8.3,6.2 L6.2,8.3 L7.6,10.8 L1.5,16.9 C1.1,17.3 1.1,17.9 1.5,18.3 L2.9,19.7 C3.3,20.1 3.9,20.1 4.3,19.7 L10.4,13.6 L12.9,15 L15,12.9 L13.6,10.4 Z" />
    </svg>`,
  heart: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z" />
    </svg>`,
  book: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M18,2 L6,2 C4.9,2 4,2.9 4,4 L4,20 C4,21.1 4.9,22 6,22 L18,22 C19.1,22 20,21.1 20,20 L20,4 C20,2.9 19.1,2 18,2 Z M6,4 L11,4 L11,12 L8.5,10.5 L6,12 L6,4 Z" />
    </svg>`,
  leaf: `
    <svg viewBox="0 0 24 24" class="icon-svg">
      <path d="M17,8 C8,10 5.9,16.17 3.82,21.34 L5.71,22 L6.66,19.7 C7.14,19.87 7.64,20 8,20 C19,20 22,3 22,3 C21,5 14,5.25 9,6.25 C4,7.25 2,11.5 2,13.5 C2,15.5 3.75,17.25 3.75,17.25 C7,8 17,8 17,8 Z" />
    </svg>`
};

// --- DOM Element Selectors ---
const DOM = {
  contentSlot: document.getElementById('content-slot'),
  navButtons: document.querySelectorAll('.nav-tab'),
  mobileNavToggle: document.getElementById('mobile-nav-toggle'),
  mobileNavMenu: document.getElementById('mobile-nav-menu'),
  mobileNavItems: document.querySelectorAll('.mobile-nav-item'),
  candleToggle: document.getElementById('candle-toggle'),
  mascot: document.getElementById('mascot-companion'),
  mascotSpeech: document.getElementById('mascot-speech'),
  musicBox: document.getElementById('music-box'),
  modal: document.getElementById('book-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalContentSlot: document.getElementById('modal-content-slot')
};

// --- Initializer ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/v1/site');
    if (res.ok) {
      const dbData = await res.json();
      window.authorData = deepMerge(window.authorData, dbData);
    }
  } catch (e) {
    console.warn("API server unreachable, using offline defaults from data.js", e);
  }

  syncGlobalDOM();
  initNavigation();
  initCandleMode();
  initMascot();
  initMusicBox();
  initModal();

  // Render default home view
  navigateTo('home', true);
});

// Deep merge helper
function deepMerge(target, source) {
  if (!source) return target;
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Synchronize static UI text (Sticky Note, Music Box, Mascot, Title, Social Stamps)
function syncGlobalDOM() {
  const data = window.authorData;
  if (!data) return;

  // Browser title
  if (data.siteConfig && data.siteConfig.siteTitle) {
    document.title = data.siteConfig.siteTitle;
  }

  // Desk Sticky Note
  const stickyNoteText = document.getElementById('desk-sticky-text');
  if (stickyNoteText && data.siteConfig && data.siteConfig.deskStickyNote) {
    stickyNoteText.textContent = `"${data.siteConfig.deskStickyNote}"`;
  }

  // Music Box Label
  const musicBoxLabel = document.getElementById('music-box-label');
  if (musicBoxLabel && data.siteConfig && data.siteConfig.musicBoxLabel) {
    musicBoxLabel.textContent = data.siteConfig.musicBoxLabel;
  }

  // Footer Social Stamps
  const stampsContainer = document.getElementById('footer-social-stamps');
  if (stampsContainer && data.siteConfig && data.siteConfig.socialLinks) {
    const activeLinks = data.siteConfig.socialLinks.filter(l => l.active !== false);
    stampsContainer.innerHTML = activeLinks.map(link => `
      <a href="${escapeHtml(link.url)}" class="social-stamp-link" target="_blank" rel="noopener" aria-label="${escapeHtml(link.name)} Profile">
        <span class="stamp-bg">${escapeHtml(link.icon || '📌')}</span>
        <span class="stamp-label handwritten">${escapeHtml(link.name)}</span>
      </a>
    `).join('');
  }

  // Mascot Speech initial
  const mascotSpeechText = document.querySelector('#mascot-speech .speech-bubble');
  if (mascotSpeechText && data.siteConfig && data.siteConfig.mascot && data.siteConfig.mascot.initialSpeech) {
    mascotSpeechText.textContent = data.siteConfig.mascot.initialSpeech;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- SPA Navigation & Router ---
function initNavigation() {
  // Desktop navigation click handlers
  DOM.navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navigateTo(targetTab);
    });
  });

  // Mobile drawer trigger
  DOM.mobileNavToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = DOM.mobileNavToggle.getAttribute('aria-expanded') === 'true';
    DOM.mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
    DOM.mobileNavMenu.classList.toggle('active');
  });

  // Mobile menu items
  DOM.mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTab = item.getAttribute('data-tab');
      navigateTo(targetTab);
      closeMobileMenu();
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', () => {
    closeMobileMenu();
  });
}

function closeMobileMenu() {
  DOM.mobileNavToggle.setAttribute('aria-expanded', 'false');
  DOM.mobileNavMenu.classList.remove('active');
}

function navigateTo(tabName, isInitial = false) {
  if (currentTab === tabName && !isInitial) return;

  // Update desktop nav states
  DOM.navButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update mobile nav states
  DOM.mobileNavItems.forEach(item => {
    if (item.getAttribute('data-tab') === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  if (isInitial) {
    currentTab = tabName;
    renderPage(tabName);
  } else {
    DOM.contentSlot.classList.add('fade-out-page');
    setTimeout(() => {
      currentTab = tabName;
      renderPage(tabName);
      DOM.contentSlot.classList.remove('fade-out-page');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }
}

function renderPage(tabName) {
  switch (tabName) {
    case 'home':
      renderHome();
      break;
    case 'about':
      renderAbout();
      break;
    case 'books':
      renderBooks();
      break;
    case 'desk':
      renderDesk();
      break;
    default:
      renderHome();
  }
}

// ==========================================================================
// 1. HOMEPAGE RENDERING
// ==========================================================================
function renderHome() {
  const data = window.authorData;
  const home = data.homeData || {};
  const about = data.aboutData || {};
  const books = data.booksData || [];
  const desk = data.deskData || {};

  // Featured book
  let featuredBook = books.find(b => b.id === home.featuredBookId) || books[0] || {
    id: "default",
    title: "Our Hundred Days",
    genre: "Cozy Fantasy",
    tagline: "A story about healing.",
    coverColor: "#aa7f66",
    coverDoodle: "quill"
  };

  // Active WIP
  const latestProject = (desk.projects && desk.projects[0]) || {
    title: "Kindred",
    status: "Drafting",
    progress: 50
  };

  const welcomeGreeting = home.welcomeGreeting || "Hello dear reader,";
  const heroTitle = home.heroTitle || "Welcome to Dessy's Archive";
  const heroTagline = home.heroTagline || about.tagline || "Storyteller. Dreamer. Avid coffee lover.";
  const aboutCardTitle = home.aboutCardTitle || "About the Author";
  const aboutCardSummary = home.aboutCardSummary || (about.whyIWrite ? about.whyIWrite.substring(0, 240) + "..." : "Welcome to my writing corner.");
  const aboutCardQuote = home.aboutCardQuote || "Stories are houses built out of whispers.";
  const aboutCardClosing = home.aboutCardClosing || "Explore this archive to read the snippets pinned on my desk, listen to the soundtracks driving the chapters, and uncover the worlds of fantasy and shadows.";
  const bannerTitlePrefix = home.bannerTitlePrefix || "Currently Drafting:";
  const bannerButtonText = home.bannerButtonText || "Visit Writing Desk →";

  DOM.contentSlot.innerHTML = `
    <div class="home-layout">
      <!-- Hero Welcome Section -->
      <section class="hero-sec">
        <span class="welcome-note handwritten">${escapeHtml(welcomeGreeting)}</span>
        <h1>${escapeHtml(heroTitle)}</h1>
        <p class="tagline">"${escapeHtml(heroTagline)}"</p>
      </section>

      <!-- Grid layout -->
      <div class="home-grid">
        <!-- Text intro -->
        <article class="paper-note-card">
          <h2>${escapeHtml(aboutCardTitle)}</h2>
          <p>${escapeHtml(aboutCardSummary)}</p>
          <p class="handwritten" style="font-size: 1.4rem; padding-left: 20px; color: var(--color-sage);">
            "${escapeHtml(aboutCardQuote)}"
          </p>
          <p>${escapeHtml(aboutCardClosing)}</p>
        </article>

        <!-- Polaroid preview of books -->
        <div class="home-polaroid-side">
          <div class="polaroid-frame left" id="home-featured-book-btn" data-id="${featuredBook.id}">
            <div class="tape-overlay"></div>
            <div class="polaroid-image-placeholder" style="--color-cover: ${featuredBook.coverColor || '#aa7f66'}">
              ${featuredBook.coverImage ?
                `<img src="${escapeHtml(featuredBook.coverImage)}" class="polaroid-img" alt="${escapeHtml(featuredBook.title)} Cover" style="width:100%; height:100%; object-fit:cover;" />` :
                `${SVG_ICONS[featuredBook.coverDoodle] || SVG_ICONS.quill}
                 <div class="book-cover-title">${escapeHtml(featuredBook.title)}</div>`
              }
            </div>
            <div class="polaroid-caption handwritten">Featured Book</div>
          </div>
        </div>
      </div>

      <!-- Ongoing Writing Updates Banner -->
      <div class="home-update-banner">
        <span class="pinned-clip">📌</span>
        <div>
          <h3>${escapeHtml(bannerTitlePrefix)} ${escapeHtml(latestProject.title)}</h3>
          <p>Status: ${escapeHtml(latestProject.status)} (${latestProject.progress || 0}% complete)</p>
        </div>
        <button class="btn-view-desk" id="home-visit-desk-btn">${escapeHtml(bannerButtonText)}</button>
      </div>
    </div>
  `;

  // Attach dynamic event listeners for elements inside home
  const featuredBtn = document.getElementById('home-featured-book-btn');
  if (featuredBtn) {
    featuredBtn.addEventListener('click', () => {
      openBookModal(featuredBook.id);
    });
  }

  const visitDeskBtn = document.getElementById('home-visit-desk-btn');
  if (visitDeskBtn) {
    visitDeskBtn.addEventListener('click', () => {
      navigateTo('desk');
    });
  }
}

// ==========================================================================
// 2. ABOUT PAGE RENDERING
// ==========================================================================
function renderAbout() {
  const data = window.authorData.aboutData || {};

  const tropesHTML = (data.favoriteTropes || []).map(t =>
    `<li class="trope-badge" title="${escapeHtml(t.description || '')}">${escapeHtml(t.name || t)}</li>`
  ).join('');

  const genresHTML = (data.favoriteGenres || []).map(g =>
    `<li>${escapeHtml(g)}</li>`
  ).join('');

  const factsHTML = (data.funFacts || []).map(fact =>
    `<div class="fact-note"><p>${escapeHtml(fact)}</p></div>`
  ).join('');

  const hobbiesHTML = (data.hobbies || []).map(h =>
    `<li>${escapeHtml(h)}</li>`
  ).join('');

  const pageTitle = data.pageTitle || "About Dessy";
  const pageSubtitle = data.pageSubtitle || "Writing secret stories from behind a mask of parchment and ink.";
  const anonymity = data.anonymityDetails || {
    location: "My favorite local pastry shop",
    companion: "A cozy plushie",
    beverage: "Warm coffee"
  };

  DOM.contentSlot.innerHTML = `
    <div class="about-layout">
      <!-- Main Intro Column -->
      <div class="about-intro-sec">
        <h2>${escapeHtml(pageTitle)}</h2>
        <p class="tagline">"${escapeHtml(pageSubtitle)}"</p>
        
        <div class="scrap-paper-card" style="--rot: -1.5deg;">
          <h3>Why I Write</h3>
          <p>${escapeHtml(data.whyIWrite || '')}</p>
        </div>

        <div class="scrap-paper-card" style="--rot: 1deg;">
          <h3>The Small Details (Anonymity Logs)</h3>
          <p><strong>Writing Retreat:</strong> ${escapeHtml(anonymity.location || '')}</p>
          <p style="margin-top: 0.5rem;"><strong>Writing Companion:</strong> ${escapeHtml(anonymity.companion || '')}</p>
          <p style="margin-top: 0.5rem;"><strong>Preferred Brew:</strong> ${escapeHtml(anonymity.beverage || '')}</p>
        </div>
      </div>

      <!-- Details List Column -->
      <div class="about-details-sec">
        <div class="details-paper-sheet">
          <h3>Favorite Tropes</h3>
          <ul class="tropes-list">
            ${tropesHTML || '<li>None cataloged yet</li>'}
          </ul>
          <p style="font-size: 0.85rem; color: var(--color-ink-light); margin-top: 0.8rem; font-style: italic;">
            *Hover over tags to view brief trope descriptions.
          </p>
        </div>

        <div class="details-paper-sheet">
          <h3>Favorite Genres</h3>
          <ul class="genres-list">
            ${genresHTML || '<li>None cataloged yet</li>'}
          </ul>
        </div>

        <div class="details-paper-sheet hobbies-section">
          <h3>Hobbies & Musings</h3>
          <ul class="hobbies-list">
            ${hobbiesHTML || '<li>None cataloged yet</li>'}
          </ul>
        </div>
      </div>

      <!-- Fun Facts (Pins board look) -->
      <section class="fun-facts-corkboard">
        <h3>Ink-Stained Fun Facts</h3>
        <div class="facts-grid">
          ${factsHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No fun facts added yet.</p>'}
        </div>
      </section>
    </div>
  `;
}

// ==========================================================================
// 3. BOOKSHELF GRID RENDERING (Max 2 books per page, centered)
// ==========================================================================
function renderBooks(page = 1) {
  currentBookshelfPage = page;
  const booksConfig = window.authorData.bookshelfConfig || {};
  const pageTitle = booksConfig.pageTitle || "The Bookshelf";
  const pageSubtitle = booksConfig.pageSubtitle || "Step inside stories written in ink, magic, and shadow. Click on any volume to open its scrapbook journal.";
  const allBooks = window.authorData.booksData || [];

  const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE) || 1;
  if (currentBookshelfPage > totalPages) currentBookshelfPage = totalPages;
  if (currentBookshelfPage < 1) currentBookshelfPage = 1;

  const startIndex = (currentBookshelfPage - 1) * BOOKS_PER_PAGE;
  const displayedBooks = allBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  const isSingle = displayedBooks.length === 1;

  const booksHTML = displayedBooks.map(book => `
    <div class="bookshelf-item" data-id="${escapeHtml(book.id)}">
      <div class="book-cover-3d" style="--cover-color: ${book.coverColor || '#aa7f66'}">
        <div class="book-foil-accent" style="z-index: 2;"></div>
        <div class="book-spine-highlight" style="position: absolute; top: 0; left: 0; width: 14px; height: 100%; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(0,0,0,0.25) 80%, rgba(255,255,255,0.05) 100%); border-right: 1px solid rgba(0,0,0,0.2); z-index: 2; pointer-events: none;"></div>
        ${book.coverImage ?
          `<img src="${escapeHtml(book.coverImage)}" class="book-cover-img" alt="${escapeHtml(book.title)} cover" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; border-radius: 4px 16px 16px 4px;" />` :
          `<h3>${escapeHtml(book.title)}</h3>
           <div class="book-cover-doodle-container">
             ${SVG_ICONS[book.coverDoodle] || SVG_ICONS.quill}
           </div>
           <div class="cover-author">D. Ackerman</div>`
        }
      </div>
      <p class="book-tagline-short">"${escapeHtml(book.tagline || '')}"</p>
    </div>
  `).join('');

  const paginationHTML = totalPages > 1 ? `
    <div class="bookshelf-pagination">
      <button class="bookshelf-page-btn" id="bookshelf-prev-btn" ${currentBookshelfPage === 1 ? 'disabled' : ''}>
        ← Previous Page
      </button>
      <span class="bookshelf-page-indicator">Page ${currentBookshelfPage} of ${totalPages}</span>
      <button class="bookshelf-page-btn" id="bookshelf-next-btn" ${currentBookshelfPage === totalPages ? 'disabled' : ''}>
        Next Page →
      </button>
    </div>
  ` : '';

  DOM.contentSlot.innerHTML = `
    <div class="bookshelf-layout">
      <section class="bookshelf-title-sec">
        <h2>${escapeHtml(pageTitle)}</h2>
        <p>${escapeHtml(pageSubtitle)}</p>
      </section>

      <div class="bookshelf-grid ${isSingle ? 'single-book' : ''}">
        ${booksHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No books published in the archive yet.</p>'}
      </div>

      ${paginationHTML}
    </div>
  `;

  // Click handler to open detail overlays
  document.querySelectorAll('.bookshelf-item').forEach(item => {
    item.addEventListener('click', () => {
      const bookId = item.getAttribute('data-id');
      openBookModal(bookId);
    });
  });

  // Attach pagination click handlers
  if (totalPages > 1) {
    const prevBtn = document.getElementById('bookshelf-prev-btn');
    const nextBtn = document.getElementById('bookshelf-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentBookshelfPage > 1) {
          renderBooks(currentBookshelfPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentBookshelfPage < totalPages) {
          renderBooks(currentBookshelfPage + 1);
        }
      });
    }
  }
}

// ==========================================================================
// 4. WRITING DESK PAGE RENDERING
// ==========================================================================
function renderDesk() {
  const desk = window.authorData.deskData || {};
  const projects = desk.projects || [];
  const primaryProject = projects[0] || {
    title: "Kindred",
    status: "Drafting",
    progress: 50,
    wordCount: "0 / 80,000 words",
    synopsis: "Ongoing story."
  };

  const updatesHTML = (desk.updates || []).map(u => `
    <li class="timeline-item">
      <span class="timeline-date">${escapeHtml(u.date)}</span>
      <p class="timeline-text">${escapeHtml(u.text)}</p>
    </li>
  `).join('');

  const snippetsHTML = (desk.snippets || []).map((snip, idx) => `
    <div class="typewriter-scrap" style="transform: rotate(${idx % 2 === 0 ? '-1deg' : '1.5deg'});">
      <div class="scrap-header">${escapeHtml(snip.source)}</div>
      <p style="white-space: pre-line;">${escapeHtml(snip.text)}</p>
      <div class="torn-bottom-edge"></div>
    </div>
  `).join('');

  const sneakHTML = (desk.sneakPeeks || []).map(sp => `
    <div class="sneak-peek-item">
      <h4>${escapeHtml(sp.title)}</h4>
      <p>${escapeHtml(sp.desc)}</p>
    </div>
  `).join('');

  DOM.contentSlot.innerHTML = `
    <div class="desk-layout">
      <!-- Main timeline columns -->
      <div class="desk-main-updates">
        <!-- Progress bar card -->
        <div class="progress-tracker-card">
          <h3>${escapeHtml(desk.projectsTitle || "Current Work-in-Progress")}</h3>
          <span class="proj-status">"${escapeHtml(primaryProject.title)}" — ${escapeHtml(primaryProject.status)}</span>
          
          <div class="progress-bar-container">
            <div class="progress-bar-fill" id="desk-progress-fill" style="width: 0%;"></div>
          </div>
          <div class="progress-metrics">
            <span>Progress: ${primaryProject.progress || 0}%</span>
            <span>${escapeHtml(primaryProject.wordCount || '')}</span>
          </div>
          <p style="margin-top: 1rem; font-size: 0.95rem; color: var(--color-ink-faded); font-style: italic;">
            <strong>Synopsis sneak peek:</strong> ${escapeHtml(primaryProject.synopsis || '')}
          </p>
        </div>

        <section>
          <h3 class="details-section-title" style="margin-top: 0;">${escapeHtml(desk.snippetsTitle || "Manuscript Snippets & Scraps")}</h3>
          ${snippetsHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No snippets pinned yet.</p>'}
        </section>

        <!-- Timeline Log -->
        <section class="timeline-card">
          <h3>${escapeHtml(desk.logsTitle || "Logs from the Desk")}</h3>
          <ul class="timeline-list">
            ${updatesHTML || '<li class="timeline-item"><p class="timeline-text">No logs posted yet.</p></li>'}
          </ul>
        </section>
      </div>

      <!-- Sidebar details -->
      <div class="desk-sidebar-items">
        <!-- Rotating quotes slider -->
        <div class="desk-quote-slider-card">
          <div class="quote-text-container" id="quote-slider-slot">
            <!-- Populated via js trigger -->
          </div>
          <button class="quote-btn-next" id="quote-next-btn">Turn Page →</button>
        </div>

        <!-- Sneak peek links -->
        <div class="sneak-peeks-card">
          <h3 style="font-size: 1.3rem; border-bottom: 1px solid var(--color-parchment-accent); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            ${escapeHtml(desk.sneakPeeksTitle || "Sneak Peeks & Extras")}
          </h3>
          ${sneakHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No extras added yet.</p>'}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const fill = document.getElementById('desk-progress-fill');
    if (fill) fill.style.width = `${primaryProject.progress || 0}%`;
  }, 150);

  initQuoteSlider();
}

function initQuoteSlider() {
  const quoteSlot = document.getElementById('quote-slider-slot');
  const quoteBtn = document.getElementById('quote-next-btn');
  const quotes = (window.authorData.deskData && window.authorData.deskData.quotes) || [
    "\"We are all just drafts of the stories we hope to leave behind.\" — Dessy Ackerman"
  ];

  if (!quoteSlot || quotes.length === 0) return;

  const showQuote = (idx) => {
    quoteSlot.innerHTML = `<p>${escapeHtml(quotes[idx])}</p>`;
  };

  if (activeQuoteIndex >= quotes.length) activeQuoteIndex = 0;
  showQuote(activeQuoteIndex);

  if (quoteBtn) {
    quoteBtn.onclick = () => {
      activeQuoteIndex = (activeQuoteIndex + 1) % quotes.length;
      quoteSlot.style.opacity = 0;
      setTimeout(() => {
        showQuote(activeQuoteIndex);
        quoteSlot.style.opacity = 1;
      }, 200);
    };
  }
}

// ==========================================================================
// 5. BOOK DETAILS MODAL CONTROLLER
// ==========================================================================
function initModal() {
  DOM.modalCloseBtn.addEventListener('click', () => {
    closeBookModal();
  });

  DOM.modal.addEventListener('click', (e) => {
    if (e.target === DOM.modal) {
      closeBookModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.modal.classList.contains('active')) {
      closeBookModal();
    }
  });
}

function openBookModal(bookId) {
  const books = window.authorData.booksData || [];
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const tropesHTML = (book.tropes || []).map(t =>
    `<span class="trope-badge" style="cursor: default;">${escapeHtml(t)}</span>`
  ).join('');

  const characterCardsHTML = (book.characters || []).map(c => `
    <div class="character-profile-card">
      <h4>${escapeHtml(c.name)}</h4>
      <span class="char-role">${escapeHtml(c.role)}</span>
      <p>${escapeHtml(c.desc)}</p>
    </div>
  `).join('');

  const playlistTracksHTML = (book.playlist || []).map((track, i) => `
    <li class="playlist-track-item">
      <div>
        <span style="color: var(--color-rose); margin-right: 8px;">0${i + 1}.</span>
        <span class="track-title">${escapeHtml(track.title)}</span>
      </div>
      <span class="track-artist">${escapeHtml(track.artist)}</span>
    </li>
  `).join('');

  const purchaseTagsHTML = (book.purchaseLinks || []).map(link => `
    <a href="${escapeHtml(link.url || '#')}" 
       class="purchase-tag ${link.disabled ? 'disabled' : ''}" 
       target="_blank" 
       rel="noopener"
       ${link.disabled ? 'aria-disabled="true"' : ''}>
      ${escapeHtml(link.store)}
    </a>
  `).join('');

  DOM.modalContentSlot.innerHTML = `
    <div class="book-details-layout">
      <!-- Left column: Visual styling details + Buy links -->
      <aside class="book-details-sidebar">
        <div class="book-cover-3d" style="--cover-color: ${book.coverColor || '#aa7f66'}; cursor: default; transform: none; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <div class="book-foil-accent" style="z-index: 2;"></div>
          <div class="book-spine-highlight" style="position: absolute; top: 0; left: 0; width: 14px; height: 100%; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(0,0,0,0.25) 80%, rgba(255,255,255,0.05) 100%); border-right: 1px solid rgba(0,0,0,0.2); z-index: 2; pointer-events: none;"></div>
          ${book.coverImage ?
            `<img src="${escapeHtml(book.coverImage)}" class="book-cover-img" alt="${escapeHtml(book.title)} cover" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; border-radius: 4px 16px 16px 4px;" />` :
            `<h3>${escapeHtml(book.title)}</h3>
             <div class="book-cover-doodle-container">
               ${SVG_ICONS[book.coverDoodle] || SVG_ICONS.quill}
             </div>
             <div class="cover-author">D. Ackerman</div>`
          }
        </div>

        <div class="purchase-tags">
          <span class="handwritten" style="text-align: center; font-size: 1.2rem; color: var(--color-ink-light);">Acquire Copy:</span>
          ${purchaseTagsHTML || '<p style="color:var(--color-ink-light); font-style:italic;">Links coming soon.</p>'}
        </div>
      </aside>

      <!-- Right column: Main texts, profiles, playlists, quotes -->
      <div class="book-details-main">
        <h2 id="modal-book-title">${escapeHtml(book.title)}</h2>
        <span class="genre-label">${escapeHtml(book.genre || '')}</span>
        
        <p class="synopsis-text">${escapeHtml(book.synopsis || '')}</p>

        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 1rem; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--color-ink-light);">Book Tropes</h4>
          <div class="tropes-list">${tropesHTML || '<span>None cataloged</span>'}</div>
        </div>

        <h3 class="details-section-title">Character Dossier</h3>
        <div class="characters-grid">
          ${characterCardsHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No character profiles added yet.</p>'}
        </div>
        
        <!-- Character Art Studio (Only shows if an art image is added in admin) -->
        ${(book.characterArtImage && book.characterArtImage.trim()) ? `
          <div class="character-art-studio-card">
            <h4>🎨 Character Art Studio</h4>
            <div class="character-art-frame">
              <img src="${escapeHtml(book.characterArtImage.trim())}" alt="${escapeHtml(book.title)} Character Art" />
              ${book.characterArtCaption ? `<p class="character-art-caption">${escapeHtml(book.characterArtCaption)}</p>` : ''}
            </div>
          </div>
        ` : ''}

        ${book.pinterestMoodboard ? `
          <a href="${escapeHtml(book.pinterestMoodboard)}" class="moodboard-promo-link" target="_blank" rel="noopener">
            <span class="pin-icon">📌</span>
            <div>
              <h4 style="margin: 0; font-size: 1.1rem;">Explore the visual moodboard</h4>
              <p>View aesthetics, character designs, and scenery mockups on Pinterest.</p>
            </div>
          </a>
        ` : ''}

        <h3 class="details-section-title">Soundtrack Archive</h3>
        <div class="playlist-wrapper">
          <ul class="playlist-tracks">
            ${playlistTracksHTML || '<li>No soundtrack tracks cataloged yet.</li>'}
          </ul>
        </div>

        <h3 class="details-section-title">Letter from the Desk</h3>
        <blockquote class="author-notes-letter">
          <p style="white-space: pre-line;">${escapeHtml(book.authorNotes || '')}</p>
          <p style="margin-top: 1rem; text-align: right; font-weight: bold;" class="handwritten">— Dessy</p>
        </blockquote>
      </div>
    </div>
  `;

  DOM.modal.classList.add('active');
  DOM.modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeBookModal() {
  DOM.modal.classList.remove('active');
  DOM.modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// --- Theme Settings (Candlelight Ambient Light) ---
function initCandleMode() {
  const isCandlelit = localStorage.getItem('theme-candle') === 'true';
  if (isCandlelit) {
    document.body.classList.add('candlelight-mode');
    updateCandleBtn(true);
  }

  DOM.candleToggle.addEventListener('click', () => {
    const hasMode = document.body.classList.toggle('candlelight-mode');
    localStorage.setItem('theme-candle', hasMode);
    updateCandleBtn(hasMode);
  });
}

function updateCandleBtn(isCandlelit) {
  const labelText = DOM.candleToggle.querySelector('.btn-text');
  const icon = DOM.candleToggle.querySelector('.icon');

  if (isCandlelit) {
    labelText.textContent = 'Extinguish Candle';
    icon.textContent = '💨';
  } else {
    labelText.textContent = 'Light Candle';
    icon.textContent = '🕯️';
  }
}

// --- Companion Mascot Interaction (Poe the Cat) ---
function initMascot() {
  let quoteCooldown = false;

  DOM.mascot.addEventListener('click', () => {
    if (quoteCooldown) return;
    quoteCooldown = true;

    const catQuotes = (window.authorData.siteConfig && window.authorData.siteConfig.mascot && window.authorData.siteConfig.mascot.quotes) || [
      "\"The first draft is just sand. You mold it into sandcastles later.\"",
      "\"A keyboard is warm. That is why I lie on it.\"",
      "\"Make it cozy, make it mysterious!\""
    ];

    const idx = Math.floor(Math.random() * catQuotes.length);
    const speechBox = DOM.mascotSpeech.querySelector('.speech-bubble');
    speechBox.textContent = catQuotes[idx];

    DOM.mascotSpeech.classList.add('active');
    DOM.mascot.style.transform = 'scale(1.1)';
    setTimeout(() => { DOM.mascot.style.transform = ''; }, 200);

    setTimeout(() => {
      DOM.mascotSpeech.classList.remove('active');
      quoteCooldown = false;
    }, 4500);
  });

  const blinkLoop = () => {
    const catSvg = DOM.mascot.querySelector('.desk-cat');
    if (!catSvg) return;
    const delay = Math.random() * 4000 + 1500;

    setTimeout(() => {
      catSvg.classList.add('blinking');
      setTimeout(() => {
        catSvg.classList.remove('blinking');
        blinkLoop();
      }, 150);
    }, delay);
  };

  blinkLoop();
}

// --- Interactive Web Audio API Music Box ---
function initMusicBox() {
  const mel = [
    { note: 523.25, dur: 0.3 }, // C5
    { note: 587.33, dur: 0.3 }, // D5
    { note: 659.25, dur: 0.3 }, // E5
    { note: 783.99, dur: 0.4 }, // G5
    { note: 783.99, dur: 0.2 }, // G5
    { note: 880.00, dur: 0.3 }, // A5
    { note: 783.99, dur: 0.3 }, // G5
    { note: 659.25, dur: 0.6 }, // E5

    { note: 523.25, dur: 0.3 }, // C5
    { note: 587.33, dur: 0.3 }, // D5
    { note: 659.25, dur: 0.3 }, // E5
    { note: 523.25, dur: 0.4 }, // C5
    { note: 440.00, dur: 0.2 }, // A4
    { note: 493.88, dur: 0.3 }, // B4
    { note: 523.25, dur: 0.6 }  // C5
  ];

  DOM.musicBox.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopMusicBox();
    } else {
      startMusicBox();
    }
  });

  function startMusicBox() {
    isMusicPlaying = true;
    DOM.musicBox.classList.add('playing');

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    let noteIdx = 0;

    const playNextNote = () => {
      if (!isMusicPlaying) return;

      const item = mel[noteIdx];
      playChime(item.note, item.dur);
      spawnVisualNote();

      noteIdx = (noteIdx + 1) % mel.length;
      musicIntervalId = setTimeout(playNextNote, (item.dur + 0.1) * 1000);
    };

    playNextNote();
  }

  function stopMusicBox() {
    isMusicPlaying = false;
    DOM.musicBox.classList.remove('playing');
    clearTimeout(musicIntervalId);
  }

  function playChime(freq, duration) {
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  }

  function spawnVisualNote() {
    const container = DOM.musicBox.querySelector('.music-notes-container');
    if (!container) return;
    const noteEl = document.createElement('div');
    noteEl.className = 'floating-note';

    const icons = ['🎵', '🎶', '✨', '🌸', '✨'];
    noteEl.textContent = icons[Math.floor(Math.random() * icons.length)];

    const dx = (Math.random() * 40 - 20) + 'px';
    const dr = (Math.random() * 60 - 30) + 'deg';
    noteEl.style.setProperty('--dx', dx);
    noteEl.style.setProperty('--dr', dr);
    noteEl.style.left = (Math.random() * 30 + 15) + 'px';

    container.appendChild(noteEl);
    setTimeout(() => { noteEl.remove(); }, 2000);
  }
}
