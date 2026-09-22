/**
 * jobs table column names — keep in sync with
 * shared/migrations/002_create_jobs.sql
 */
export const JOBS_TABLE = 'jobs';

export const JOB_TYPES = Object.freeze(['image_resize', 'email', 'report']);

export const JOB_STATUSES = Object.freeze(['queued', 'running', 'done', 'failed']);

export const JobColumns = Object.freeze({
  id: 'id',
  userId: 'user_id',
  type: 'type',
  payload: 'payload',
  priority: 'priority',
  status: 'status',
  attempts: 'attempts',
  maxAttempts: 'max_attempts',
  lockedBy: 'locked_by',
  lockedAt: 'locked_at',
  runAt: 'run_at',
  error: 'error',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
