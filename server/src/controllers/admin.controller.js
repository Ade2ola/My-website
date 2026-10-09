const path = require('path');
const fs = require('fs');
const prisma = require('../utils/prisma');
const {
  siteSettingsSchema,
  homeSettingsSchema,
  aboutSettingsSchema,
  bookSchema,
  writingProjectSchema,
  storeProductSchema
} = require('../validators/content.validator');

// Audit logger helper
async function logAudit(userId, action, entity, entityId, detailsObj) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId || null,
        details: detailsObj ? JSON.stringify(detailsObj) : null
      }
    });
  } catch (err) {
    console.error('Failed to log audit:', err);
  }
}

// 1. Site Settings
async function updateSiteSettings(req, res, next) {
  try {
    const parse = siteSettingsSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });

    let setting = await prisma.siteSetting.findFirst();
    if (setting) {
      setting = await prisma.siteSetting.update({
        where: { id: setting.id },
        data: parse.data
      });
    } else {
      setting = await prisma.siteSetting.create({ data: parse.data });
    }

    await logAudit(req.user.id, 'UPDATE_SITE_SETTINGS', 'SiteSetting', setting.id, parse.data);
    res.status(200).json({ success: true, message: 'Site settings updated', data: setting });
  } catch (err) { next(err); }
}

// 2. Social Links
async function addSocialLink(req, res, next) {
  try {
    const { name, icon, url } = req.body;
    if (!name || !url) return res.status(400).json({ success: false, message: 'Name and URL required' });

    const count = await prisma.socialLink.count();
    const link = await prisma.socialLink.create({
      data: { name, icon: icon || '📌', url, active: true, displayOrder: count }
    });

    await logAudit(req.user.id, 'ADD_SOCIAL_LINK', 'SocialLink', link.id, { name, url });
    res.status(201).json({ success: true, data: link });
  } catch (err) { next(err); }
}

async function toggleSocialLink(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Link not found' });

    const updated = await prisma.socialLink.update({
      where: { id },
      data: { active: !existing.active }
    });

    await logAudit(req.user.id, 'TOGGLE_SOCIAL_LINK', 'SocialLink', id, { active: updated.active });
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
}

async function deleteSocialLink(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.socialLink.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_SOCIAL_LINK', 'SocialLink', id);
    res.status(200).json({ success: true, message: 'Social link deleted' });
  } catch (err) { next(err); }
}

// 3. Home Settings
async function updateHomeSettings(req, res, next) {
  try {
    const parse = homeSettingsSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });

    const updateData = { ...parse.data };
    if (updateData.featuredBookId === '' || updateData.featuredBookId === 'none') {
      updateData.featuredBookId = null;
    }

    if (updateData.featuredBookId) {
      const bookExists = await prisma.book.findUnique({ where: { id: updateData.featuredBookId } });
      if (!bookExists) {
        updateData.featuredBookId = null;
      }
    }

    let setting = await prisma.homeSetting.findFirst();
    if (setting) {
      setting = await prisma.homeSetting.update({
        where: { id: setting.id },
        data: updateData
      });
    } else {
      setting = await prisma.homeSetting.create({ data: updateData });
    }

    await logAudit(req.user.id, 'UPDATE_HOME_SETTINGS', 'HomeSetting', setting.id, updateData);
    res.status(200).json({ success: true, message: 'Home settings updated', data: setting });
  } catch (err) { next(err); }
}

// 4. About Settings & Lists
async function updateAboutSettings(req, res, next) {
  try {
    const parse = aboutSettingsSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });

    let setting = await prisma.aboutSetting.findFirst();
    if (setting) {
      setting = await prisma.aboutSetting.update({
        where: { id: setting.id },
        data: parse.data
      });
    } else {
      setting = await prisma.aboutSetting.create({ data: parse.data });
    }

    await logAudit(req.user.id, 'UPDATE_ABOUT_SETTINGS', 'AboutSetting', setting.id, parse.data);
    res.status(200).json({ success: true, message: 'About settings updated', data: setting });
  } catch (err) { next(err); }
}

