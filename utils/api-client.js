import axios from 'axios';
import logger from 'config/logger/pino.js';

/**
 * Centralized API client for managing all external API communications
 */
class ApiClient {
  constructor(config = {}) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config
    };

    this.client = axios.create({
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Cactro-Spotify-Assignment/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for logging and error handling
   */
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        logger.debug({
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: this.sanitizeHeaders(config.headers)
        }, 'Making API request');
        return config;
      },
      (error) => {
        logger.error(error, 'Request interceptor error');
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug({
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          method: response.config.method?.toUpperCase()
        }, 'API request successful');
        return response;
      },
      async (error) => {
        if (error.config && this.shouldRetry(error)) {
          return this.retryRequest(error.config);
        }

        this.logError(error);
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Sanitize headers to remove sensitive information from logs
   */
  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    if (sanitized.Authorization) {
      sanitized.Authorization = sanitized.Authorization.replace(/Bearer .+/, 'Bearer [REDACTED]');
    }
    return sanitized;
  }

  /**
   * Determine if a request should be retried based on error type
   */
  shouldRetry(error) {
    if (error.config._retryCount >= this.config.retries) {
      return false;
    }

    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  /**
   * Retry a failed request with exponential backoff
   */
  async retryRequest(config) {
    config._retryCount = config._retryCount || 0;
    config._retryCount++;

    const delay = this.config.retryDelay * Math.pow(2, config._retryCount - 1);

    logger.warn({
      attempt: config._retryCount,
      maxRetries: this.config.retries,
      delay,
      url: config.url
    }, 'Retrying API request');

    await new Promise(resolve => setTimeout(resolve, delay));

    return this.client.request(config);
  }

  /**
   * Log error details
   */
  logError(error) {
    const errorDetails = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };

    logger.error(errorDetails, 'API request failed');
  }

  /**
   * Format error for consistent error handling
   */
  formatError(error) {
    const formattedError = new Error();

    if (error.response) {
      // Server responded with error status
      formattedError.message = error.response.data?.error?.message ||
        error.response.data?.message ||
        error.response.statusText ||
        'Request failed';
      formattedError.status = error.response.status;
      formattedError.data = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      formattedError.message = 'No response received from server';
      formattedError.status = 0;
    } else {
      // Something else happened
      formattedError.message = error.message || 'Request failed';
    }

    formattedError.originalError = error;
    return formattedError;
  }

  /**
   * Generic GET request
   */
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put(url, data = {}, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch(url, data = {}, config = {}) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }
}

export default ApiClient;
