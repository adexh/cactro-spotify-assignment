import { pino } from 'pino';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const level = 'info';

/** @type {pino.TransportMultiOptions} */
const transport = {
  targets: [
    {
      level,
      target: join(__dirname, './console-stream.js'),
      options: {}
    },
    {
      level,
      target: join(__dirname, './file-stream.js'),
      options: {}
    }
  ]
}

const logger = pino({
  transport
});
logger.level = level;

export default logger;