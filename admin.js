// admin.js - Standalone Owner Ledger / Admin Portal for Dessy Ackerman's website.

// --- Global SVG Icons Registry ---
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

const adminDOM = {
  slot: document.getElementById('admin-slot'),
  topBar: document.getElementById('admin-top-bar'),
  headerLockBtn: document.getElementById('header-lock-btn'),
  modal: document.getElementById('book-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalContentSlot: document.getElementById('modal-content-slot')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Sync state with localStorage to persist content updates and deep-merge defaults
  let localData = localStorage.getItem('dessy_archive_data');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      window.authorData = deepMerge(window.authorData, parsed);
    } catch (e) {
      console.error("Failed to parse local storage data", e);
    }
  } else {
    localStorage.setItem('dessy_archive_data', JSON.stringify(window.authorData));
  }

  initModal();
  checkAuth();
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

function saveLocalData() {
  localStorage.setItem('dessy_archive_data', JSON.stringify(window.authorData));
}

function showAdminToast(message, icon = '✨') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
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

// --- Global State ---
let currentCsrfToken = '';

async function apiFetch(url, options = {}) {
  options.credentials = 'include';
  options.headers = options.headers || {};
  if (currentCsrfToken && !['GET', 'HEAD'].includes((options.method || 'GET').toUpperCase())) {
    options.headers['X-CSRF-Token'] = currentCsrfToken;
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, options);
  if (response.status === 401 && !url.includes('/api/v1/auth/login') && !url.includes('/api/v1/auth/session')) {
    sessionStorage.removeItem('admin_session');
    checkAuth();
    throw new Error('Unauthorized');
  }
  return response;
}