async function addTrope(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Trope name required' });
    const count = await prisma.trope.count();
    const trope = await prisma.trope.create({
      data: { name, description: description || '', displayOrder: count }
    });
    await logAudit(req.user.id, 'ADD_TROPE', 'Trope', trope.id, { name });
    res.status(201).json({ success: true, data: trope });
  } catch (err) { next(err); }
}

async function deleteTrope(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.trope.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_TROPE', 'Trope', id);
    res.status(200).json({ success: true, message: 'Trope deleted' });
  } catch (err) { next(err); }
}

async function addGenre(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Genre name required' });
    const count = await prisma.genre.count();
    const genre = await prisma.genre.create({ data: { name, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_GENRE', 'Genre', genre.id, { name });
    res.status(201).json({ success: true, data: genre });
  } catch (err) { next(err); }
}

async function deleteGenre(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.genre.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_GENRE', 'Genre', id);
    res.status(200).json({ success: true, message: 'Genre deleted' });
  } catch (err) { next(err); }
}

async function addHobby(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Hobby name required' });
    const count = await prisma.hobby.count();
    const hobby = await prisma.hobby.create({ data: { name, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_HOBBY', 'Hobby', hobby.id, { name });
    res.status(201).json({ success: true, data: hobby });
  } catch (err) { next(err); }
}

async function deleteHobby(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.hobby.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_HOBBY', 'Hobby', id);
    res.status(200).json({ success: true, message: 'Hobby deleted' });
  } catch (err) { next(err); }
}

async function addFunFact(req, res, next) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text required' });
    const count = await prisma.funFact.count();
    const fact = await prisma.funFact.create({ data: { text, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_FUN_FACT', 'FunFact', fact.id);
    res.status(201).json({ success: true, data: fact });
  } catch (err) { next(err); }
}

async function deleteFunFact(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.funFact.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_FUN_FACT', 'FunFact', id);
    res.status(200).json({ success: true, message: 'Fun fact deleted' });
  } catch (err) { next(err); }
}

// 5. Bookshelf & Books CRUD
async function updateBookshelfConfig(req, res, next) {
  try {
    const { pageTitle, pageSubtitle } = req.body;
    let config = await prisma.bookshelfConfig.findFirst();
    if (config) {
      config = await prisma.bookshelfConfig.update({
        where: { id: config.id },
        data: { pageTitle, pageSubtitle }
      });
    } else {
      config = await prisma.bookshelfConfig.create({ data: { pageTitle, pageSubtitle } });
    }
    await logAudit(req.user.id, 'UPDATE_BOOKSHELF_CONFIG', 'BookshelfConfig', config.id);
    res.status(200).json({ success: true, data: config });
  } catch (err) { next(err); }
}

async function createBook(req, res, next) {
  try {
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });

    const data = parse.data;
    const { characters, playlist, purchaseLinks, ...bookFields } = data;

    const existingSlug = await prisma.book.findUnique({ where: { slug: bookFields.slug } });
    if (existingSlug) return res.status(400).json({ success: false, message: 'A book with this slug already exists.' });

    const book = await prisma.book.create({
      data: {
        ...bookFields,
        characters: { create: characters.map((c, i) => ({ ...c, displayOrder: i })) },
        playlist: { create: playlist.map((p, i) => ({ ...p, trackNumber: i + 1 })) },
        purchaseLinks: { create: purchaseLinks.map((l, i) => ({ ...l, displayOrder: i })) }
      },
      include: { characters: true, playlist: true, purchaseLinks: true }
    });

    await logAudit(req.user.id, 'CREATE_BOOK', 'Book', book.id, { title: book.title, slug: book.slug });
    res.status(201).json({ success: true, data: book });
  } catch (err) { next(err); }
}

