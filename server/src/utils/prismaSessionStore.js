const session = require('express-session');
const prisma = require('./prisma');

class PrismaSessionStore extends session.Store {
  constructor() {
    super();
  }

  async get(sid, callback) {
    try {
      const record = await prisma.adminSession.findUnique({
        where: { sid }
      });

      if (!record) {
        if (typeof callback === 'function') callback(null, null);
        return;
      }

      if (record.expiresAt < new Date()) {
        await prisma.adminSession.delete({ where: { sid } });
        if (typeof callback === 'function') callback(null, null);
        return;
      }

      const sessionData = JSON.parse(record.userAgent || '{}');
      if (typeof callback === 'function') callback(null, sessionData);
    } catch (err) {
      if (typeof callback === 'function') callback(err);
    }
  }

  async set(sid, sessionData, callback) {
    try {
      const maxAge = (sessionData.cookie && sessionData.cookie.maxAge) || 24 * 60 * 60 * 1000;
      const expiresAt = new Date(Date.now() + maxAge);
      const userId = sessionData.userId || null;

      if (userId) {
        await prisma.adminSession.upsert({
          where: { sid },
          update: {
            userId,
            expiresAt,
            userAgent: JSON.stringify(sessionData)
          },
          create: {
            sid,
            userId,
            expiresAt,
            userAgent: JSON.stringify(sessionData)
          }
        });
      }

      if (typeof callback === 'function') callback(null);
    } catch (err) {
      if (typeof callback === 'function') callback(err);
    }
  }

  async destroy(sid, callback) {
    try {
      await prisma.adminSession.deleteMany({
        where: { sid }
      });
      if (typeof callback === 'function') callback(null);
    } catch (err) {
      if (typeof callback === 'function') callback(err);
    }
  }

  async touch(sid, sessionData, callback) {
    try {
      const maxAge = (sessionData.cookie && sessionData.cookie.maxAge) || 24 * 60 * 60 * 1000;
      const expiresAt = new Date(Date.now() + maxAge);

      await prisma.adminSession.updateMany({
        where: { sid },
        data: { expiresAt }
      });

      if (typeof callback === 'function') callback(null);
    } catch (err) {
      if (typeof callback === 'function') callback(err);
    }
  }
}

module.exports = PrismaSessionStore;