// --- Auth Gate ---
async function checkAuth() {
  try {
    const res = await fetch('/api/v1/auth/session', { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated) {
      currentCsrfToken = data.csrfToken || '';
      sessionStorage.setItem('admin_session', 'true');
      if (adminDOM.topBar) adminDOM.topBar.style.display = 'flex';

      try {
        const siteRes = await fetch('/api/v1/site');
        if (siteRes.ok) {
          const dbData = await siteRes.json();
          window.authorData = deepMerge(window.authorData, dbData);
        }
      } catch (e) {
        console.warn("Could not sync live DB site data", e);
      }

      renderAdminDashboard();
    } else {
      sessionStorage.removeItem('admin_session');
      if (adminDOM.topBar) adminDOM.topBar.style.display = 'none';
      renderPasscodeGate();
    }
  } catch (e) {
    console.warn("Auth check unreachable, falling back to passcode gate", e);
    renderPasscodeGate();
  }
}

function renderPasscodeGate() {
  adminDOM.slot.innerHTML = `
    <div class="admin-gate-page" style="padding: 2rem 0;">
      <div class="lockbox-diary">
        <h2>Owner Ledger</h2>
        <p>This private studio is locked. Please enter your email and password to access your archive.</p>
        <form class="lockbox-form" id="admin-login-form">
          <div class="lockbox-input-group" style="margin-bottom: 0.8rem;">
            <input type="email" class="lockbox-input" id="admin-email-field" placeholder="Admin Email" value="admin@dessyackerman.com" required autocomplete="username" />
          </div>
          <div class="lockbox-input-group">
            <input type="password" class="lockbox-input" id="admin-passcode-field" placeholder="Password (default: dessy123)" required autocomplete="current-password" />
          </div>
          <button type="submit" class="lockbox-btn-unlock">Unlock Ledger 🗝️</button>
          <div class="lockbox-error-msg" id="admin-login-error">Incorrect credentials. Please try again.</div>
        </form>
        <div style="margin-top: 1.5rem; text-align: center;">
          <a href="index.html" style="color: var(--color-ink-light); text-decoration: none; font-size: 0.95rem;">← Return to main website</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('admin-login-form');
  const emailField = document.getElementById('admin-email-field');
  const passcodeField = document.getElementById('admin-passcode-field');
  const errorMsg = document.getElementById('admin-login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailField.value.trim();
    const password = passcodeField.value.trim();

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        currentCsrfToken = data.csrfToken || '';
        sessionStorage.setItem('admin_session', 'true');
        errorMsg.style.display = 'none';
        if (adminDOM.topBar) adminDOM.topBar.style.display = 'flex';
        renderAdminDashboard();
      } else {
        errorMsg.textContent = data.message || 'Incorrect credentials.';
        errorMsg.style.display = 'block';
        passcodeField.value = '';
        passcodeField.focus();
      }
    } catch (err) {
      errorMsg.textContent = 'Server communication error.';
      errorMsg.style.display = 'block';
    }
  });
}

// --- Admin Dashboard Master View ---
function renderAdminDashboard() {
  adminDOM.slot.innerHTML = `
    <div class="admin-page" style="padding: 0;">
      <div class="admin-page-header" style="margin-bottom: 1.5rem;">
        <div>
          <h2>Owner Ledger Studio</h2>
          <span style="font-size: 0.95rem; color: var(--color-ink-light); font-style: italic;">Customize and edit every page, note, quote, and element on your site.</span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav aria-label="Admin Navigation">
        <ul class="admin-tabs-list">
          <li><button class="admin-tab-btn active" data-admin-tab="admin-home">🏠 Home & Desk Decor</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-about">👤 About Page</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-books">📚 Bookshelf & Volumes</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-desk">✍️ Writing Desk</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-quotes">📜 Quote Cards</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-mascot">🐱 Mascot & Audio</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-store">🛍️ Store & Boutique</button></li>
          <li><button class="admin-tab-btn" data-admin-tab="admin-export">💾 Export & Security</button></li>
        </ul>
      </nav>

      <!-- Tab Content Panes -->
      <div class="admin-content-section active" id="admin-home" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-about" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-books" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-desk" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-quotes" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-mascot" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-store" role="tabpanel"></div>
      <div class="admin-content-section" id="admin-export" role="tabpanel"></div>
    </div>
  `;

  // Bind Header Lock button
  if (adminDOM.headerLockBtn) {
    adminDOM.headerLockBtn.onclick = async () => {
      try {
        await apiFetch('/api/v1/auth/logout', { method: 'POST' });
      } catch (e) {}
      sessionStorage.removeItem('admin_session');
      checkAuth();
    };
  }

  // Bind Admin Tab switching
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  const sections = document.querySelectorAll('.admin-content-section');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-admin-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const targetSec = document.getElementById(targetId);
      if (targetSec) targetSec.classList.add('active');

      renderAdminTabContent(targetId);
    });
  });

  // Initial Render of default tab
  renderAdminTabContent('admin-home');
}

function renderAdminTabContent(tabId) {
  switch (tabId) {
    case 'admin-home':
      renderAdminHomeTab();
      break;
    case 'admin-about':
      renderAdminAboutTab();
      break;
    case 'admin-books':
      renderAdminBooksTab();
      break;
    case 'admin-desk':
      renderAdminDeskTab();
      break;
    case 'admin-quotes':
      renderAdminQuotesTab();
      break;
    case 'admin-mascot':
      renderAdminMascotTab();
      break;
    case 'admin-store':
      renderAdminStoreTab();
      break;
    case 'admin-export':
      renderAdminExportTab();
      break;
  }
}

// ==========================================================================
// TAB 1: HOME & DESK DECOR EDITOR
// ==========================================================================
function renderAdminHomeTab() {
  const container = document.getElementById('admin-home');
  const data = window.authorData;
  const site = data.siteConfig || {};
  const home = data.homeData || {};
  const books = data.booksData || [];

  const booksOptions = `<option value="">-- No Featured Book --</option>` + books.map(b => 
    `<option value="${escapeHtml(b.id)}" ${home.featuredBookId === b.id ? 'selected' : ''}>${escapeHtml(b.title)}</option>`
  ).join('');

  const socialLinksHTML = (site.socialLinks || []).map((link, idx) => `
    <div class="admin-item-row" style="margin-bottom: 0.6rem;">
      <div class="admin-item-title-col">
        <strong>${escapeHtml(link.icon || '📌')} ${escapeHtml(link.name)}</strong>
        <span style="font-size: 0.85rem; word-break: break-all;">${escapeHtml(link.url)}</span>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-action-btn-sm" onclick="window.toggleAdminSocial(${idx})">${link.active !== false ? '✅ Active' : '⏸️ Hidden'}</button>
        <button type="button" class="admin-action-btn-sm danger" onclick="window.deleteAdminSocial(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="admin-editor-card">
      <h3>🏠 Home Page Content & Hero Section</h3>
      <form id="admin-home-hero-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="site-browser-title">Browser Tab Title</label>
            <input type="text" id="site-browser-title" class="admin-form-input" value="${escapeHtml(site.siteTitle || '')}" required />
          </div>
          <div class="admin-form-group">
            <label for="home-welcome-greeting">Hero Greeting / Note</label>
            <input type="text" id="home-welcome-greeting" class="admin-form-input" value="${escapeHtml(home.welcomeGreeting || 'Hello dear reader,')}" required />
          </div>
        </div>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="home-hero-title">Hero Main Heading</label>
            <input type="text" id="home-hero-title" class="admin-form-input" value="${escapeHtml(home.heroTitle || "Welcome to Dessy's Archive")}" required />
          </div>
          <div class="admin-form-group">
            <label for="home-featured-book-select">Featured Book on Homepage</label>
            <select id="home-featured-book-select" class="admin-form-select">
              ${booksOptions}
            </select>
          </div>
        </div>

        <div class="admin-form-group">
          <label for="home-hero-tagline">Hero Tagline / Subtitle</label>
          <input type="text" id="home-hero-tagline" class="admin-form-input" value="${escapeHtml(home.heroTagline || '')}" required />
        </div>

        <hr class="admin-section-divider" />
        <h4 class="admin-section-title">📖 "About the Author" Card on Homepage</h4>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="home-about-title">Card Heading</label>
            <input type="text" id="home-about-title" class="admin-form-input" value="${escapeHtml(home.aboutCardTitle || 'About the Author')}" required />
          </div>
          <div class="admin-form-group">
            <label for="home-about-quote">Handwritten Highlight Quote</label>
            <input type="text" id="home-about-quote" class="admin-form-input" value="${escapeHtml(home.aboutCardQuote || 'Stories are houses built out of whispers.')}" required />
          </div>
        </div>

        <div class="admin-form-group">
          <label for="home-about-summary">Introduction Paragraph</label>
          <textarea id="home-about-summary" class="admin-form-textarea" required>${escapeHtml(home.aboutCardSummary || '')}</textarea>
        </div>

        <div class="admin-form-group">
          <label for="home-about-closing">Closing Callout Paragraph</label>
          <textarea id="home-about-closing" class="admin-form-textarea" required>${escapeHtml(home.aboutCardClosing || '')}</textarea>
        </div>

        <hr class="admin-section-divider" />
        <h4 class="admin-section-title">📌 Ongoing Writing Banner on Homepage</h4>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="home-banner-prefix">Banner Prefix Label</label>
            <input type="text" id="home-banner-prefix" class="admin-form-input" value="${escapeHtml(home.bannerTitlePrefix || 'Currently Drafting:')}" required />
          </div>
          <div class="admin-form-group">
            <label for="home-banner-btn-text">Banner CTA Button Text</label>
            <input type="text" id="home-banner-btn-text" class="admin-form-input" value="${escapeHtml(home.bannerButtonText || 'Visit Writing Desk →')}" required />
          </div>
        </div>

        <button type="submit" class="admin-btn admin-btn-primary" style="margin-top: 1rem;">Save Home Page Settings ✨</button>
      </form>
    </div>

    <!-- Desk Surface Decorations -->
    <div class="admin-editor-card">
      <h3>🕯️ Desk Decor & Ambient Items</h3>
      <form id="admin-desk-decor-form">
        <div class="admin-form-group">
          <label for="desk-sticky-note-edit">Pinned Desk Sticky Note</label>
          <input type="text" id="desk-sticky-note-edit" class="admin-form-input" value="${escapeHtml(site.deskStickyNote || 'Remember: The magic is in the rewriting.')}" required />
          <span class="admin-form-hint">The yellow handwritten note pinned on the wooden desk background.</span>
        </div>

        <div class="admin-form-group">
          <label for="music-box-label-edit">Music Box Label</label>
          <input type="text" id="music-box-label-edit" class="admin-form-input" value="${escapeHtml(site.musicBoxLabel || 'Cozy Music Box')}" required />
        </div>

        <button type="submit" class="admin-btn admin-btn-primary">Update Desk Decor ✨</button>
      </form>
    </div>

    <!-- Footer Social Links Manager -->
    <div class="admin-editor-card">
      <h3>📮 Footer Social Stamps</h3>
      <div id="social-links-list" style="margin-bottom: 1.5rem;">
        ${socialLinksHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No social links configured.</p>'}
      </div>

      <form id="admin-add-social-form" style="background: #fff; padding: 1.2rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(139,115,85,0.2);">
        <h4 style="margin-bottom: 0.8rem;">+ Add New Social Stamp</h4>
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="new-social-name">Platform Name</label>
            <input type="text" id="new-social-name" class="admin-form-input" placeholder="e.g. Goodreads, Spotify, Substack" required />
          </div>
          <div class="admin-form-group">
            <label for="new-social-icon">Emoji / Icon</label>
            <input type="text" id="new-social-icon" class="admin-form-input" placeholder="e.g. 📚, 🎵, ✍️, 📷" value="📌" required />
          </div>
        </div>
        <div class="admin-form-group">
          <label for="new-social-url">Profile / Page URL</label>
          <input type="url" id="new-social-url" class="admin-form-input" placeholder="https://..." required />
        </div>
        <button type="submit" class="admin-btn admin-btn-secondary">+ Add Social Link</button>
      </form>
    </div>
  `;

  // Bind Home Hero Form Submit
  document.getElementById('admin-home-hero-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const siteTitle = document.getElementById('site-browser-title').value.trim();
    const welcomeGreeting = document.getElementById('home-welcome-greeting').value.trim();
    const heroTitle = document.getElementById('home-hero-title').value.trim();
    const rawFeaturedBookId = document.getElementById('home-featured-book-select').value;
    const featuredBookId = rawFeaturedBookId ? rawFeaturedBookId : null;
    const heroTagline = document.getElementById('home-hero-tagline').value.trim();
    const aboutCardTitle = document.getElementById('home-about-title').value.trim();
    const aboutCardQuote = document.getElementById('home-about-quote').value.trim();
    const aboutCardSummary = document.getElementById('home-about-summary').value.trim();
    const aboutCardClosing = document.getElementById('home-about-closing').value.trim();
    const bannerTitlePrefix = document.getElementById('home-banner-prefix').value.trim();
    const bannerButtonText = document.getElementById('home-banner-btn-text').value.trim();

    try {
      await apiFetch('/api/v1/admin/settings', { method: 'PATCH', body: { siteTitle } });
      await apiFetch('/api/v1/admin/home', {
        method: 'PATCH',
        body: {
          welcomeGreeting, heroTitle, heroTagline, aboutCardTitle,
          aboutCardQuote, aboutCardSummary, aboutCardClosing,
          featuredBookId, bannerTitlePrefix, bannerButtonText
        }
      });
      const res = await fetch('/api/v1/site');
      if (res.ok) window.authorData = await res.json();
      showAdminToast("Home Page settings saved to Database! ✨");
    } catch (err) {
      showAdminToast("Error saving Home settings: " + err.message, "❌");
    }
  });

  // Bind Desk Decor Form Submit
  document.getElementById('admin-desk-decor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const deskStickyNote = document.getElementById('desk-sticky-note-edit').value.trim();
    const musicBoxLabel = document.getElementById('music-box-label-edit').value.trim();

    try {
      await apiFetch('/api/v1/admin/settings', {
        method: 'PATCH',
        body: { deskStickyNote, musicBoxLabel }
      });
      const res = await fetch('/api/v1/site');
      if (res.ok) window.authorData = await res.json();
      showAdminToast("Desk decorations updated in Database! ✨");
    } catch (err) {
      showAdminToast("Error updating desk decor: " + err.message, "❌");
    }
  });

  // Bind Add Social Link
  document.getElementById('admin-add-social-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('new-social-name').value.trim();
    const icon = document.getElementById('new-social-icon').value.trim() || '📌';
    const url = document.getElementById('new-social-url').value.trim();

    try {
      await apiFetch('/api/v1/admin/social-links', {
        method: 'POST',
        body: { name, icon, url }
      });
      const res = await fetch('/api/v1/site');
      if (res.ok) window.authorData = await res.json();
      showAdminToast(`Added ${name} social stamp to Database!`);
      renderAdminHomeTab();
    } catch (err) {
      showAdminToast("Error adding social link: " + err.message, "❌");
    }
  });
}

window.toggleAdminSocial = async function(idx) {
  const link = window.authorData.siteConfig.socialLinks[idx];
  if (link && link.id) {
    try {
      await apiFetch(`/api/v1/admin/social-links/${link.id}/toggle`, { method: 'PATCH' });
      const res = await fetch('/api/v1/site');
      if (res.ok) window.authorData = await res.json();
      renderAdminHomeTab();
    } catch (err) {
      showAdminToast("Error toggling social link: " + err.message, "❌");
    }
  }
};

window.deleteAdminSocial = async function(idx) {
  const link = window.authorData.siteConfig.socialLinks[idx];
  if (link && link.id && confirm("Are you sure you want to remove this social link stamp?")) {
    try {
      await apiFetch(`/api/v1/admin/social-links/${link.id}`, { method: 'DELETE' });
      const res = await fetch('/api/v1/site');
      if (res.ok) window.authorData = await res.json();
      renderAdminHomeTab();
    } catch (err) {
      showAdminToast("Error deleting social link: " + err.message, "❌");
    }
  }
};

// ==========================================================================
// TAB 2: ABOUT PAGE EDITOR
// ==========================================================================
function renderAdminAboutTab() {
  const container = document.getElementById('admin-about');
  const about = window.authorData.aboutData || {};
  const anonymity = about.anonymityDetails || {};

  const tropesListHTML = (about.favoriteTropes || []).map((t, idx) => `
    <div class="admin-item-row" style="margin-bottom: 0.6rem;">
      <div class="admin-item-title-col">
        <strong>${escapeHtml(t.name)}</strong>
        <span>${escapeHtml(t.description || '')}</span>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-action-btn-sm danger" onclick="window.deleteAdminTrope(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  const genresTagsHTML = (about.favoriteGenres || []).map((g, idx) => `
    <span class="admin-tag-item">
      ${escapeHtml(g)}
      <button type="button" class="admin-tag-remove" onclick="window.deleteAdminGenre(${idx})">✕</button>
    </span>
  `).join('');

  const hobbiesTagsHTML = (about.hobbies || []).map((h, idx) => `
    <span class="admin-tag-item">
      ${escapeHtml(h)}
      <button type="button" class="admin-tag-remove" onclick="window.deleteAdminHobby(${idx})">✕</button>
    </span>
  `).join('');

  const factsListHTML = (about.funFacts || []).map((fact, idx) => `
    <div class="admin-item-row" style="margin-bottom: 0.6rem;">
      <div class="admin-item-title-col">
        <span style="color: var(--color-ink); font-style: normal;">${escapeHtml(fact)}</span>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-action-btn-sm danger" onclick="window.deleteAdminFact(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- Bio Narrative & Anonymity logs -->
    <div class="admin-editor-card">
      <h3>👤 Author Story & Anonymity Logs</h3>
      <form id="admin-about-main-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="about-page-title">Page Heading</label>
            <input type="text" id="about-page-title" class="admin-form-input" value="${escapeHtml(about.pageTitle || 'About Dessy')}" required />
          </div>
          <div class="admin-form-group">
            <label for="about-page-subtitle">Page Tagline / Subtitle</label>
            <input type="text" id="about-page-subtitle" class="admin-form-input" value="${escapeHtml(about.pageSubtitle || '')}" required />
          </div>
        </div>

        <div class="admin-form-group">
          <label for="about-why-i-write">"Why I Write" Narrative Essay</label>
          <textarea id="about-why-i-write" class="admin-form-textarea" style="min-height: 150px;" required>${escapeHtml(about.whyIWrite || '')}</textarea>
        </div>

        <hr class="admin-section-divider" />
        <h4 class="admin-section-title">☕ The Small Details (Anonymity Logs)</h4>

        <div class="admin-form-group">
          <label for="anon-location">Writing Retreat / Location</label>
          <input type="text" id="anon-location" class="admin-form-input" value="${escapeHtml(anonymity.location || '')}" required />
        </div>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="anon-companion">Writing Companion</label>
            <input type="text" id="anon-companion" class="admin-form-input" value="${escapeHtml(anonymity.companion || '')}" required />
          </div>
          <div class="admin-form-group">
            <label for="anon-beverage">Preferred Brew / Beverage</label>
            <input type="text" id="anon-beverage" class="admin-form-input" value="${escapeHtml(anonymity.beverage || '')}" required />
          </div>
        </div>

        <button type="submit" class="admin-btn admin-btn-primary" style="margin-top: 1rem;">Save About Story Details ✨</button>
      </form>
    </div>

    <!-- Favorite Tropes Manager -->
    <div class="admin-editor-card">
      <h3>✨ Favorite Tropes (with Hover Descriptions)</h3>
      <div id="tropes-list" style="margin-bottom: 1.5rem;">
        ${tropesListHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No tropes cataloged yet.</p>'}
      </div>

      <form id="admin-add-trope-form" style="background: #fff; padding: 1.2rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(139,115,85,0.2);">
        <h4 style="margin-bottom: 0.8rem;">+ Add New Trope</h4>
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="new-trope-name">Trope Name</label>
            <input type="text" id="new-trope-name" class="admin-form-input" placeholder="e.g. Grumpy x Sunshine" required />
          </div>
          <div class="admin-form-group">
            <label for="new-trope-desc">Hover Tooltip Description</label>
            <input type="text" id="new-trope-desc" class="admin-form-input" placeholder="e.g. A dark cloud falling for a warm sunbeam." required />
          </div>
        </div>
        <button type="submit" class="admin-btn admin-btn-secondary">+ Add Trope</button>
      </form>
    </div>

    <!-- Favorite Genres & Hobbies (Quick Tags) -->
    <div class="admin-form-grid-2">
      <!-- Genres -->
      <div class="admin-editor-card">
        <h3>📚 Favorite Genres</h3>
        <div class="admin-tag-cloud" style="margin-bottom: 1.2rem;">
          ${genresTagsHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No genres added.</p>'}
        </div>
        <form id="admin-add-genre-form" style="display: flex; gap: 0.5rem;">
          <input type="text" id="new-genre-input" class="admin-form-input" placeholder="e.g. Dark Romance" required />
          <button type="submit" class="admin-btn admin-btn-secondary" style="white-space: nowrap;">+ Add</button>
        </form>
      </div>

      <!-- Hobbies -->
      <div class="admin-editor-card">
        <h3>🎨 Hobbies & Musings</h3>
        <div class="admin-tag-cloud" style="margin-bottom: 1.2rem;">
          ${hobbiesTagsHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No hobbies added.</p>'}
        </div>
        <form id="admin-add-hobby-form" style="display: flex; gap: 0.5rem;">
          <input type="text" id="new-hobby-input" class="admin-form-input" placeholder="e.g. Play the violin" required />
          <button type="submit" class="admin-btn admin-btn-secondary" style="white-space: nowrap;">+ Add</button>
        </form>
      </div>
    </div>

    <!-- Fun Facts Corkboard Manager -->
    <div class="admin-editor-card">
      <h3>📌 Ink-Stained Fun Facts</h3>
      <div id="facts-list" style="margin-bottom: 1.5rem;">
        ${factsListHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No fun facts posted yet.</p>'}
      </div>

      <form id="admin-add-fact-form" style="background: #fff; padding: 1.2rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(139,115,85,0.2);">
        <h4 style="margin-bottom: 0.8rem;">+ Pin New Fun Fact</h4>
        <div class="admin-form-group">
          <label for="new-fact-text">Fun Fact Card Text</label>
          <textarea id="new-fact-text" class="admin-form-textarea" style="min-height: 80px;" placeholder="Share a quirky writing habit, coffee fact, or character story..." required></textarea>
        </div>
        <button type="submit" class="admin-btn admin-btn-secondary">+ Pin Fun Fact</button>
      </form>
    </div>
  `;

  // Bind Main Form Submit
  document.getElementById('admin-about-main-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.authorData.aboutData) window.authorData.aboutData = {};
    const ab = window.authorData.aboutData;
    ab.pageTitle = document.getElementById('about-page-title').value.trim();
    ab.pageSubtitle = document.getElementById('about-page-subtitle').value.trim();
    ab.whyIWrite = document.getElementById('about-why-i-write').value.trim();

    if (!ab.anonymityDetails) ab.anonymityDetails = {};
    ab.anonymityDetails.location = document.getElementById('anon-location').value.trim();
    ab.anonymityDetails.companion = document.getElementById('anon-companion').value.trim();
    ab.anonymityDetails.beverage = document.getElementById('anon-beverage').value.trim();

    saveLocalData();
    showAdminToast("About Page details saved!");
  });

  // Bind Add Trope
  document.getElementById('admin-add-trope-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-trope-name').value.trim();
    const description = document.getElementById('new-trope-desc').value.trim();
    if (!window.authorData.aboutData.favoriteTropes) window.authorData.aboutData.favoriteTropes = [];
    window.authorData.aboutData.favoriteTropes.push({ name, description });

    saveLocalData();
    showAdminToast(`Added trope "${name}"!`);
    renderAdminAboutTab();
  });

  // Bind Add Genre
  document.getElementById('admin-add-genre-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('new-genre-input').value.trim();
    if (!window.authorData.aboutData.favoriteGenres) window.authorData.aboutData.favoriteGenres = [];
    window.authorData.aboutData.favoriteGenres.push(val);

    saveLocalData();
    showAdminToast(`Added genre "${val}"!`);
    renderAdminAboutTab();
  });

  // Bind Add Hobby
  document.getElementById('admin-add-hobby-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('new-hobby-input').value.trim();
    if (!window.authorData.aboutData.hobbies) window.authorData.aboutData.hobbies = [];
    window.authorData.aboutData.hobbies.push(val);

    saveLocalData();
    showAdminToast(`Added hobby "${val}"!`);
    renderAdminAboutTab();
  });

  // Bind Add Fun Fact
  document.getElementById('admin-add-fact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('new-fact-text').value.trim();
    if (!window.authorData.aboutData.funFacts) window.authorData.aboutData.funFacts = [];
    window.authorData.aboutData.funFacts.push(val);

    saveLocalData();
    showAdminToast("Pinned new fun fact!");
    renderAdminAboutTab();
  });
}

