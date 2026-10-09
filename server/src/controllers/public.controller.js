const prisma = require('../utils/prisma');

async function getFullSiteBundle(req, res, next) {
  try {
    const [
      siteSetting,
      socialLinks,
      homeSetting,
      aboutSetting,
      tropes,
      genres,
      hobbies,
      funFacts,
      bookshelfConfig,
      books,
      projects,
      deskLogs,
      snippets,
      deskQuotes,
      sneakPeeks,
      mascotConfig,
      mascotQuotes,
      storeProducts
    ] = await Promise.all([
      prisma.siteSetting.findFirst(),
      prisma.socialLink.findMany({ where: { active: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.homeSetting.findFirst({ include: { featuredBook: true } }),
      prisma.aboutSetting.findFirst(),
      prisma.trope.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.genre.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.hobby.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.funFact.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.bookshelfConfig.findFirst(),
      prisma.book.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          characters: { orderBy: { displayOrder: 'asc' } },
          playlist: { orderBy: { trackNumber: 'asc' } },
          purchaseLinks: { orderBy: { displayOrder: 'asc' } }
        }
      }),
      prisma.writingProject.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.deskLog.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.manuscriptSnippet.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.deskQuote.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.sneakPeek.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.mascotConfig.findFirst(),
      prisma.mascotQuote.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.storeProduct.findMany({ orderBy: { displayOrder: 'asc' } })
    ]);

    // Format authorData compatible output
    const siteConfig = {
      siteTitle: siteSetting ? siteSetting.siteTitle : "Dessy Ackerman | Storyteller & Dreamer",
      authorName: siteSetting ? siteSetting.authorName : "Dessy Ackerman",
      authorSubtitle: siteSetting ? siteSetting.authorSubtitle : "Storyteller & Dreamer",
      deskStickyNote: siteSetting ? siteSetting.deskStickyNote : "Remember: The magic is in the rewriting.",
      musicBoxLabel: siteSetting ? siteSetting.musicBoxLabel : "Cozy Music Box",
      socialLinks: socialLinks.map(l => ({
        id: l.id,
        name: l.name,
        icon: l.icon,
        url: l.url,
        active: l.active
      })),
      mascot: {
        name: mascotConfig ? mascotConfig.name : "Poe the Desk Cat",
        initialSpeech: mascotConfig ? mascotConfig.initialSpeech : "Meow? (Click me!)",
        quotes: mascotQuotes.map(q => q.text)
      }
    };

    const featuredBookSlug = homeSetting && homeSetting.featuredBook ? homeSetting.featuredBook.slug : (books[0] ? books[0].slug : "our-hundred-days");

    const homeData = {
      welcomeGreeting: homeSetting ? homeSetting.welcomeGreeting : "Hello dear reader,",
      heroTitle: homeSetting ? homeSetting.heroTitle : "Welcome to Dessy's Archive",
      heroTagline: homeSetting ? homeSetting.heroTagline : "Storyteller. Dreamer. Avid coffee lover.",
      aboutCardTitle: homeSetting ? homeSetting.aboutCardTitle : "About the Author",
      aboutCardQuote: homeSetting ? homeSetting.aboutCardQuote : "Stories are houses built out of whispers.",
      aboutCardSummary: homeSetting ? homeSetting.aboutCardSummary : "",
      aboutCardClosing: homeSetting ? homeSetting.aboutCardClosing : "",
      featuredBookId: featuredBookSlug,
      bannerTitlePrefix: homeSetting ? homeSetting.bannerTitlePrefix : "Currently Drafting:",
      bannerButtonText: homeSetting ? homeSetting.bannerButtonText : "Visit Writing Desk →"
    };

    const aboutData = {
      pageTitle: aboutSetting ? aboutSetting.pageTitle : "About Dessy",
      pageSubtitle: aboutSetting ? aboutSetting.pageSubtitle : "",
      tagline: aboutSetting ? aboutSetting.tagline : "",
      whyIWrite: aboutSetting ? aboutSetting.whyIWrite : "",
      favoriteTropes: tropes.map(t => ({ name: t.name, description: t.description })),
      favoriteGenres: genres.map(g => g.name),
      hobbies: hobbies.map(h => h.name),
      funFacts: funFacts.map(f => f.text),
      anonymityDetails: {
        location: aboutSetting ? aboutSetting.anonLocation : "",
        companion: aboutSetting ? aboutSetting.anonCompanion : "",
        beverage: aboutSetting ? aboutSetting.anonBeverage : ""
      }
    };

    const formattedBooks = books.map(b => ({
      id: b.slug,
      dbId: b.id,
      slug: b.slug,
      title: b.title,
      genre: b.genre,
      tagline: b.tagline,
      synopsis: b.synopsis,
      coverImage: b.coverImage,
      coverColor: b.coverColor,
      coverDoodle: b.coverDoodle,
      characterArtImage: b.characterArtImage,
      characterArtCaption: b.characterArtCaption,
      characterArtPlaceholder: b.characterArtPlaceholder,
      pinterestMoodboard: b.pinterestMoodboard,
      authorNotes: b.authorNotes,
      tropes: tropes.map(t => t.name), // or book specific if needed
      characters: b.characters.map(c => ({ name: c.name, role: c.role, desc: c.desc })),
      playlist: b.playlist.map(p => ({ title: p.title, artist: p.artist })),
      purchaseLinks: b.purchaseLinks.map(l => ({ store: l.store, url: l.url, disabled: l.disabled }))
    }));

    const deskData = {
      pageTitle: "Writing Desk",
      projectsTitle: "Current Work-in-Progress",
      snippetsTitle: "Manuscript Snippets & Scraps",
      logsTitle: "Logs from the Desk",
      sneakPeeksTitle: "Sneak Peeks & Extras",
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        progress: p.progress,
        wordCount: p.wordCount,
        synopsis: p.synopsis
      })),
      updates: deskLogs.map(l => ({ date: l.date, text: l.text })),
      snippets: snippets.map(s => ({ source: s.source, text: s.text })),
      quotes: deskQuotes.map(q => q.text),
      sneakPeeks: sneakPeeks.map(sp => ({ title: sp.title, desc: sp.desc }))
    };

    const formattedStore = storeProducts.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      status: p.status,
      link: p.link
    }));

    res.status(200).json({
      siteConfig,
      homeData,
      aboutData,
      bookshelfConfig: {
        pageTitle: bookshelfConfig ? bookshelfConfig.pageTitle : "The Bookshelf",
        pageSubtitle: bookshelfConfig ? bookshelfConfig.pageSubtitle : ""
      },
      booksData: formattedBooks,
      deskData,
      storeData: formattedStore
    });
  } catch (error) {
    next(error);
  }
}

