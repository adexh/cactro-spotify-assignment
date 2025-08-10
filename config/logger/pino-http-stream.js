// consoleStream.js
import PinoPretty from 'pino-pretty';

/**
 * Colorize HTTP status codes based on their category.
 * @param {number} code - The HTTP status code.
 * @returns {string} The colorized status code.
 */
function colorizeStatusCode(code) {

  const colors = {
    red: 31,
    green: 32,
    yellow: 33,
    cyan: 36,
    white: 97,
  }

  let name = 'white';

  if (code >= 500) name = 'red';  // Red for server errors
  else if (code >= 400) name = 'yellow';  // Yellow for client errors
  else if (code >= 300) name = 'cyan';  // Cyan for redirects
  else if (code >= 200) name = 'green';  // Green for successful responses

  return `\x1b[${colors[name]}m${code}\x1b[0m`;  // Return colorized code
}

/**
 * Creates a pino-pretty stream with custom formatting for pino-http.
 *
 * @param {object} [options={}] - Additional pino-pretty options to override defaults.
 * @returns {NodeJS.WritableStream} A pino-pretty writable stream for logging.
 */
const consoleStream = (options = {}) => {
  return PinoPretty({
    colorize: true,
    ignore: 'pid,hostname,timer,req,res,responseTime,trace_id,span_id,trace_flags',
    translateTime: true,
    append: false, // Don't buffer output
    customPrettifiers: {
      query: (text) => `${text}`,
      stack: (text) => `${text}`,
    },

    messageFormat: (log) => {
      const { msg, timer, req, res } = log;

      const method = req?.method ? `\x1b[36m${req.method}\x1b[0m` : '';
      const url = req?.url ? `\x1b[33m${req.url}\x1b[0m` : '';
      const status = res?.statusCode
        ? colorizeStatusCode(res.statusCode)
        : '';

      const ms = typeof timer === 'number'
        ? ` (${timer.toFixed(2)} ms)`
        : '';

      return [method, url, status, '-', `\x1b[97m${msg}\x1b[0m${ms}`]
        .filter(Boolean)
        .join(' ');
    },

    ...options,
  });
};

export default consoleStream;
