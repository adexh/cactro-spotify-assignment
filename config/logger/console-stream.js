import PinoPretty from 'pino-pretty';

const consoleStream = (options) => {
  return PinoPretty({
    colorize: true,
    ignore: 'pid,hostname,timer',
    translateTime: true,
    customPrettifiers: {
      query: (text) => `${text}`,
      stack: (text) => `${text}`,
    },
    messageFormat: (log) => {
      const { msg, timer } = log;

      const millSecs = typeof timer === 'number' ? timer.toFixed(2) : undefined;

      return `\x1b[97m${msg}\x1b[0m${millSecs ? ` (${millSecs} ms)` : ''}`;
    },
    ...options
  });
}

export default consoleStream;