async function getBooks(req, res, next) {
  try {
    const books = await prisma.book.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        characters: { orderBy: { displayOrder: 'asc' } },
        playlist: { orderBy: { trackNumber: 'asc' } },
        purchaseLinks: { orderBy: { displayOrder: 'asc' } }
      }
    });

    const formatted = books.map(b => ({
      id: b.slug,
      title: b.title,
      genre: b.genre,
      tagline: b.tagline,
      synopsis: b.synopsis,
      coverImage: b.coverImage,
      coverColor: b.coverColor,
      coverDoodle: b.coverDoodle,
      characterArtImage: b.characterArtImage,
      characterArtCaption: b.characterArtCaption,
      pinterestMoodboard: b.pinterestMoodboard,
      authorNotes: b.authorNotes,
      characters: b.characters.map(c => ({ name: c.name, role: c.role, desc: c.desc })),
      playlist: b.playlist.map(p => ({ title: p.title, artist: p.artist })),
      purchaseLinks: b.purchaseLinks.map(l => ({ store: l.store, url: l.url, disabled: l.disabled }))
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

async function getBookBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        characters: { orderBy: { displayOrder: 'asc' } },
        playlist: { orderBy: { trackNumber: 'asc' } },
        purchaseLinks: { orderBy: { displayOrder: 'asc' } }
      }
    });

    if (!book || !book.published) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: book.slug,
        title: book.title,
        genre: book.genre,
        tagline: book.tagline,
        synopsis: book.synopsis,
        coverImage: book.coverImage,
        coverColor: book.coverColor,
        coverDoodle: book.coverDoodle,
        characterArtImage: book.characterArtImage,
        characterArtCaption: book.characterArtCaption,
        pinterestMoodboard: book.pinterestMoodboard,
        authorNotes: book.authorNotes,
        characters: book.characters.map(c => ({ name: c.name, role: c.role, desc: c.desc })),
        playlist: book.playlist.map(p => ({ title: p.title, artist: p.artist })),
        purchaseLinks: book.purchaseLinks.map(l => ({ store: l.store, url: l.url, disabled: l.disabled }))
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getWritingProjects(req, res, next) {
  try {
    const projects = await prisma.writingProject.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
}

async function getQuotes(req, res, next) {
  try {
    const quotes = await prisma.deskQuote.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.status(200).json({ success: true, data: quotes.map(q => q.text) });
  } catch (error) {
    next(error);
  }
}

async function getMascot(req, res, next) {
  try {
    const mascotConfig = await prisma.mascotConfig.findFirst();
    const mascotQuotes = await prisma.mascotQuote.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.status(200).json({
      success: true,
      data: {
        name: mascotConfig ? mascotConfig.name : "Poe the Desk Cat",
        initialSpeech: mascotConfig ? mascotConfig.initialSpeech : "Meow? (Click me!)",
        quotes: mascotQuotes.map(q => q.text)
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await prisma.storeProduct.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFullSiteBundle,
  getBooks,
  getBookBySlug,
  getWritingProjects,
  getQuotes,
  getMascot,
  getProducts
};