async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });

    const data = parse.data;
    const { characters, playlist, purchaseLinks, ...bookFields } = data;

    // Check slug collision with other books
    const slugCheck = await prisma.book.findFirst({
      where: { slug: bookFields.slug, NOT: { id } }
    });
    if (slugCheck) return res.status(400).json({ success: false, message: 'Slug belongs to another book.' });

    // Use transaction to update book and replace nested relations
    const updatedBook = await prisma.$transaction(async (tx) => {
      await tx.bookCharacter.deleteMany({ where: { bookId: id } });
      await tx.bookPlaylistTrack.deleteMany({ where: { bookId: id } });
      await tx.bookPurchaseLink.deleteMany({ where: { bookId: id } });

      return await tx.book.update({
        where: { id },
        data: {
          ...bookFields,
          characters: { create: characters.map((c, i) => ({ ...c, displayOrder: i })) },
          playlist: { create: playlist.map((p, i) => ({ ...p, trackNumber: i + 1 })) },
          purchaseLinks: { create: purchaseLinks.map((l, i) => ({ ...l, displayOrder: i })) }
        },
        include: { characters: true, playlist: true, purchaseLinks: true }
      });
    });

    await logAudit(req.user.id, 'UPDATE_BOOK', 'Book', id, { title: updatedBook.title });
    res.status(200).json({ success: true, data: updatedBook });
  } catch (err) { next(err); }
}

async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.book.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_BOOK', 'Book', id);
    res.status(200).json({ success: true, message: 'Book deleted' });
  } catch (err) { next(err); }
}

// 6. Writing Desk & Projects
async function createWritingProject(req, res, next) {
  try {
    const parse = writingProjectSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });
    const count = await prisma.writingProject.count();
    const isFirst = count === 0;
    const project = await prisma.writingProject.create({
      data: {
        ...parse.data,
        displayOrder: count,
        isPrimary: parse.data.isPrimary || isFirst
      }
    });
    await logAudit(req.user.id, 'CREATE_WRITING_PROJECT', 'WritingProject', project.id);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
}

async function updateWritingProject(req, res, next) {
  try {
    const { id } = req.params;
    const parse = writingProjectSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });

    let project;
    if (id === 'primary') {
      project = await prisma.writingProject.findFirst({ where: { isPrimary: true } });
      if (!project) {
        project = await prisma.writingProject.findFirst();
      }
      if (project) {
        project = await prisma.writingProject.update({ where: { id: project.id }, data: parse.data });
      } else {
        project = await prisma.writingProject.create({ data: { ...parse.data, isPrimary: true } });
      }
    } else {
      project = await prisma.writingProject.update({ where: { id }, data: parse.data });
    }

    await logAudit(req.user.id, 'UPDATE_WRITING_PROJECT', 'WritingProject', project.id, parse.data);
    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
}

async function deleteWritingProject(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.writingProject.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_WRITING_PROJECT', 'WritingProject', id);
    res.status(200).json({ success: true, message: 'Writing project deleted' });
  } catch (err) { next(err); }
}

async function setPrimaryWritingProject(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.$transaction([
      prisma.writingProject.updateMany({ data: { isPrimary: false } }),
      prisma.writingProject.update({ where: { id }, data: { isPrimary: true } })
    ]);
    await logAudit(req.user.id, 'SET_PRIMARY_WRITING_PROJECT', 'WritingProject', id);
    res.status(200).json({ success: true, message: 'Primary WIP updated' });
  } catch (err) { next(err); }
}

