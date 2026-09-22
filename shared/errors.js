/**
 * Application error with an HTTP status code for API responses.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   * @param {{ details?: unknown }} [options]
   */
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = options.details;
    this.isOperational = true;
  }
}