window.deleteAdminTrope = function(idx) {
  window.authorData.aboutData.favoriteTropes.splice(idx, 1);
  saveLocalData();
  renderAdminAboutTab();
};

window.deleteAdminGenre = function(idx) {
  window.authorData.aboutData.favoriteGenres.splice(idx, 1);
  saveLocalData();
  renderAdminAboutTab();
};

window.deleteAdminHobby = function(idx) {
  window.authorData.aboutData.hobbies.splice(idx, 1);
  saveLocalData();
  renderAdminAboutTab();
};

window.deleteAdminFact = function(idx) {
  window.authorData.aboutData.funFacts.splice(idx, 1);
  saveLocalData();
  renderAdminAboutTab();
};

// ==========================================================================
// TAB 3: BOOKSHELF & VOLUMES TAB
// ==========================================================================
let editingBookId = null;

function renderAdminBooksTab() {
  const container = document.getElementById('admin-books');
  const booksConfig = window.authorData.bookshelfConfig || {};
  const books = window.authorData.booksData || [];

  const listHTML = books.map(book => `
    <div class="admin-item-row">
      <div class="admin-item-left">
        ${book.coverImage ? 
          `<img src="${escapeHtml(book.coverImage)}" class="admin-item-thumb" alt="${escapeHtml(book.title)}" />` :
          `<div style="width: 40px; height: 52px; background-color: ${book.coverColor || '#aa7f66'}; border-radius: 3px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.1rem; margin-right: 0.8rem; border:1px solid rgba(0,0,0,0.2);">📖</div>`
        }
        <div class="admin-item-title-col">
          <strong>${escapeHtml(book.title)}</strong>
          <span>${escapeHtml(book.genre || '')} — "${escapeHtml(book.tagline || '')}"</span>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-action-btn-sm" onclick="openBookModal('${escapeHtml(book.id)}')">👁️ Preview Modal</button>
        <button type="button" class="admin-action-btn-sm" onclick="window.editAdminBook('${escapeHtml(book.id)}')">Edit</button>
        <button type="button" class="admin-action-btn-sm danger" onclick="window.deleteAdminBook('${escapeHtml(book.id)}')">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- Header configuration -->
    <div class="admin-editor-card">
      <h3>📚 Bookshelf Page Header</h3>
      <form id="bookshelf-header-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="bookshelf-title">Section Heading</label>
            <input type="text" id="bookshelf-title" class="admin-form-input" value="${escapeHtml(booksConfig.pageTitle || 'The Bookshelf')}" required />
          </div>
          <div class="admin-form-group">
            <label for="bookshelf-sub">Section Subtitle / Description</label>
            <input type="text" id="bookshelf-sub" class="admin-form-input" value="${escapeHtml(booksConfig.pageSubtitle || '')}" required />
          </div>
        </div>
        <button type="submit" class="admin-btn admin-btn-secondary">Update Bookshelf Header</button>
      </form>
    </div>

    <!-- Book Editor Card (Hidden by default) -->
    <div class="admin-editor-card" id="book-editor-card" style="display: none;">
      <h3 id="book-editor-title">Write New Book Record</h3>
      <form id="book-editor-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="book-title">Book Title</label>
            <input type="text" id="book-title" class="admin-form-input" placeholder="e.g. Our Hundred Days" required />
          </div>
          <div class="admin-form-group">
            <label for="book-genre">Genre</label>
            <input type="text" id="book-genre" class="admin-form-input" placeholder="e.g. Cozy Fantasy / Romance" required />
          </div>
        </div>

        <div class="admin-form-group">
          <label for="book-tagline">Tagline</label>
          <input type="text" id="book-tagline" class="admin-form-input" placeholder="e.g. A story about healing, small steps, and the days that shape our forever." required />
        </div>

        <div class="admin-form-group">
          <label for="book-synopsis">Full Book Synopsis</label>
          <textarea id="book-synopsis" class="admin-form-textarea" style="min-height: 120px;" required></textarea>
        </div>

        <div class="admin-form-group">
          <label for="book-tropes">Tropes (comma-separated)</label>
          <input type="text" id="book-tropes" class="admin-form-input" placeholder="Found Family, Grumpy x Sunshine, Slow Burn" required />
        </div>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="book-cover-color">Cover Base Color</label>
            <div class="admin-color-picker-row">
              <input type="color" id="book-color-picker" class="admin-color-input" value="#aa7f66" />
              <input type="text" id="book-cover-color" class="admin-form-input" value="#aa7f66" style="flex:1;" required />
            </div>
          </div>
          <div class="admin-form-group">
            <label for="book-cover-doodle">Cover Doodle Icon</label>
            <select id="book-cover-doodle" class="admin-form-select">
              <option value="quill">✒️ Quill</option>
              <option value="key">🗝️ Key</option>
              <option value="star">⭐ Star</option>
              <option value="candle">🕯️ Candle</option>
              <option value="moon">🌙 Crescent Moon</option>
              <option value="potion">🧪 Potion</option>
              <option value="dagger">🗡️ Dagger</option>
              <option value="heart">💖 Heart</option>
              <option value="book">📖 Book</option>
              <option value="leaf">🌿 Leaf</option>
            </select>
          </div>
        </div>

        <div class="admin-form-group">
          <label for="book-cover-image">Custom Cover Image URL or File Path (Optional)</label>
          <input type="text" id="book-cover-image" class="admin-form-input" placeholder="e.g. assets/our-hundred-days.jpg" />
          <span class="admin-form-hint">Leave blank to use the cozy 3D leather spine + gold foil icon cover!</span>
        </div>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="book-pinterest">Pinterest Moodboard Link</label>
            <input type="url" id="book-pinterest" class="admin-form-input" placeholder="https://pinterest.com/..." />
          </div>
          <div class="admin-form-group">
            <label for="book-art-placeholder">Character Art Studio Note</label>
            <input type="text" id="book-art-placeholder" class="admin-form-input" placeholder="e.g. A cozy ink-wash sketch of the bookstore..." />
          </div>
        </div>

        <div class="admin-form-group">
          <label for="book-notes">Author Notes / Letter from Desk</label>
          <textarea id="book-notes" class="admin-form-textarea" placeholder="Personal story of how you wrote this book..." required></textarea>
        </div>

        <!-- Dynamic Character Dossier Sub-form -->
        <hr class="admin-section-divider" />
        <div class="admin-form-group">
          <label style="font-size: 1.15rem; font-family: var(--font-heading);">
            👥 Character Dossier Profiles
          </label>
          <div id="character-subform-list" style="margin-top: 1rem;"></div>
          <button type="button" class="admin-btn admin-btn-secondary" id="book-add-char-btn" style="align-self: flex-start; padding: 0.4rem 1rem; font-size: 0.9rem;">
            + Add Character Profile
          </button>
        </div>

        <!-- Dynamic Soundtrack Playlist Sub-form -->
        <hr class="admin-section-divider" />
        <div class="admin-form-group">
          <label style="font-size: 1.15rem; font-family: var(--font-heading);">
            🎵 Soundtrack Playlist Tracks
          </label>
          <div id="playlist-subform-list" style="margin-top: 1rem;"></div>
          <button type="button" class="admin-btn admin-btn-secondary" id="book-add-track-btn" style="align-self: flex-start; padding: 0.4rem 1rem; font-size: 0.9rem;">
            + Add Track
          </button>
        </div>

        <!-- Dynamic Purchase Links Sub-form -->
        <hr class="admin-section-divider" />
        <div class="admin-form-group">
          <label style="font-size: 1.15rem; font-family: var(--font-heading);">
            🛒 Purchase & Retail Links
          </label>
          <div id="links-subform-list" style="margin-top: 1rem;"></div>
          <button type="button" class="admin-btn admin-btn-secondary" id="book-add-link-btn" style="align-self: flex-start; padding: 0.4rem 1rem; font-size: 0.9rem;">
            + Add Purchase Store
          </button>
        </div>

        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Book Record ✨</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="book-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Books List -->
    <div class="admin-items-list" id="book-list-container">
      <h3>Cataloged Books & Novels</h3>
      ${listHTML ? listHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No books inside the ledger yet.</p>'}
      <button class="admin-btn admin-btn-primary" id="book-add-new-btn" style="margin-top: 1.5rem; align-self: flex-start;">
        + Write New Book Record
      </button>
    </div>
  `;

  const picker = document.getElementById('book-color-picker');
  const colorText = document.getElementById('book-cover-color');
  if (picker && colorText) {
    picker.addEventListener('input', () => { colorText.value = picker.value; });
    colorText.addEventListener('input', () => { picker.value = colorText.value; });
  }

  document.getElementById('bookshelf-header-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.authorData.bookshelfConfig) window.authorData.bookshelfConfig = {};
    window.authorData.bookshelfConfig.pageTitle = document.getElementById('bookshelf-title').value.trim();
    window.authorData.bookshelfConfig.pageSubtitle = document.getElementById('bookshelf-sub').value.trim();
    saveLocalData();
    showAdminToast("Bookshelf header updated!");
  });

  document.getElementById('book-add-new-btn').addEventListener('click', () => {
    openBookEditor();
  });

  document.getElementById('book-cancel-btn').addEventListener('click', () => {
    closeBookEditor();
  });

  document.getElementById('book-add-char-btn').addEventListener('click', () => {
    addCharacterRow();
  });

  document.getElementById('book-add-track-btn').addEventListener('click', () => {
    addTrackRow();
  });

  document.getElementById('book-add-link-btn').addEventListener('click', () => {
    addPurchaseLinkRow();
  });

  document.getElementById('book-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveBookForm();
  });
}

