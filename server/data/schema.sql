CREATE TABLE IF NOT EXISTS sp_users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  objective TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sp_admins (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Administrateur',
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sp_progress (
  user_id UUID PRIMARY KEY REFERENCES sp_users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sp_questions (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sp_inscriptions (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'en attente',
  date_inscription TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS sp_messages (
  id UUID PRIMARY KEY,
  date_envoi TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS sp_users_role_idx ON sp_users(role);
CREATE INDEX IF NOT EXISTS sp_inscriptions_status_date_idx ON sp_inscriptions(status, date_inscription DESC);
CREATE INDEX IF NOT EXISTS sp_messages_date_idx ON sp_messages(date_envoi DESC);
CREATE INDEX IF NOT EXISTS sp_questions_created_idx ON sp_questions(created_at DESC);
