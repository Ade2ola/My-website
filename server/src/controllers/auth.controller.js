const argon2 = require('argon2');
const prisma = require('../utils/prisma');
const { loginSchema, changePasswordSchema } = require('../validators/auth.validator');
const { generateCsrfToken } = require('../middleware/csrf');

async function login(req, res, next) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: parseResult.error.errors
      });
    }

    const { email, password } = parseResult.data;

    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Regenerate session to prevent fixation
    req.session.userId = user.id;
    const csrfToken = generateCsrfToken(req);

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'AdminUser',
        entityId: user.id,
        details: JSON.stringify({ ip: req.ip, userAgent: req.get('User-Agent') })
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email },
      csrfToken
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    if (req.session && req.session.userId) {
      const userId = req.session.userId;
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'LOGOUT',
          entity: 'AdminUser',
          entityId: userId
        }
      });
      req.session.destroy();
    }
    res.clearCookie('dessy_session_id');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
}

async function getSession(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(200).json({
        authenticated: false
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: req.session.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(200).json({ authenticated: false });
    }

    const csrfToken = generateCsrfToken(req);

    return res.status(200).json({
      authenticated: true,
      user,
      csrfToken
    });
  } catch (error) {
    next(error);
  }
}

async function getCsrfToken(req, res, next) {
  try {
    const csrfToken = generateCsrfToken(req);
    return res.status(200).json({ csrfToken });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: parseResult.error.errors
      });
    }

    const { currentPassword, newPassword } = parseResult.data;
    const user = await prisma.adminUser.findUnique({
      where: { id: req.session.userId }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const validPassword = await argon2.verify(user.passwordHash, currentPassword);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    const newPasswordHash = await argon2.hash(newPassword);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CHANGE_PASSWORD',
        entity: 'AdminUser',
        entityId: user.id
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  logout,
  getSession,
  getCsrfToken,
  changePassword
};