function openBookEditor(bookId = null) {
  editingBookId = bookId;
  const editorCard = document.getElementById('book-editor-card');
  const listContainer = document.getElementById('book-list-container');
  const title = document.getElementById('book-editor-title');
  const form = document.getElementById('book-editor-form');

  form.reset();
  document.getElementById('character-subform-list').innerHTML = '';
  document.getElementById('playlist-subform-list').innerHTML = '';
  document.getElementById('links-subform-list').innerHTML = '';

  if (bookId) {
    title.textContent = "Edit Book Record";
    const book = window.authorData.booksData.find(b => b.id === bookId);
    if (book) {
      document.getElementById('book-title').value = book.title || '';
      document.getElementById('book-genre').value = book.genre || '';
      document.getElementById('book-tagline').value = book.tagline || '';
      document.getElementById('book-synopsis').value = book.synopsis || '';
      document.getElementById('book-tropes').value = (book.tropes || []).join(', ');
      document.getElementById('book-cover-color').value = book.coverColor || '#aa7f66';
      document.getElementById('book-color-picker').value = book.coverColor || '#aa7f66';
      document.getElementById('book-cover-doodle').value = book.coverDoodle || 'quill';
      document.getElementById('book-cover-image').value = book.coverImage || '';
      document.getElementById('book-pinterest').value = book.pinterestMoodboard || '';
      document.getElementById('book-art-placeholder').value = book.characterArtPlaceholder || '';
      document.getElementById('book-notes').value = book.authorNotes || '';

      if (book.characters) {
        book.characters.forEach(char => addCharacterRow(char.name, char.role, char.desc));
      }
      if (book.playlist) {
        book.playlist.forEach(track => addTrackRow(track.title, track.artist));
      }
      if (book.purchaseLinks) {
        book.purchaseLinks.forEach(link => addPurchaseLinkRow(link.store, link.url, link.disabled));
      }
    }
  } else {
    title.textContent = "Write New Book Record";
    addCharacterRow("Main Character", "Protagonist", "A dreamer seeking magic...");
    addTrackRow("Main Theme", "Acoustic Melody");
    addPurchaseLinkRow("Bookshop.org", "https://bookshop.org", false);
  }

  editorCard.style.display = 'block';
  listContainer.style.display = 'none';
  editorCard.scrollIntoView({ behavior: 'smooth' });
}

function closeBookEditor() {
  editingBookId = null;
  document.getElementById('book-editor-card').style.display = 'none';
  document.getElementById('book-list-container').style.display = 'block';
}

function addCharacterRow(name = '', role = '', desc = '') {
  const container = document.getElementById('character-subform-list');
  const div = document.createElement('div');
  div.className = 'admin-subform-item character-row';
  div.innerHTML = `
    <button type="button" class="admin-subform-remove-btn" onclick="this.parentElement.remove()">✕ Remove</button>
    <div class="admin-form-grid-2">
      <div class="admin-form-group">
        <label>Character Name</label>
        <input type="text" class="admin-form-input char-name" value="${escapeHtml(name)}" required />
      </div>
      <div class="admin-form-group">
        <label>Role</label>
        <input type="text" class="admin-form-input char-role" placeholder="e.g. The Dreamer & Bookseller" value="${escapeHtml(role)}" required />
      </div>
    </div>
    <div class="admin-form-group" style="margin-bottom: 0;">
      <label>Personality & Description</label>
      <input type="text" class="admin-form-input char-desc" value="${escapeHtml(desc)}" required />
    </div>
  `;
  container.appendChild(div);
}

function addTrackRow(title = '', artist = '') {
  const container = document.getElementById('playlist-subform-list');
  const div = document.createElement('div');
  div.className = 'admin-subform-item playlist-row';
  div.innerHTML = `
    <button type="button" class="admin-subform-remove-btn" onclick="this.parentElement.remove()">✕ Remove</button>
    <div class="admin-form-grid-2" style="margin-bottom: 0;">
      <div class="admin-form-group">
        <label>Track Title</label>
        <input type="text" class="admin-form-input track-title-input" value="${escapeHtml(title)}" required />
      </div>
      <div class="admin-form-group">
        <label>Artist / Ensemble</label>
        <input type="text" class="admin-form-input track-artist-input" value="${escapeHtml(artist)}" required />
      </div>
    </div>
  `;
  container.appendChild(div);
}

