import logger from './config/logger/pino.js';
import { enviroment } from 'constants/index.js';

let httpServer;

const { PORT } = enviroment.SERVER;

const logServerStartMessage = () => {
  console.info(`
 ____  _____ ______     _______ ____  
/ ___|| ____|  _ \\ \\   / / ____|  _ \\ 
\\___ \\|  _| | |_) \\ \\ / /|  _| | |_) |
 ___) | |___|  _ < \\ V / | |___|  _ < 
|____/|_____|_| \\_\\ \\_/  |_____|_| \\_\\
 
————————————————————————————————————————————
Server is running on http://localhost:8080
————————————————————————————————————————————
  `);
}

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

  httpServer = app.listen(PORT, logServerStartMessage);
} catch (error) {
  logger.error(error, 'Error starting the server:');
}
