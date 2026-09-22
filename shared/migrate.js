/**
 * Apply pending SQL files in shared/migrations/ (sorted by filename).
 * Tracks applied files in schema_migrations.
 *
 * Usage (from repo root or shared/):
 *   npm run migrate --prefix shared
 *   npm run migrate --prefix server
 *
 * Loads DATABASE_URL from server/.env by default.
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { closePool, getPool, query } from './db.js';
import { logger } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
dotenv.config();

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedIds() {
  const result = await query('SELECT id FROM schema_migrations');
  return new Set(result.rows.map((row) => row.id));
}

async function applyMigration(fileName, sql) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [fileName]);
    await client.query('COMMIT');
    logger.info(`Applied ${fileName}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function runMigrations() {
  getPool();
  await ensureMigrationsTable();

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .sort();

  const applied = await getAppliedIds();
  let appliedCount = 0;

  for (const fileName of files) {
    if (applied.has(fileName)) {
      logger.info(`Skip ${fileName} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, fileName), 'utf8');
    await applyMigration(fileName, sql);
    appliedCount += 1;
  }

  if (appliedCount === 0) {
    logger.info('No new migrations to apply');
  } else {
    logger.info(`Applied ${appliedCount} migration(s)`);
  }
}

async function main() {
  try {
    await runMigrations();
  } catch (err) {
    logger.error('Migration failed', err);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main();
}