async function addDeskLog(req, res, next) {
  try {
    const { date, text } = req.body;
    if (!date || !text) return res.status(400).json({ success: false, message: 'Date and text required' });
    const count = await prisma.deskLog.count();
    const log = await prisma.deskLog.create({ data: { date, text, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_DESK_LOG', 'DeskLog', log.id);
    res.status(201).json({ success: true, data: log });
  } catch (err) { next(err); }
}

async function updateDeskLog(req, res, next) {
  try {
    const { id } = req.params;
    const { date, text } = req.body;
    if (!date || !text) return res.status(400).json({ success: false, message: 'Date and text required' });
    const log = await prisma.deskLog.update({ where: { id }, data: { date, text } });
    await logAudit(req.user.id, 'UPDATE_DESK_LOG', 'DeskLog', id);
    res.status(200).json({ success: true, data: log });
  } catch (err) { next(err); }
}

async function deleteDeskLog(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.deskLog.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_DESK_LOG', 'DeskLog', id);
    res.status(200).json({ success: true, message: 'Desk log deleted' });
  } catch (err) { next(err); }
}

async function addSnippet(req, res, next) {
  try {
    const { source, text } = req.body;
    if (!source || !text) return res.status(400).json({ success: false, message: 'Source and text required' });
    const count = await prisma.manuscriptSnippet.count();
    const snip = await prisma.manuscriptSnippet.create({ data: { source, text, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_SNIPPET', 'ManuscriptSnippet', snip.id);
    res.status(201).json({ success: true, data: snip });
  } catch (err) { next(err); }
}

async function updateSnippet(req, res, next) {
  try {
    const { id } = req.params;
    const { source, text } = req.body;
    if (!source || !text) return res.status(400).json({ success: false, message: 'Source and text required' });
    const snip = await prisma.manuscriptSnippet.update({ where: { id }, data: { source, text } });
    await logAudit(req.user.id, 'UPDATE_SNIPPET', 'ManuscriptSnippet', id);
    res.status(200).json({ success: true, data: snip });
  } catch (err) { next(err); }
}

async function deleteSnippet(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.manuscriptSnippet.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_SNIPPET', 'ManuscriptSnippet', id);
    res.status(200).json({ success: true, message: 'Snippet deleted' });
  } catch (err) { next(err); }
}

async function addQuote(req, res, next) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Quote text required' });
    const count = await prisma.deskQuote.count();
    const quote = await prisma.deskQuote.create({ data: { text, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_QUOTE', 'DeskQuote', quote.id);
    res.status(201).json({ success: true, data: quote });
  } catch (err) { next(err); }
}

async function updateQuote(req, res, next) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const quote = await prisma.deskQuote.update({ where: { id }, data: { text } });
    await logAudit(req.user.id, 'UPDATE_QUOTE', 'DeskQuote', id);
    res.status(200).json({ success: true, data: quote });
  } catch (err) { next(err); }
}

async function deleteQuote(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.deskQuote.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_QUOTE', 'DeskQuote', id);
    res.status(200).json({ success: true, message: 'Quote deleted' });
  } catch (err) { next(err); }
}

async function addSneakPeek(req, res, next) {
  try {
    const { title, desc } = req.body;
    if (!title || !desc) return res.status(400).json({ success: false, message: 'Title and desc required' });
    const count = await prisma.sneakPeek.count();
    const peek = await prisma.sneakPeek.create({ data: { title, desc, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_SNEAK_PEEK', 'SneakPeek', peek.id);
    res.status(201).json({ success: true, data: peek });
  } catch (err) { next(err); }
}

async function updateSneakPeek(req, res, next) {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
    if (!title || !desc) return res.status(400).json({ success: false, message: 'Title and desc required' });
    const peek = await prisma.sneakPeek.update({ where: { id }, data: { title, desc } });
    await logAudit(req.user.id, 'UPDATE_SNEAK_PEEK', 'SneakPeek', id);
    res.status(200).json({ success: true, data: peek });
  } catch (err) { next(err); }
}

async function deleteSneakPeek(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.sneakPeek.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_SNEAK_PEEK', 'SneakPeek', id);
    res.status(200).json({ success: true, message: 'Sneak peek deleted' });
  } catch (err) { next(err); }
}

// 7. Mascot & Audio
async function updateMascotConfig(req, res, next) {
  try {
    const { name, initialSpeech } = req.body;
    let config = await prisma.mascotConfig.findFirst();
    if (config) {
      config = await prisma.mascotConfig.update({
        where: { id: config.id },
        data: { name, initialSpeech }
      });
    } else {
      config = await prisma.mascotConfig.create({ data: { name, initialSpeech } });
    }
    await logAudit(req.user.id, 'UPDATE_MASCOT_CONFIG', 'MascotConfig', config.id);
    res.status(200).json({ success: true, data: config });
  } catch (err) { next(err); }
}

async function addMascotQuote(req, res, next) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text required' });
    const count = await prisma.mascotQuote.count();
    const quote = await prisma.mascotQuote.create({ data: { text, displayOrder: count } });
    await logAudit(req.user.id, 'ADD_MASCOT_QUOTE', 'MascotQuote', quote.id);
    res.status(201).json({ success: true, data: quote });
  } catch (err) { next(err); }
}

async function deleteMascotQuote(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.mascotQuote.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_MASCOT_QUOTE', 'MascotQuote', id);
    res.status(200).json({ success: true, message: 'Mascot quote deleted' });
  } catch (err) { next(err); }
}

