const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAdmin } = require('../middleware/auth');
const { verifyCsrf } = require('../middleware/csrf');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/session', authController.getSession);
router.get('/csrf-token', authController.getCsrfToken);
router.post('/change-password', requireAdmin, verifyCsrf, authController.changePassword);

module.exports = router;
