-- QueueForge: jobs table (the durable queue)
-- Requires: 001_create_users.sql
-- Apply later via migration runner, or:
--   psql "$DATABASE_URL" -f shared/migrations/002_create_jobs.sql

CREATE TABLE IF NOT EXISTS jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  payload       JSONB NOT NULL DEFAULT '{}'::jsonb,
  priority      INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'queued',
  attempts      INTEGER NOT NULL DEFAULT 0,
  max_attempts  INTEGER NOT NULL DEFAULT 3,
  locked_by     TEXT,
  locked_at     TIMESTAMPTZ,
  run_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT jobs_type_check CHECK (type IN ('image_resize', 'email', 'report')),
  CONSTRAINT jobs_status_check CHECK (status IN ('queued', 'running', 'done', 'failed')),
  CONSTRAINT jobs_priority_check CHECK (priority >= 0),
  CONSTRAINT jobs_attempts_check CHECK (attempts >= 0 AND max_attempts >= 1)
);

-- Claim query: status = queued AND run_at <= now() ORDER BY priority DESC, created_at ASC
CREATE INDEX IF NOT EXISTS jobs_claim_idx
  ON jobs (priority DESC, created_at ASC)
  WHERE status = 'queued';

CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs (user_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs (status);
CREATE INDEX IF NOT EXISTS jobs_run_at_idx ON jobs (run_at)
  WHERE status = 'queued';

COMMENT ON TABLE jobs IS 'Durable background job queue; workers claim with FOR UPDATE SKIP LOCKED';
COMMENT ON COLUMN jobs.run_at IS 'Eligible time — used for delayed retries / backoff';
COMMENT ON COLUMN jobs.locked_by IS 'Worker id holding the job while status = running';
