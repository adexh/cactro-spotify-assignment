import { enviroment } from 'constants/index.js';

const { ISDEVELOPMENT } = enviroment.ENV;

const middlewares = {
  /**
   * Error handling middleware.
   * @param {Error} err
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next 
   */
  handleError: (err, req, res, next) => {
    if (!err || res.headersSent) {
      return next(err);
    }

    try {
      const { name, code, message, stack } = err;

      const statusCode = code || 500;
      const response = {
        status: 'error',
        message: message || 'Internal Server Error',
        error: {
          name,
          code,
          message,
          stack: ISDEVELOPMENT ? stack : undefined,
        },
      };

      res.err = err;
      res.status(statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  /**
 * Error handling middleware.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next 
 */
  handleCriticalError: (err, req, res, next) => {
    if (res.headersSent) {
      res.err = new Error('Headers already sent', { cause: err });

      req.destroy();

      return;
    }

    try {
      const defaultErrorMessage = 'Critical Error Occurred';

      let message = err?.message || defaultErrorMessage;
      let name = err?.name || 'CriticalError';
      let code = err?.code || 500;
      let stack = err?.stack;
      let statusCode = 500;

      if (typeof code === 'number') {
        statusCode = code;
      }

      const response = {
        status: 'error',
        message: message || 'Critical Error Occurred',
        error: {
          name,
          code,
          message,
          stack: ISDEVELOPMENT ? stack : undefined,
        },
      };

      res.err = err;
      res.status(statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },


}

export default middlewares;
