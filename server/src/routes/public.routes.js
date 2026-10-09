const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

router.get('/', publicController.getFullSiteBundle);
router.get('/site', publicController.getFullSiteBundle);
router.get('/books', publicController.getBooks);
router.get('/books/:slug', publicController.getBookBySlug);
router.get('/writing-projects', publicController.getWritingProjects);
router.get('/quotes', publicController.getQuotes);
router.get('/mascot', publicController.getMascot);
router.get('/products', publicController.getProducts);

module.exports = router;
