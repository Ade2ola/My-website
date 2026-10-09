const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = require('../middleware/auth');
const { verifyCsrf } = require('../middleware/csrf');
const config = require('../config');

// Setup Multer Storage & Validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadSizeMb * 1024 * 1024 }
});

// Protect all admin routes
router.use(requireAdmin);
router.use(verifyCsrf);

// 1. Settings
router.patch('/settings', adminController.updateSiteSettings);
router.post('/social-links', adminController.addSocialLink);
router.patch('/social-links/:id/toggle', adminController.toggleSocialLink);
router.delete('/social-links/:id', adminController.deleteSocialLink);

// 2. Home Page
router.patch('/home', adminController.updateHomeSettings);

// 3. About Page & Sub-items
router.patch('/about', adminController.updateAboutSettings);
router.post('/tropes', adminController.addTrope);
router.delete('/tropes/:id', adminController.deleteTrope);
router.post('/genres', adminController.addGenre);
router.delete('/genres/:id', adminController.deleteGenre);
router.post('/hobbies', adminController.addHobby);
router.delete('/hobbies/:id', adminController.deleteHobby);
router.post('/fun-facts', adminController.addFunFact);
router.delete('/fun-facts/:id', adminController.deleteFunFact);

// 4. Bookshelf & Books
router.patch('/bookshelf-config', adminController.updateBookshelfConfig);
router.post('/books', adminController.createBook);
router.patch('/books/:id', adminController.updateBook);
router.delete('/books/:id', adminController.deleteBook);

// 5. Writing Desk & Projects
router.post('/writing-projects', adminController.createWritingProject);
router.patch('/writing-projects/:id', adminController.updateWritingProject);
router.delete('/writing-projects/:id', adminController.deleteWritingProject);
router.patch('/writing-projects/:id/set-primary', adminController.setPrimaryWritingProject);

router.post('/desk-logs', adminController.addDeskLog);
router.patch('/desk-logs/:id', adminController.updateDeskLog);
router.delete('/desk-logs/:id', adminController.deleteDeskLog);

router.post('/snippets', adminController.addSnippet);
router.patch('/snippets/:id', adminController.updateSnippet);
router.delete('/snippets/:id', adminController.deleteSnippet);

router.post('/quotes', adminController.addQuote);
router.patch('/quotes/:id', adminController.updateQuote);
router.delete('/quotes/:id', adminController.deleteQuote);

router.post('/sneak-peeks', adminController.addSneakPeek);
router.patch('/sneak-peeks/:id', adminController.updateSneakPeek);
router.delete('/sneak-peeks/:id', adminController.deleteSneakPeek);

// 6. Mascot & Audio
router.patch('/mascot', adminController.updateMascotConfig);
router.post('/mascot/quotes', adminController.addMascotQuote);
router.delete('/mascot/quotes/:id', adminController.deleteMascotQuote);

// 7. Store & Products
router.post('/products', adminController.createProduct);
router.patch('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// 8. Media Assets
router.post('/uploads', upload.single('media'), adminController.uploadMedia);
router.get('/media', adminController.getMediaList);
router.delete('/media/:id', adminController.deleteMedia);

// 9. Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
