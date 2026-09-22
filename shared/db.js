import pg from 'pg';
import { AppError } from './errors.js';
import { logger } from './logger.js';

const { Pool } = pg;

/** @type {import('pg').Pool | null} */
let pool = null;

/**
 * Create (or return) the shared PostgreSQL pool.
 * Used by API and worker — one queue table, two processes.
 */
export function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === '') {
    throw new AppError('DATABASE_URL is not configured', 500);
  }

  pool = new Pool({
    connectionString,
    max: Number(process.env.DB_POOL_MAX) || 10,
  });

  pool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL pool error', err);
  });

  logger.info('PostgreSQL pool created');
  return pool;
}

/**
 * Run a parameterized query on the shared pool.
 * @param {string} text
 * @param {unknown[]} [params]
 */
export async function query(text, params = []) {
  return getPool().query(text, params);
}

/** Lightweight connectivity check for /health. */
export async function checkDatabase() {
  const result = await query('SELECT 1 AS ok');
  return result.rows[0]?.ok === 1;
}

/** Close the pool (tests / graceful shutdown). */
export async function closePool() {
  if (!pool) return;
  await pool.end();
  pool = null;
  logger.info('PostgreSQL pool closed');
}
