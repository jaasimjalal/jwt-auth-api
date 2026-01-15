import app from './app';
import config from './config';
import logger from './utils/logger';

const PORT = config.server.port;

const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`
      ________________________________________
      🚀 JWT Auth API is running!
      📡 Port: ${PORT}
      🌿 Environment: ${config.server.nodeEnv}
      🔗 Health Check: http://localhost:${PORT}/health
      ________________________________________
    `);
  });
};

startServer();

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});