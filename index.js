import logger from './config/logger/pino.js';
import { enviroment } from 'constants/index.js';

let httpServer;

const { PORT } = enviroment.SERVER;

const killProcess = () => {
  logger.info('Shutting down the server gracefully...');
  if (httpServer) {
    httpServer.close(() => {
      logger.error('Server has been shut down.');
    });
    setTimeout(() => process.exit(0), 100);
  } else {
    logger.error('An error occurred, shutting down the server...');
    process.exit(1);
  }
}

process.on('SIGINT', killProcess);
process.on('SIGTERM', killProcess);

process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught Exception:');
  killProcess();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(reason, 'Unhandled Rejection at:', promise);
  killProcess();
});

try {
  const express = await import('./config/express.js');
  const app = express.default;

  httpServer = app.listen(PORT, logger.info(`Server is running on ${PORT}`));
} catch (error) {
  logger.error(error, 'Error starting the server:');
}
