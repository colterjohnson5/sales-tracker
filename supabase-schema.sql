-- ============================================================================
-- SALES TRACKER DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- 1. PROFILES TABLE
-- Stores user information (agency owners and producers)
-- ============================================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'producer')),
  agency_id TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  invite_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast team lookups
CREATE INDEX idx_profiles_agency_id ON profiles(agency_id);
CREATE INDEX idx_profiles_invite_code ON profiles(invite_code);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can read profiles in their agency
CREATE POLICY "Users can read agency profiles" ON profiles
  FOR SELECT USING (
    agency_id IN (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);


-- 2. DAILY_ACTIVITY TABLE
-- Stores daily KPI data for each user
-- ============================================================================
CREATE TABLE daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  
  -- Activity KPIs
  calls INTEGER DEFAULT 0,
  households_quoted INTEGER DEFAULT 0,
  households_closed INTEGER DEFAULT 0,
  pivots INTEGER DEFAULT 0,
  appointments INTEGER DEFAULT 0,
  referrals INTEGER DEFAULT 0,
  
  -- Policies written
  policies_auto INTEGER DEFAULT 0,
  policies_home INTEGER DEFAULT 0,
  policies_life INTEGER DEFAULT 0,
  policies_health INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one entry per user per day
  UNIQUE(user_id, date)
);

-- Index for fast date-based lookups
CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, date);
CREATE INDEX idx_daily_activity_date ON daily_activity(date);

-- Enable Row Level Security
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own activity
CREATE POLICY "Users can read own activity" ON daily_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Agency owners can read their team's activity
CREATE POLICY "Owners can read team activity" ON daily_activity
  FOR SELECT USING (
    user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Policy: Users can insert their own activity
CREATE POLICY "Users can insert own activity" ON daily_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own activity
CREATE POLICY "Users can update own activity" ON daily_activity
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can upsert their own activity
CREATE POLICY "Users can upsert own activity" ON daily_activity
  FOR ALL USING (auth.uid() = user_id);


-- 3. HELPER FUNCTION: Update timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Apply trigger to daily_activity
CREATE TRIGGER daily_activity_updated_at
  BEFORE UPDATE ON daily_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ============================================================================
-- DONE! Your database is ready.
-- ============================================================================
