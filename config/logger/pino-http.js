import { pinoHttp } from "pino-http";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = pinoHttp({
  transport: isDevelopment ? {
    target: join(__dirname, './pino-http-stream.js'),
    options: {
      colorize: true,
    },
  } : undefined,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    })
  },
  level: isDevelopment ? 'info' : 'warn',
});

export default logger;
