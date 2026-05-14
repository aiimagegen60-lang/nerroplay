-- NERROPLAY PRODUCTION SCHEMA (Robust)
-- Run this in your Supabase SQL Editor

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tool History Table (Production Ready)
-- Decoupled structure allows 100+ tools to function without DB schema changes.
CREATE TABLE IF NOT EXISTS tool_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id TEXT NOT NULL,
    input_data JSONB DEFAULT '{}'::jsonb,
    result_data JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_tool_history_user_id ON tool_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_history_tool_id ON tool_history(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_history_created_at ON tool_history(created_at);

-- 3. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT now(),
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferred_language TEXT DEFAULT 'en'
);

-- 4. Games Table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    game_url TEXT NOT NULL,
    category TEXT DEFAULT 'Action',
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE tool_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- 6. Policies (Atomic Checks)
DROP POLICY IF EXISTS "Games are viewable by everyone" ON games;
CREATE POLICY "Games are viewable by everyone"
    ON games FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can view their own tool history" ON tool_history;
CREATE POLICY "Users can view their own tool history"
    ON tool_history FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tool history" ON tool_history;
CREATE POLICY "Users can insert their own tool history"
    ON tool_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- 6. Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