// 8. Store & Products
async function createProduct(req, res, next) {
  try {
    const parse = storeProductSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });
    const count = await prisma.storeProduct.count();
    const product = await prisma.storeProduct.create({
      data: { ...parse.data, displayOrder: count }
    });
    await logAudit(req.user.id, 'CREATE_PRODUCT', 'StoreProduct', product.id);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const parse = storeProductSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, errors: parse.error.errors });
    const product = await prisma.storeProduct.update({
      where: { id },
      data: parse.data
    });
    await logAudit(req.user.id, 'UPDATE_PRODUCT', 'StoreProduct', id);
    res.status(200).json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.storeProduct.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_PRODUCT', 'StoreProduct', id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
}

// 9. Media Assets Upload & Management
async function uploadMedia(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const relativePath = `/uploads/${req.file.filename}`;
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: relativePath
      }
    });

    await logAudit(req.user.id, 'UPLOAD_MEDIA', 'MediaAsset', asset.id, { filename: req.file.filename });
    res.status(201).json({ success: true, data: asset, url: relativePath });
  } catch (err) { next(err); }
}

async function getMediaList(req, res, next) {
  try {
    const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: assets });
  } catch (err) { next(err); }
}

async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });

    // Check references in Books
    const referencedBook = await prisma.book.findFirst({
      where: { OR: [{ coverImage: asset.path }, { characterArtImage: asset.path }] }
    });
    if (referencedBook) {
      return res.status(400).json({
        success: false,
        message: `Media is currently in use by book "${referencedBook.title}". Remove reference before deleting.`
      });
    }

    const fullPath = path.join(__dirname, '../../../', asset.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await prisma.mediaAsset.delete({ where: { id } });
    await logAudit(req.user.id, 'DELETE_MEDIA', 'MediaAsset', id, { filename: asset.filename });

    res.status(200).json({ success: true, message: 'Media asset deleted' });
  } catch (err) { next(err); }
}

// 10. Audit Logs
async function getAuditLogs(req, res, next) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { email: true } } }
    });
    res.status(200).json({ success: true, data: logs });
  } catch (err) { next(err); }
}

module.exports = {
  updateSiteSettings,
  addSocialLink,
  toggleSocialLink,
  deleteSocialLink,
  updateHomeSettings,
  updateAboutSettings,
  addTrope,
  deleteTrope,
  addGenre,
  deleteGenre,
  addHobby,
  deleteHobby,
  addFunFact,
  deleteFunFact,
  updateBookshelfConfig,
  createBook,
  updateBook,
  deleteBook,
  createWritingProject,
  updateWritingProject,
  deleteWritingProject,
  setPrimaryWritingProject,
  addDeskLog,
  updateDeskLog,
  deleteDeskLog,
  addSnippet,
  updateSnippet,
  deleteSnippet,
  addQuote,
  updateQuote,
  deleteQuote,
  addSneakPeek,
  updateSneakPeek,
  deleteSneakPeek,
  updateMascotConfig,
  addMascotQuote,
  deleteMascotQuote,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadMedia,
  getMediaList,
  deleteMedia,
  getAuditLogs
};
