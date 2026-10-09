const prisma = require('../utils/prisma');

async function requireAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: req.session.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Invalid session user. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAdmin };
