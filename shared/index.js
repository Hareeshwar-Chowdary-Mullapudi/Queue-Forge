/**
 * Shared modules used by API and worker (DB helpers, job types, etc.).
 * Keep this package ESM-only (`"type": "module"`).
 */

export const APP_NAME = 'QueueForge';
export { logger } from './logger.js';
export { AppError } from './errors.js';
export { getPool, query, checkDatabase, closePool } from './db.js';
export { runMigrations } from './migrate.js';
export { USERS_TABLE, UserColumns } from './schema/users.js';
export { JOBS_TABLE, JOB_TYPES, JOB_STATUSES, JobColumns } from './schema/jobs.js';
