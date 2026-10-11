const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../../uploads'));
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET || 'fallback_session_secret_dessy_ackerman',
  csrfSecret: process.env.CSRF_SECRET || 'fallback_csrf_secret_dessy_ackerman',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  adminInitialEmail: process.env.ADMIN_INITIAL_EMAIL || 'admin@dessyackerman.com',
  adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || 'dessy123',
  uploadDir,
  maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '5', 10),
  trustProxy: process.env.TRUST_PROXY === 'true'
};

