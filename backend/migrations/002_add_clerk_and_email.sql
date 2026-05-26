-- Migration 002: Clerk user support + email captures

-- Add clerk_user_id to households (TEXT — Clerk IDs are strings like user_2abc123)
ALTER TABLE households ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_households_clerk_user_id ON households(clerk_user_id);

-- Email captures table
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'dashboard',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);
CREATE INDEX IF NOT EXISTS idx_email_captures_created ON email_captures(created_at DESC);

ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on email_captures" ON email_captures
  USING (true) WITH CHECK (true);
