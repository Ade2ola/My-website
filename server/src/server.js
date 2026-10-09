const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const prisma = require('./utils/prisma');

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 My-Website CMS Server running on port ${PORT} [${config.env}]`);
  logger.info(`🌐 Public App URL: ${config.appBaseUrl}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Process terminated.');
    process.exit(0);
  });
});
