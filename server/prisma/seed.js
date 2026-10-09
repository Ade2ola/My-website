const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed and content migration...');

  // 1. Initial Admin User Setup
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@dessyackerman.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'dessy123';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });
  const passwordHash = await argon2.hash(adminPassword);
  if (!existingAdmin) {
    console.log(`🔐 Creating initial admin user (${adminEmail})...`);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash
      }
    });
    console.log('✅ Admin user created successfully.');
  } else {
    console.log(`🔑 Updating admin user password (${adminEmail})...`);
    await prisma.adminUser.update({
      where: { email: adminEmail },
      data: { passwordHash }
    });
    console.log('✅ Admin password updated.');
  }

  // 2. Load baseline data from data.js
  const dataJsPath = path.join(__dirname, '../../data.js');
  if (!fs.existsSync(dataJsPath)) {
    console.error('❌ data.js file not found at:', dataJsPath);
    return;
  }

  const rawContent = fs.readFileSync(dataJsPath, 'utf8');
  // Evaluate data.js in a isolated sandbox context to extract authorData
  const sandbox = { window: {} };
  const evalFunc = new Function('window', rawContent);
  evalFunc(sandbox.window);

  const data = sandbox.window.authorData;
  if (!data) {
    console.error('❌ Failed to parse window.authorData from data.js');
    return;
  }

  // 3. Site Settings
  const siteConfig = data.siteConfig || {};
  const existingSiteSetting = await prisma.siteSetting.findFirst();
  if (!existingSiteSetting) {
    console.log('📝 Migrating Site Settings...');
    await prisma.siteSetting.create({
      data: {
        siteTitle: siteConfig.siteTitle || 'Dessy Ackerman | Storyteller & Dreamer',
        authorName: siteConfig.authorName || 'Dessy Ackerman',
        authorSubtitle: siteConfig.authorSubtitle || 'Storyteller & Dreamer',
        deskStickyNote: siteConfig.deskStickyNote || 'Remember: The magic is in the rewriting.',
        musicBoxLabel: siteConfig.musicBoxLabel || 'Cozy Music Box'
      }
    });
  }

  // 4. Social Links
  const socialLinks = siteConfig.socialLinks || [];
  for (let i = 0; i < socialLinks.length; i++) {
    const link = socialLinks[i];
    const existing = await prisma.socialLink.findFirst({
      where: { name: link.name }
    });
    if (!existing) {
      await prisma.socialLink.create({
        data: {
          name: link.name,
          icon: link.icon || '📌',
          url: link.url,
          active: link.active !== false,
          displayOrder: i
        }
      });
    }
  }

  // 5. Books Migration
  const booksData = data.booksData || [];
  const bookIdMap = new Map();

  for (let i = 0; i < booksData.length; i++) {
    const b = booksData[i];
    let existingBook = await prisma.book.findUnique({
      where: { slug: b.id }
    });

    if (!existingBook) {
      console.log(`📚 Migrating book "${b.title}"...`);
      existingBook = await prisma.book.create({
        data: {
          slug: b.id,
          title: b.title,
          genre: b.genre || '',
          tagline: b.tagline || '',
          synopsis: b.synopsis || '',
          coverImage: b.coverImage || null,
          coverColor: b.coverColor || '#aa7f66',
          coverDoodle: b.coverDoodle || 'quill',
          characterArtImage: b.characterArtImage || null,
          characterArtCaption: b.characterArtCaption || null,
          characterArtPlaceholder: b.characterArtPlaceholder || null,
          pinterestMoodboard: b.pinterestMoodboard || null,
          authorNotes: b.authorNotes || '',
          published: true,
          displayOrder: i,
          characters: {
            create: (b.characters || []).map((c, idx) => ({
              name: c.name,
              role: c.role || '',
              desc: c.desc || '',
              displayOrder: idx
            }))
          },
          playlist: {
            create: (b.playlist || []).map((p, idx) => ({
              title: p.title,
              artist: p.artist || '',
              trackNumber: idx + 1
            }))
          },
          purchaseLinks: {
            create: (b.purchaseLinks || []).map((l, idx) => ({
              store: l.store,
              url: l.url || '#',
              disabled: Boolean(l.disabled),
              displayOrder: idx
            }))
          }
        }
      });
    }
    bookIdMap.set(b.id, existingBook.id);
  }

  // 6. Home Settings
  const homeData = data.homeData || {};
  const existingHomeSetting = await prisma.homeSetting.findFirst();
  if (!existingHomeSetting) {
    console.log('🏠 Migrating Home Settings...');
    const featuredDbId = homeData.featuredBookId ? bookIdMap.get(homeData.featuredBookId) || null : null;
    await prisma.homeSetting.create({
      data: {
        welcomeGreeting: homeData.welcomeGreeting || 'Hello dear reader,',
        heroTitle: homeData.heroTitle || "Welcome to Dessy's Archive",
        heroTagline: homeData.heroTagline || '',
        aboutCardTitle: homeData.aboutCardTitle || 'About the Author',
        aboutCardQuote: homeData.aboutCardQuote || 'Stories are houses built out of whispers.',
        aboutCardSummary: homeData.aboutCardSummary || '',
        aboutCardClosing: homeData.aboutCardClosing || '',
        featuredBookId: featuredDbId,
        bannerTitlePrefix: homeData.bannerTitlePrefix || 'Currently Drafting:',
        bannerButtonText: homeData.bannerButtonText || 'Visit Writing Desk →'
      }
    });
  }

  // 7. About Settings & Lists
  const aboutData = data.aboutData || {};
  const existingAboutSetting = await prisma.aboutSetting.findFirst();
  if (!existingAboutSetting) {
    console.log('👤 Migrating About Settings...');
    const anon = aboutData.anonymityDetails || {};
    await prisma.aboutSetting.create({
      data: {
        pageTitle: aboutData.pageTitle || 'About Dessy',
        pageSubtitle: aboutData.pageSubtitle || '',
        tagline: aboutData.tagline || '',
        whyIWrite: aboutData.whyIWrite || '',
        anonLocation: anon.location || '',
        anonCompanion: anon.companion || '',
        anonBeverage: anon.beverage || ''
      }
    });
  }

  // Favorite Tropes
  const tropes = aboutData.favoriteTropes || [];
  for (let i = 0; i < tropes.length; i++) {
    const t = tropes[i];
    const name = typeof t === 'string' ? t : t.name;
    const description = typeof t === 'string' ? '' : t.description;
    const existing = await prisma.trope.findFirst({ where: { name } });
    if (!existing) {
      await prisma.trope.create({
        data: { name, description, displayOrder: i }
      });
    }
  }

  // Favorite Genres
  const genres = aboutData.favoriteGenres || [];
  for (let i = 0; i < genres.length; i++) {
    const name = genres[i];
    const existing = await prisma.genre.findFirst({ where: { name } });
    if (!existing) {
      await prisma.genre.create({ data: { name, displayOrder: i } });
    }
  }

  // Hobbies
  const hobbies = aboutData.hobbies || [];
  for (let i = 0; i < hobbies.length; i++) {
    const name = hobbies[i];
    const existing = await prisma.hobby.findFirst({ where: { name } });
    if (!existing) {
      await prisma.hobby.create({ data: { name, displayOrder: i } });
    }
  }

  // Fun Facts
  const funFacts = aboutData.funFacts || [];
  for (let i = 0; i < funFacts.length; i++) {
    const text = funFacts[i];
    const existing = await prisma.funFact.findFirst({ where: { text } });
    if (!existing) {
      await prisma.funFact.create({ data: { text, displayOrder: i } });
    }
  }

  // 8. Bookshelf Config
  const bookshelfConfig = data.bookshelfConfig || {};
  const existingBookshelfConfig = await prisma.bookshelfConfig.findFirst();
  if (!existingBookshelfConfig) {
    await prisma.bookshelfConfig.create({
      data: {
        pageTitle: bookshelfConfig.pageTitle || 'The Bookshelf',
        pageSubtitle: bookshelfConfig.pageSubtitle || ''
      }
    });
  }

  // 9. Writing Desk (Projects, Logs, Snippets, Quotes, Sneak Peeks)
  const deskData = data.deskData || {};

  // Projects
  const projects = deskData.projects || [];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const existing = await prisma.writingProject.findFirst({ where: { title: p.title } });
    if (!existing) {
      await prisma.writingProject.create({
        data: {
          title: p.title,
          status: p.status || '',
          progress: typeof p.progress === 'number' ? p.progress : 0,
          wordCount: p.wordCount || '',
          synopsis: p.synopsis || '',
          isPrimary: i === 0,
          displayOrder: i
        }
      });
    }
  }

  // Desk Journal Logs
  const updates = deskData.updates || [];
  for (let i = 0; i < updates.length; i++) {
    const u = updates[i];
    const existing = await prisma.deskLog.findFirst({ where: { date: u.date, text: u.text } });
    if (!existing) {
      await prisma.deskLog.create({
        data: { date: u.date, text: u.text, displayOrder: i }
      });
    }
  }

  // Manuscript Snippets
  const snippets = deskData.snippets || [];
  for (let i = 0; i < snippets.length; i++) {
    const s = snippets[i];
    const existing = await prisma.manuscriptSnippet.findFirst({ where: { source: s.source, text: s.text } });
    if (!existing) {
      await prisma.manuscriptSnippet.create({
        data: { source: s.source, text: s.text, displayOrder: i }
      });
    }
  }

  // Desk Quotes
  const quotes = deskData.quotes || [];
  for (let i = 0; i < quotes.length; i++) {
    const text = quotes[i];
    const existing = await prisma.deskQuote.findFirst({ where: { text } });
    if (!existing) {
      await prisma.deskQuote.create({
        data: { text, displayOrder: i }
      });
    }
  }

  // Sneak Peeks
  const sneakPeeks = deskData.sneakPeeks || [];
  for (let i = 0; i < sneakPeeks.length; i++) {
    const sp = sneakPeeks[i];
    const existing = await prisma.sneakPeek.findFirst({ where: { title: sp.title } });
    if (!existing) {
      await prisma.sneakPeek.create({
        data: { title: sp.title, desc: sp.desc || '', displayOrder: i }
      });
    }
  }

  // 10. Mascot Config & Quotes
  const mascotData = (siteConfig && siteConfig.mascot) || {};
  const existingMascotConfig = await prisma.mascotConfig.findFirst();
  if (!existingMascotConfig) {
    await prisma.mascotConfig.create({
      data: {
        name: mascotData.name || 'Poe the Desk Cat',
        initialSpeech: mascotData.initialSpeech || 'Meow? (Click me!)'
      }
    });
  }

  const catQuotes = mascotData.quotes || [];
  for (let i = 0; i < catQuotes.length; i++) {
    const text = catQuotes[i];
    const existing = await prisma.mascotQuote.findFirst({ where: { text } });
    if (!existing) {
      await prisma.mascotQuote.create({
        data: { text, displayOrder: i }
      });
    }
  }

  // 11. Store Products
  const storeData = data.storeData || [];
  for (let i = 0; i < storeData.length; i++) {
    const sp = storeData[i];
    const existing = await prisma.storeProduct.findFirst({ where: { title: sp.title } });
    if (!existing) {
      await prisma.storeProduct.create({
        data: {
          title: sp.title,
          description: sp.description || '',
          price: sp.price || '$0.00',
          status: sp.status || 'coming-soon',
          link: sp.link || '#',
          displayOrder: i
        }
      });
    }
  }

  console.log('🎉 Database seeding and content migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
