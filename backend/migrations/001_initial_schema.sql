-- WattWise Initial Schema Migration
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  total_units INT,
  property_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Households table
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
  unit_number TEXT,
  sq_footage INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Utility bills table
CREATE TABLE IF NOT EXISTS utility_bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  kwh_used NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  rate_plan TEXT,
  utility_provider TEXT,
  account_last_four TEXT,
  raw_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  insight_value TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_utility_bills_household_id ON utility_bills(household_id);
CREATE INDEX IF NOT EXISTS idx_utility_bills_billing_period ON utility_bills(billing_period_start DESC);
CREATE INDEX IF NOT EXISTS idx_insights_household_id ON insights(household_id);
CREATE INDEX IF NOT EXISTS idx_households_user_id ON households(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by backend)
CREATE POLICY "Service role full access on users" ON users
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on buildings" ON buildings
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on households" ON households
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on utility_bills" ON utility_bills
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on insights" ON insights
  USING (true) WITH CHECK (true);

-- Storage: create the bills bucket (run via Supabase dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('bills', 'bills', false);
