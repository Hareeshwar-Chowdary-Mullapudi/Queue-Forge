/**
 * Shared modules used by API and worker (DB helpers, job types, etc.).
 * Keep this package ESM-only (`"type": "module"`).
 */

export const APP_NAME = 'QueueForge';
export { logger } from './logger.js';
export { AppError } from './errors.js';
