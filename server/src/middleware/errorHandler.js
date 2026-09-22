import { AppError, logger } from '../../../shared/index.js';
import { env } from '../config/env.js';

/**
 * Central Express error handler.
 * Must be registered after all routes (4 arguments).
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  if (!isOperational || statusCode >= 500) {
    logger.error(err.message, err);
  } else {
    logger.warn(err.message, { statusCode, details: err.details });
  }

  const body = {
    success: false,
    error: {
      message: isOperational || env.isDev ? err.message : 'Internal server error',
    },
  };

  if (err.details !== undefined && (isOperational || env.isDev)) {
    body.error.details = err.details;
  }

  if (env.isDev && !isOperational) {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

export function notFoundHandler(_req, _res, next) {
  next(new AppError('Route not found', 404));
}