function addPurchaseLinkRow(store = '', url = '', disabled = false) {
  const container = document.getElementById('links-subform-list');
  const div = document.createElement('div');
  div.className = 'admin-subform-item link-row';
  div.innerHTML = `
    <button type="button" class="admin-subform-remove-btn" onclick="this.parentElement.remove()">✕ Remove</button>
    <div class="admin-form-grid-2">
      <div class="admin-form-group">
        <label>Store Name</label>
        <input type="text" class="admin-form-input store-name-input" value="${escapeHtml(store)}" placeholder="e.g. IndieBound, Amazon" required />
      </div>
      <div class="admin-form-group">
        <label>URL</label>
        <input type="text" class="admin-form-input store-url-input" value="${escapeHtml(url)}" placeholder="https://..." required />
      </div>
    </div>
    <div style="display:flex; align-items:center; gap: 0.5rem;">
      <input type="checkbox" class="store-disabled-input" id="chk-${Math.random()}" ${disabled ? 'checked' : ''} />
      <label style="font-size: 0.9rem; font-weight: normal; cursor: pointer;">Mark as "Coming Soon" (Disabled button)</label>
    </div>
  `;
  container.appendChild(div);
}

function saveBookForm() {
  const title = document.getElementById('book-title').value.trim();
  const id = editingBookId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const genre = document.getElementById('book-genre').value.trim();
  const tagline = document.getElementById('book-tagline').value.trim();
  const synopsis = document.getElementById('book-synopsis').value.trim();
  const tropes = document.getElementById('book-tropes').value.split(',').map(t => t.trim()).filter(t => t.length > 0);
  const coverColor = document.getElementById('book-cover-color').value.trim() || '#aa7f66';
  const coverDoodle = document.getElementById('book-cover-doodle').value;
  const coverImage = document.getElementById('book-cover-image').value.trim() || null;
  const pinterestMoodboard = document.getElementById('book-pinterest').value.trim();
  const characterArtPlaceholder = document.getElementById('book-art-placeholder').value.trim() || "Character Art Portrait";
  const authorNotes = document.getElementById('book-notes').value.trim();

  const charRows = document.querySelectorAll('.character-row');
  const characters = Array.from(charRows).map(row => ({
    name: row.querySelector('.char-name').value.trim(),
    role: row.querySelector('.char-role').value.trim(),
    desc: row.querySelector('.char-desc').value.trim()
  }));

  const playlistRows = document.querySelectorAll('.playlist-row');
  const playlist = Array.from(playlistRows).map(row => ({
    title: row.querySelector('.track-title-input').value.trim(),
    artist: row.querySelector('.track-artist-input').value.trim()
  }));

  const linkRows = document.querySelectorAll('.link-row');
  const purchaseLinks = Array.from(linkRows).map(row => ({
    store: row.querySelector('.store-name-input').value.trim(),
    url: row.querySelector('.store-url-input').value.trim(),
    disabled: row.querySelector('.store-disabled-input').checked
  }));

  const bookData = {
    id,
    title,
    coverImage,
    genre,
    tagline,
    synopsis,
    tropes,
    characters,
    characterArtPlaceholder,
    pinterestMoodboard,
    playlist,
    purchaseLinks,
    authorNotes,
    coverColor,
    coverDoodle
  };

  if (!window.authorData.booksData) window.authorData.booksData = [];

  if (editingBookId) {
    const idx = window.authorData.booksData.findIndex(b => b.id === editingBookId);
    if (idx !== -1) {
      window.authorData.booksData[idx] = bookData;
    }
  } else {
    window.authorData.booksData.push(bookData);
  }

  saveLocalData();
  showAdminToast(`Book "${title}" saved successfully!`);
  closeBookEditor();
  renderAdminBooksTab();
}

window.editAdminBook = function (bookId) {
  openBookEditor(bookId);
};

window.deleteAdminBook = function (bookId) {
  if (confirm("Are you sure you want to delete this book record? This will also remove character files and playlists.")) {
    window.authorData.booksData = window.authorData.booksData.filter(b => b.id !== bookId);
    saveLocalData();
    showAdminToast("Book deleted from ledger.");
    renderAdminBooksTab();
  }
};

// ==========================================================================
// TAB 4: WRITING DESK EDITOR
// ==========================================================================
let editingUpdateIdx = null;
let editingSnippetIdx = null;
let editingProjectIdx = null;
let editingSneakIdx = null;

