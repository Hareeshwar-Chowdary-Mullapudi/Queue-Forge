-- QueueForge: users table (accounts for JWT auth)
-- Apply later via migration runner, or:
--   psql "$DATABASE_URL" -f shared/migrations/001_create_users.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

COMMENT ON TABLE users IS 'Authenticated accounts that enqueue jobs';
COMMENT ON COLUMN users.password_hash IS 'bcrypt (or similar) hash — never store plaintext';