function renderAdminDeskTab() {
  const container = document.getElementById('admin-desk');
  const desk = window.authorData.deskData || {};
  const projects = desk.projects || [];

  const projectsListHTML = projects.map((p, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-title-col">
        <strong>${escapeHtml(p.title)} <span class="admin-badge ${idx === 0 ? 'admin-badge-active' : 'admin-badge-draft'}">${idx === 0 ? 'Primary Active WIP' : 'WIP'}</span></strong>
        <span>Status: ${escapeHtml(p.status)} (${p.progress || 0}% complete) — ${escapeHtml(p.wordCount || '')}</span>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-action-btn-sm" onclick="window.editAdminProject(${idx})">Edit</button>
        ${idx > 0 ? `<button type="button" class="admin-action-btn-sm" onclick="window.setAdminPrimaryProject(${idx})">Set Primary</button>` : ''}
        <button type="button" class="admin-action-btn-sm danger" onclick="window.deleteAdminProject(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  const updatesHTML = (desk.updates || []).map((upd, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-title-col">
        <strong>${escapeHtml(upd.date)}</strong>
        <span>${escapeHtml(upd.text.substring(0, 80))}...</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-action-btn-sm" onclick="window.editAdminUpdate(${idx})">Edit</button>
        <button class="admin-action-btn-sm danger" onclick="window.deleteAdminUpdate(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  const snippetsHTML = (desk.snippets || []).map((snip, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-title-col">
        <strong>${escapeHtml(snip.source)}</strong>
        <span>${escapeHtml(snip.text.substring(0, 80))}...</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-action-btn-sm" onclick="window.editAdminSnippet(${idx})">Edit</button>
        <button class="admin-action-btn-sm danger" onclick="window.deleteAdminSnippet(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  const sneakHTML = (desk.sneakPeeks || []).map((sp, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-title-col">
        <strong>${escapeHtml(sp.title)}</strong>
        <span>${escapeHtml(sp.desc)}</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-action-btn-sm" onclick="window.editAdminSneak(${idx})">Edit</button>
        <button class="admin-action-btn-sm danger" onclick="window.deleteAdminSneak(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="admin-editor-card">
      <h3>✍️ Writing Desk Headings</h3>
      <form id="desk-headings-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="desk-head-title">Page Heading</label>
            <input type="text" id="desk-head-title" class="admin-form-input" value="${escapeHtml(desk.pageTitle || 'Writing Desk')}" required />
          </div>
          <div class="admin-form-group">
            <label for="desk-head-wip">WIP Card Title</label>
            <input type="text" id="desk-head-wip" class="admin-form-input" value="${escapeHtml(desk.projectsTitle || 'Current Work-in-Progress')}" required />
          </div>
        </div>
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="desk-head-snippets">Snippets Section Title</label>
            <input type="text" id="desk-head-snippets" class="admin-form-input" value="${escapeHtml(desk.snippetsTitle || 'Manuscript Snippets & Scraps')}" required />
          </div>
          <div class="admin-form-group">
            <label for="desk-head-logs">Logs Section Title</label>
            <input type="text" id="desk-head-logs" class="admin-form-input" value="${escapeHtml(desk.logsTitle || 'Logs from the Desk')}" required />
          </div>
        </div>
        <button type="submit" class="admin-btn admin-btn-secondary">Save Desk Headings</button>
      </form>
    </div>

    <!-- Active Projects & WIPs -->
    <div class="admin-editor-card" id="project-editor-card" style="display: none;">
      <h3 id="project-editor-title">Add Work-in-Progress Project</h3>
      <form id="project-editor-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="proj-title">Manuscript Title</label>
            <input type="text" id="proj-title" class="admin-form-input" placeholder="e.g. Kindred" required />
          </div>
          <div class="admin-form-group">
            <label for="proj-status">Status Description</label>
            <input type="text" id="proj-status" class="admin-form-input" placeholder="e.g. Drafting Chapter 14" required />
          </div>
        </div>

        <div class="admin-form-group">
          <label for="proj-progress">Drafting Progress (%)</label>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <input type="range" id="proj-progress" min="0" max="100" class="admin-form-input" style="flex: 1; padding: 0;" value="50" />
            <span id="proj-progress-num" style="font-weight: bold; width: 45px; text-align: right;">50%</span>
          </div>
        </div>

        <div class="admin-form-group">
          <label for="proj-words">Word Count Metric</label>
          <input type="text" id="proj-words" class="admin-form-input" placeholder="e.g. 58,240 / 85,000 words" required />
        </div>

        <div class="admin-form-group">
          <label for="proj-synopsis">Synopsis / Concept Sneak Peek</label>
          <textarea id="proj-synopsis" class="admin-form-textarea" required></textarea>
        </div>

        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Project</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="window.closeProjectEditor()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="admin-items-list" id="project-list-container">
      <h3>Works-in-Progress (WIP Projects)</h3>
      ${projectsListHTML ? projectsListHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No WIP projects cataloged.</p>'}
      <button class="admin-btn admin-btn-primary" onclick="window.openProjectEditor()" style="margin-top: 1.5rem; align-self: flex-start;">
        + Add New WIP Project
      </button>
    </div>

    <!-- Timeline Log Updates -->
    <div class="admin-editor-card" id="update-editor-card" style="display: none; margin-top: 2rem;">
      <h3 id="update-editor-title">Add Desk Log</h3>
      <form id="update-editor-form">
        <div class="admin-form-group">
          <label for="upd-date">Log Date</label>
          <input type="text" id="upd-date" class="admin-form-input" placeholder="e.g. June 24, 2026" required />
        </div>
        <div class="admin-form-group">
          <label for="upd-text">Log Entry Description</label>
          <textarea id="upd-text" class="admin-form-textarea" required></textarea>
        </div>
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Entry</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="window.closeUpdateEditor()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="admin-items-list" id="update-list-container" style="margin-top: 2rem;">
      <h3>Desk Timeline Logs</h3>
      ${updatesHTML ? updatesHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No logs posted yet.</p>'}
      <button class="admin-btn admin-btn-primary" onclick="window.openUpdateEditor()" style="margin-top: 1.5rem; align-self: flex-start;">
        + Post New Log Entry
      </button>
    </div>

    <!-- Manuscript Snippets -->
    <div class="admin-editor-card" id="snippet-editor-card" style="display: none; margin-top: 2rem;">
      <h3 id="snippet-editor-title">Add Snippet / Scene</h3>
      <form id="snippet-editor-form">
        <div class="admin-form-group">
          <label for="snip-source">Source Book/Scene</label>
          <input type="text" id="snip-source" class="admin-form-input" placeholder="e.g. Kindred, Chapter 4 or Deleted Scene: Our Hundred Days" required />
        </div>
        <div class="admin-form-group">
          <label for="snip-text">Excerpt Text</label>
          <textarea id="snip-text" class="admin-form-textarea" style="min-height: 140px;" required></textarea>
        </div>
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Excerpt</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="window.closeSnippetEditor()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="admin-items-list" id="snippet-list-container" style="margin-top: 2rem;">
      <h3>Manuscript Snippets & Typewriter Scraps</h3>
      ${snippetsHTML ? snippetsHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No excerpts posted yet.</p>'}
      <button class="admin-btn admin-btn-primary" onclick="window.openSnippetEditor()" style="margin-top: 1.5rem; align-self: flex-start;">
        + Pin New Excerpt
      </button>
    </div>

    <!-- Sneak Peeks & Extras -->
    <div class="admin-editor-card" id="sneak-editor-card" style="display: none; margin-top: 2rem;">
      <h3 id="sneak-editor-title">Add Sneak Peek / Extra</h3>
      <form id="sneak-editor-form">
        <div class="admin-form-group">
          <label for="sneak-title">Extra Title</label>
          <input type="text" id="sneak-title" class="admin-form-input" placeholder="e.g. Map of Aveline's Whispering Forest" required />
        </div>
        <div class="admin-form-group">
          <label for="sneak-desc">Description</label>
          <textarea id="sneak-desc" class="admin-form-textarea" placeholder="e.g. A sneak peek at the hand-inked cartography..." required></textarea>
        </div>
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Sneak Peek</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="window.closeSneakEditor()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="admin-items-list" id="sneak-list-container" style="margin-top: 2rem;">
      <h3>Sneak Peeks & Extras</h3>
      ${sneakHTML ? sneakHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No sneak peeks added.</p>'}
      <button class="admin-btn admin-btn-primary" onclick="window.openSneakEditor()" style="margin-top: 1.5rem; align-self: flex-start;">
        + Add Sneak Peek
      </button>
    </div>
  `;

  document.getElementById('desk-headings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.authorData.deskData) window.authorData.deskData = {};
    const d = window.authorData.deskData;
    d.pageTitle = document.getElementById('desk-head-title').value.trim();
    d.projectsTitle = document.getElementById('desk-head-wip').value.trim();
    d.snippetsTitle = document.getElementById('desk-head-snippets').value.trim();
    d.logsTitle = document.getElementById('desk-head-logs').value.trim();

    saveLocalData();
    showAdminToast("Desk headings saved!");
  });

  const slider = document.getElementById('proj-progress');
  const sliderLabel = document.getElementById('proj-progress-num');
  if (slider) {
    slider.addEventListener('input', () => {
      sliderLabel.textContent = `${slider.value}%`;
    });
  }

  document.getElementById('project-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('proj-title').value.trim();
    const status = document.getElementById('proj-status').value.trim();
    const progress = parseInt(slider.value);
    const wordCount = document.getElementById('proj-words').value.trim();
    const synopsis = document.getElementById('proj-synopsis').value.trim();
    const projData = { title, status, progress, wordCount, synopsis };

    if (!window.authorData.deskData.projects) window.authorData.deskData.projects = [];

    if (editingProjectIdx !== null) {
      window.authorData.deskData.projects[editingProjectIdx] = projData;
    } else {
      window.authorData.deskData.projects.push(projData);
    }

    saveLocalData();
    showAdminToast("WIP Project saved!");
    window.closeProjectEditor();
    renderAdminDeskTab();
  });

  document.getElementById('update-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveUpdateForm();
  });

  document.getElementById('snippet-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveSnippetForm();
  });

  document.getElementById('sneak-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('sneak-title').value.trim();
    const desc = document.getElementById('sneak-desc').value.trim();
    const sneakData = { title, desc };

    if (!window.authorData.deskData.sneakPeeks) window.authorData.deskData.sneakPeeks = [];

    if (editingSneakIdx !== null) {
      window.authorData.deskData.sneakPeeks[editingSneakIdx] = sneakData;
    } else {
      window.authorData.deskData.sneakPeeks.push(sneakData);
    }

    saveLocalData();
    showAdminToast("Sneak Peek saved!");
    window.closeSneakEditor();
    renderAdminDeskTab();
  });
}

window.openProjectEditor = function(idx = null) {
  editingProjectIdx = idx;
  const card = document.getElementById('project-editor-card');
  const list = document.getElementById('project-list-container');
  const form = document.getElementById('project-editor-form');
  const title = document.getElementById('project-editor-title');

  form.reset();
  if (idx !== null) {
    title.textContent = "Edit WIP Project";
    const p = window.authorData.deskData.projects[idx];
    document.getElementById('proj-title').value = p.title || '';
    document.getElementById('proj-status').value = p.status || '';
    document.getElementById('proj-progress').value = p.progress || 0;
    document.getElementById('proj-progress-num').textContent = `${p.progress || 0}%`;
    document.getElementById('proj-words').value = p.wordCount || '';
    document.getElementById('proj-synopsis').value = p.synopsis || '';
  } else {
    title.textContent = "Add Work-in-Progress Project";
    document.getElementById('proj-progress-num').textContent = "50%";
  }

  card.style.display = 'block';
  list.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
};

window.closeProjectEditor = function() {
  editingProjectIdx = null;
  document.getElementById('project-editor-card').style.display = 'none';
  document.getElementById('project-list-container').style.display = 'block';
};

window.setAdminPrimaryProject = function(idx) {
  const item = window.authorData.deskData.projects.splice(idx, 1)[0];
  window.authorData.deskData.projects.unshift(item);
  saveLocalData();
  showAdminToast(`Set "${item.title}" as primary WIP!`);
  renderAdminDeskTab();
};

window.deleteAdminProject = function(idx) {
  if (confirm("Are you sure you want to delete this WIP project?")) {
    window.authorData.deskData.projects.splice(idx, 1);
    saveLocalData();
    renderAdminDeskTab();
  }
};

window.openUpdateEditor = function (idx = null) {
  editingUpdateIdx = idx;
  const card = document.getElementById('update-editor-card');
  const list = document.getElementById('update-list-container');
  const title = document.getElementById('update-editor-title');
  const form = document.getElementById('update-editor-form');

  form.reset();
  if (idx !== null) {
    title.textContent = "Edit Log Entry";
    const entry = window.authorData.deskData.updates[idx];
    document.getElementById('upd-date').value = entry.date;
    document.getElementById('upd-text').value = entry.text;
  } else {
    title.textContent = "Post New Log Entry";
  }

  card.style.display = 'block';
  list.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
};

window.closeUpdateEditor = function () {
  editingUpdateIdx = null;
  document.getElementById('update-editor-card').style.display = 'none';
  document.getElementById('update-list-container').style.display = 'block';
};

function saveUpdateForm() {
  const date = document.getElementById('upd-date').value.trim();
  const text = document.getElementById('upd-text').value.trim();
  const entry = { date, text };

  if (editingUpdateIdx !== null) {
    window.authorData.deskData.updates[editingUpdateIdx] = entry;
  } else {
    window.authorData.deskData.updates.unshift(entry);
  }

  saveLocalData();
  showAdminToast("Timeline log posted!");
  window.closeUpdateEditor();
  renderAdminDeskTab();
}

window.deleteAdminUpdate = function (idx) {
  if (confirm("Are you sure you want to delete this log entry?")) {
    window.authorData.deskData.updates.splice(idx, 1);
    saveLocalData();
    renderAdminDeskTab();
  }
};

window.openSnippetEditor = function (idx = null) {
  editingSnippetIdx = idx;
  const card = document.getElementById('snippet-editor-card');
  const list = document.getElementById('snippet-list-container');
  const title = document.getElementById('snippet-editor-title');
  const form = document.getElementById('snippet-editor-form');

  form.reset();
  if (idx !== null) {
    title.textContent = "Edit Excerpt";
    const entry = window.authorData.deskData.snippets[idx];
    document.getElementById('snip-source').value = entry.source;
    document.getElementById('snip-text').value = entry.text;
  } else {
    title.textContent = "Pin New Excerpt";
  }

  card.style.display = 'block';
  list.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
};

window.closeSnippetEditor = function () {
  editingSnippetIdx = null;
  document.getElementById('snippet-editor-card').style.display = 'none';
  document.getElementById('snippet-list-container').style.display = 'block';
};

function saveSnippetForm() {
  const source = document.getElementById('snip-source').value.trim();
  const text = document.getElementById('snip-text').value.trim();
  const entry = { source, text };

  if (editingSnippetIdx !== null) {
    window.authorData.deskData.snippets[editingSnippetIdx] = entry;
  } else {
    window.authorData.deskData.snippets.push(entry);
  }

  saveLocalData();
  showAdminToast("Excerpt pinned successfully!");
  window.closeSnippetEditor();
  renderAdminDeskTab();
}

window.deleteAdminSnippet = function (idx) {
  if (confirm("Are you sure you want to delete this manuscript snippet?")) {
    window.authorData.deskData.snippets.splice(idx, 1);
    saveLocalData();
    renderAdminDeskTab();
  }
};

window.openSneakEditor = function(idx = null) {
  editingSneakIdx = idx;
  const card = document.getElementById('sneak-editor-card');
  const list = document.getElementById('sneak-list-container');
  const title = document.getElementById('sneak-editor-title');
  const form = document.getElementById('sneak-editor-form');

  form.reset();
  if (idx !== null) {
    title.textContent = "Edit Sneak Peek";
    const sp = window.authorData.deskData.sneakPeeks[idx];
    document.getElementById('sneak-title').value = sp.title || '';
    document.getElementById('sneak-desc').value = sp.desc || '';
  } else {
    title.textContent = "Add Sneak Peek";
  }

  card.style.display = 'block';
  list.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
};

window.closeSneakEditor = function() {
  editingSneakIdx = null;
  document.getElementById('sneak-editor-card').style.display = 'none';
  document.getElementById('sneak-list-container').style.display = 'block';
};

window.deleteAdminSneak = function(idx) {
  if (confirm("Are you sure you want to delete this sneak peek?")) {
    window.authorData.deskData.sneakPeeks.splice(idx, 1);
    saveLocalData();
    renderAdminDeskTab();
  }
};

// ==========================================================================
// TAB 5: QUOTE CARDS TAB
// ==========================================================================
let editingQuoteIdx = null;

function renderAdminQuotesTab() {
  const container = document.getElementById('admin-quotes');
  const quotes = (window.authorData.deskData && window.authorData.deskData.quotes) || [];

  const quotesHTML = quotes.map((q, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-title-col">
        <span style="color: var(--color-ink); font-style: normal;">${escapeHtml(q)}</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-action-btn-sm" onclick="window.editAdminQuote(${idx})">Edit</button>
        <button class="admin-action-btn-sm danger" onclick="window.deleteAdminQuote(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="admin-editor-card" id="quote-editor-card" style="display: none;">
      <h3 id="quote-editor-title">Add Quote Card</h3>
      <form id="quote-editor-form">
        <div class="admin-form-group">
          <label for="quote-text-field">Quote Card Content (with quote marks & attribution)</label>
          <textarea id="quote-text-field" class="admin-form-textarea" placeholder="e.g. &quot;Some stories don't want to be told; they want to be lived.&quot; — Our Hundred Days" required></textarea>
        </div>
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Quote Card</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="window.closeQuoteEditor()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="admin-items-list" id="quote-list-container">
      <h3>Desk Quote Cards</h3>
      <p style="font-size: 0.9rem; color: var(--color-ink-light); margin-bottom: 1.5rem; font-style: italic;">
        These quotes rotate in the interactive scrapbook slider on your public Writing Desk page.
      </p>
      ${quotesHTML ? quotesHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No quotes cataloged yet.</p>'}
      <button class="admin-btn admin-btn-primary" onclick="window.openQuoteEditor()" style="margin-top: 1.5rem; align-self: flex-start;">
        + Catalog New Quote Card
      </button>
    </div>
  `;

  document.getElementById('quote-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveQuoteForm();
  });
}

window.openQuoteEditor = function (idx = null) {
  editingQuoteIdx = idx;
  const card = document.getElementById('quote-editor-card');
  const list = document.getElementById('quote-list-container');
  const title = document.getElementById('quote-editor-title');
  const form = document.getElementById('quote-editor-form');

  form.reset();
  if (idx !== null) {
    title.textContent = "Edit Quote Card";
    document.getElementById('quote-text-field').value = window.authorData.deskData.quotes[idx];
  } else {
    title.textContent = "Catalog New Quote Card";
  }

  card.style.display = 'block';
  list.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
};

window.closeQuoteEditor = function () {
  editingQuoteIdx = null;
  document.getElementById('quote-editor-card').style.display = 'none';
  document.getElementById('quote-list-container').style.display = 'block';
};

function saveQuoteForm() {
  const val = document.getElementById('quote-text-field').value.trim();
  if (!window.authorData.deskData.quotes) window.authorData.deskData.quotes = [];

  if (editingQuoteIdx !== null) {
    window.authorData.deskData.quotes[editingQuoteIdx] = val;
  } else {
    window.authorData.deskData.quotes.push(val);
  }

  saveLocalData();
  showAdminToast("Quote card cataloged!");
  window.closeQuoteEditor();
  renderAdminQuotesTab();
}

window.deleteAdminQuote = function (idx) {
  if (confirm("Are you sure you want to delete this quote card?")) {
    window.authorData.deskData.quotes.splice(idx, 1);
    saveLocalData();
    renderAdminQuotesTab();
  }
};

// ==========================================================================
// TAB 6: MASCOT & AUDIO TAB
// ==========================================================================
function renderAdminMascotTab() {
  const container = document.getElementById('admin-mascot');
  const site = window.authorData.siteConfig || {};
  const mascot = site.mascot || {};
  const catQuotes = mascot.quotes || [];

  const quotesHTML = catQuotes.map((q, idx) => `
    <div class="admin-item-row" style="margin-bottom: 0.6rem;">
      <div class="admin-item-title-col">
        <span style="color: var(--color-ink); font-style: normal;">${escapeHtml(q)}</span>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-action-btn-sm" onclick="window.editAdminCatQuote(${idx})">Edit</button>
        <button type="button" class="admin-action-btn-sm danger" onclick="window.deleteAdminCatQuote(${idx})">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- Mascot Identity & Initial Speech -->
    <div class="admin-editor-card">
      <h3>🐱 Poe the Desk Cat Companion Settings</h3>
      <form id="mascot-settings-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="mascot-name-field">Mascot Companion Name</label>
            <input type="text" id="mascot-name-field" class="admin-form-input" value="${escapeHtml(mascot.name || 'Poe the Desk Cat')}" required />
          </div>
          <div class="admin-form-group">
            <label for="mascot-speech-field">Initial Speech Bubble Greeting</label>
            <input type="text" id="mascot-speech-field" class="admin-form-input" value="${escapeHtml(mascot.initialSpeech || 'Meow? (Click me!)')}" required />
          </div>
        </div>
        <button type="submit" class="admin-btn admin-btn-primary">Save Mascot Settings ✨</button>
      </form>
    </div>

    <!-- Cat Quotes / Dialogues Manager -->
    <div class="admin-editor-card">
      <h3>🐾 Cat Wisdoms & Random Dialogue Lines</h3>
      <p style="font-size: 0.9rem; color: var(--color-ink-light); margin-bottom: 1.5rem; font-style: italic;">
        Whenever readers click on Poe the cat in the footer, one of these cozy quotes will pop up in his speech bubble!
      </p>

      <div id="cat-quotes-list" style="margin-bottom: 1.5rem;">
        ${quotesHTML || '<p style="color:var(--color-ink-light); font-style:italic;">No dialogue quotes added.</p>'}
      </div>

      <form id="add-cat-quote-form" style="background: #fff; padding: 1.2rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(139,115,85,0.2);">
        <h4 style="margin-bottom: 0.8rem;">+ Add Dialogue Line</h4>
        <div class="admin-form-group">
          <input type="text" id="new-cat-quote-input" class="admin-form-input" placeholder="e.g. &quot;The first draft is just sand. You mold it into sandcastles later.&quot;" required />
        </div>
        <button type="submit" class="admin-btn admin-btn-secondary">+ Add Cat Dialogue</button>
      </form>
    </div>
  `;

  document.getElementById('mascot-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.authorData.siteConfig.mascot) window.authorData.siteConfig.mascot = {};
    window.authorData.siteConfig.mascot.name = document.getElementById('mascot-name-field').value.trim();
    window.authorData.siteConfig.mascot.initialSpeech = document.getElementById('mascot-speech-field').value.trim();

    saveLocalData();
    showAdminToast("Mascot companion settings saved!");
  });

  document.getElementById('add-cat-quote-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('new-cat-quote-input').value.trim();
    if (!window.authorData.siteConfig.mascot.quotes) window.authorData.siteConfig.mascot.quotes = [];
    window.authorData.siteConfig.mascot.quotes.push(val);

    saveLocalData();
    showAdminToast("Cat dialogue added!");
    renderAdminMascotTab();
  });
}

window.editAdminCatQuote = function(idx) {
  const current = window.authorData.siteConfig.mascot.quotes[idx];
  const updated = prompt("Edit Poe's dialogue line:", current);
  if (updated && updated.trim()) {
    window.authorData.siteConfig.mascot.quotes[idx] = updated.trim();
    saveLocalData();
    showAdminToast("Dialogue updated!");
    renderAdminMascotTab();
  }
};

window.deleteAdminCatQuote = function(idx) {
  if (confirm("Delete this dialogue line?")) {
    window.authorData.siteConfig.mascot.quotes.splice(idx, 1);
    saveLocalData();
    renderAdminMascotTab();
  }
};

// ==========================================================================
// TAB 7: STORE & BOUTIQUE CATALOG
// ==========================================================================
let editingStoreId = null;

function renderAdminStoreTab() {
  const container = document.getElementById('admin-store');
  const storeItems = window.authorData.storeData || [];

  const itemsHTML = storeItems.map(item => {
    let badgeClass = 'admin-badge-draft';
    if (item.status === 'active') badgeClass = 'admin-badge-active';
    else if (item.status === 'archived') badgeClass = 'admin-badge-archived';

    return `
      <div class="admin-item-row">
        <div class="admin-item-title-col">
          <strong>${escapeHtml(item.title)} <span class="admin-badge ${badgeClass}">${escapeHtml(item.status)}</span></strong>
          <span>Price: ${escapeHtml(item.price || 'N/A')} — ${escapeHtml(item.description || '')}</span>
        </div>
        <div class="admin-item-actions">
          <button class="admin-action-btn-sm" onclick="window.editAdminStoreItem('${escapeHtml(item.id)}')">Edit</button>
          <button class="admin-action-btn-sm danger" onclick="window.deleteAdminStoreItem('${escapeHtml(item.id)}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="admin-editor-card" id="store-editor-card" style="display: none;">
      <h3 id="store-editor-title">Add Store Item</h3>
      <form id="store-editor-form">
        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="store-title">Product Name</label>
            <input type="text" id="store-title" class="admin-form-input" placeholder="e.g. Signed Hardcover: Our Hundred Days" required />
          </div>
          <div class="admin-form-group">
            <label for="store-price">Price Display</label>
            <input type="text" id="store-price" class="admin-form-input" placeholder="e.g. $28.00" required />
          </div>
        </div>

        <div class="admin-form-group">
          <label for="store-desc">Description</label>
          <textarea id="store-desc" class="admin-form-textarea" placeholder="Include special details (wax seals, bookmarks, vinyl sticker specs)..." required></textarea>
        </div>

        <div class="admin-form-grid-2">
          <div class="admin-form-group">
            <label for="store-status">Publish Status</label>
            <select id="store-status" class="admin-form-select">
              <option value="coming-soon">Coming Soon</option>
              <option value="active">Active (Available)</option>
              <option value="archived">Archived (Hidden)</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label for="store-link">Buy / Checkout URL</label>
            <input type="text" id="store-link" class="admin-form-input" placeholder="https://store.dessyackerman.com/checkout/..." required />
          </div>
        </div>

        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Save Product</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="window.closeStoreEditor()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="admin-items-list" id="store-list-container">
      <h3>Boutique & Store Catalog</h3>
      <p style="font-size: 0.9rem; color: var(--color-ink-light); margin-bottom: 1.5rem; font-style: italic;">
        Manage your signed physical books, sticker packs, and merchandise.
      </p>
      ${itemsHTML ? itemsHTML : '<p style="color: var(--color-ink-light); font-style: italic;">No boutique products cataloged yet.</p>'}
      <button class="admin-btn admin-btn-primary" onclick="window.openStoreEditor()" style="margin-top: 1.5rem; align-self: flex-start;">
        + Catalog New Product
      </button>
    </div>
  `;

  document.getElementById('store-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveStoreForm();
  });
}

window.openStoreEditor = function (itemId = null) {
  editingStoreId = itemId;
  const card = document.getElementById('store-editor-card');
  const list = document.getElementById('store-list-container');
  const title = document.getElementById('store-editor-title');
  const form = document.getElementById('store-editor-form');

  form.reset();
  if (itemId) {
    title.textContent = "Edit Product Details";
    const item = window.authorData.storeData.find(i => i.id === itemId);
    if (item) {
      document.getElementById('store-title').value = item.title;
      document.getElementById('store-desc').value = item.description;
      document.getElementById('store-price').value = item.price;
      document.getElementById('store-status').value = item.status;
      document.getElementById('store-link').value = item.link;
    }
  } else {
    title.textContent = "Catalog New Product";
  }

  card.style.display = 'block';
  list.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
};

window.closeStoreEditor = function () {
  editingStoreId = null;
  document.getElementById('store-editor-card').style.display = 'none';
  document.getElementById('store-list-container').style.display = 'block';
};

function saveStoreForm() {
  const title = document.getElementById('store-title').value.trim();
  const id = editingStoreId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const description = document.getElementById('store-desc').value.trim();
  const price = document.getElementById('store-price').value.trim();
  const status = document.getElementById('store-status').value;
  const link = document.getElementById('store-link').value.trim();

  const itemData = { id, title, description, price, status, link };

  if (!window.authorData.storeData) window.authorData.storeData = [];

  if (editingStoreId) {
    const idx = window.authorData.storeData.findIndex(i => i.id === editingStoreId);
    if (idx !== -1) {
      window.authorData.storeData[idx] = itemData;
    }
  } else {
    window.authorData.storeData.push(itemData);
  }

  saveLocalData();
  showAdminToast(`Saved product "${title}"!`);
  window.closeStoreEditor();
  renderAdminStoreTab();
}

window.deleteAdminStoreItem = function (itemId) {
  if (confirm("Are you sure you want to delete this boutique product?")) {
    window.authorData.storeData = window.authorData.storeData.filter(i => i.id !== itemId);
    saveLocalData();
    renderAdminStoreTab();
  }
};

// ==========================================================================
// TAB 8: EXPORT, BACKUP & SECURITY
// ==========================================================================
function renderAdminExportTab() {
  const container = document.getElementById('admin-export');

  const codeContent = `// data.js - Contains all the content and configurations for Dessy Ackerman's website.

window.authorData = ${JSON.stringify(window.authorData, null, 2)};
`;

  container.innerHTML = `
    <div class="export-section">
      <div class="export-instruction-card">
        <h4>💾 Publishing Updates to All Readers Worldwide</h4>
        <p>Edits made in this Owner Ledger are instantly saved to your current browser's local memory.</p>
        <p>To publish these changes permanently to your live website on GitHub Pages or custom hosting:
          <ol style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.3rem;">
            <li>Click the <strong>💾 Download data.js File</strong> button below.</li>
            <li>Replace the old <code>data.js</code> file in your website folder with this downloaded file.</li>
            <li>Commit/push the new file to your repository host.</li>
          </ol>
        </p>
      </div>

      <!-- Security / Passcode form -->
      <div class="admin-editor-card">
        <h3>🔑 Change Owner Ledger Passcode</h3>
        <div class="admin-form-group">
          <label for="export-passcode-edit">Current or New Passcode</label>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <input type="text" id="export-passcode-edit" class="admin-form-input" style="max-width: 250px;" value="${(window.authorData.adminConfig && window.authorData.adminConfig.passcode) || 'dessy123'}" required />
            <button type="button" class="admin-btn admin-btn-primary" id="save-passcode-btn">Update Passcode ✨</button>
          </div>
        </div>
      </div>

      <!-- Import / Restore JSON -->
      <div class="admin-editor-card">
        <h3>📥 Import & Restore Ledger</h3>
        <p style="font-size: 0.92rem; color: var(--color-ink-faded); margin-bottom: 1rem;">
          Want to restore a previously downloaded <code>data.js</code> or JSON backup? Upload the file below or paste its content.
        </p>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
          <input type="file" id="import-file-input" accept=".js,.json" style="font-family: var(--font-serif);" />
          <button type="button" class="admin-btn admin-btn-secondary" id="import-file-btn">📥 Load File into Ledger</button>
        </div>
      </div>

      <!-- Raw JS Code block -->
      <div class="export-code-wrapper">
        <label style="font-weight: bold; margin-bottom: 0.5rem; display: block; font-family: var(--font-heading);">
          Raw data.js Source Code
        </label>
        <textarea class="export-code-textarea" id="export-code-block" readonly>${codeContent}</textarea>
      </div>

      <div class="export-action-btns">
        <button class="admin-btn admin-btn-primary" id="download-data-btn">💾 Download data.js File</button>
        <button class="admin-btn admin-btn-secondary" id="copy-code-btn">📋 Copy Ledger Code</button>
        <button class="admin-btn admin-btn-danger" id="reset-ledger-btn" style="margin-left: auto;">⚠️ Reset to Factory Defaults</button>
      </div>
    </div>
  `;

  document.getElementById('save-passcode-btn').addEventListener('click', () => {
    const newPass = document.getElementById('export-passcode-edit').value.trim();
    if (newPass.length < 4) {
      alert("Passcode must be at least 4 characters long!");
      return;
    }
    if (!window.authorData.adminConfig) window.authorData.adminConfig = {};
    window.authorData.adminConfig.passcode = newPass;
    saveLocalData();
    showAdminToast("Passcode updated successfully!");
    renderAdminExportTab();
  });

  document.getElementById('copy-code-btn').addEventListener('click', () => {
    const codeArea = document.getElementById('export-code-block');
    codeArea.select();
    navigator.clipboard.writeText(codeArea.value).then(() => {
      showAdminToast("Ledger code copied to clipboard! 📋");
    }).catch(() => {
      document.execCommand('copy');
      showAdminToast("Ledger code copied to clipboard! 📋");
    });
  });

  document.getElementById('download-data-btn').addEventListener('click', () => {
    const codeBlock = document.getElementById('export-code-block');
    const blob = new Blob([codeBlock.value], { type: "text/javascript;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAdminToast("Downloading data.js file! 💾");
  });

  document.getElementById('import-file-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('import-file-input');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Please choose a data.js or .json file first!");
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let content = e.target.result;
        if (content.includes('window.authorData =')) {
          content = content.replace(/^[^{]*/, '').replace(/;?\s*$/, '');
        }
        const parsed = JSON.parse(content);
        window.authorData = deepMerge(window.authorData, parsed);
        saveLocalData();
        showAdminToast("Ledger imported and restored successfully! ✨");
        setTimeout(() => renderAdminDashboard(), 500);
      } catch (err) {
        alert("Could not parse file. Please verify it is a valid data.js or JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('reset-ledger-btn').addEventListener('click', () => {
    if (confirm("WARNING: This will erase all custom edits you've made in your browser and restore the default data from the data.js file. Are you sure?")) {
      localStorage.removeItem('dessy_archive_data');
      sessionStorage.removeItem('admin_session');
      alert("Ledger database reset successfully! Reloading...");
      window.location.reload();
    }
  });
}

// --- Book Details Modal in Admin ---
function initModal() {
  if (!adminDOM.modalCloseBtn) return;

  adminDOM.modalCloseBtn.addEventListener('click', () => {
    closeBookModal();
  });

  adminDOM.modal.addEventListener('click', (e) => {
    if (e.target === adminDOM.modal) {
      closeBookModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminDOM.modal.classList.contains('active')) {
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

  adminDOM.modalContentSlot.innerHTML = `
    <div class="book-details-layout">
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
        
        <div class="scrap-paper-card" style="margin-bottom: 2.5rem; background-color: var(--color-rose-light); border-color: var(--color-rose); --rot: 0.5deg;">
          <h4 class="handwritten" style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--color-rose);">Character Art Studio</h4>
          <p style="font-size: 0.95rem; line-height: 1.4; color: var(--color-ink-faded);">
            [Placeholder for Sketch/Art: <em>"${escapeHtml(book.characterArtPlaceholder || 'Character Art Studio')}"</em>]
          </p>
        </div>

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

  adminDOM.modal.classList.add('active');
  adminDOM.modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeBookModal() {
  if (!adminDOM.modal) return;
  adminDOM.modal.classList.remove('active');
  adminDOM.modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
