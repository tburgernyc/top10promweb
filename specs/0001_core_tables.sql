-- ============================================================
-- Top 10 Prom Phase 1 | Migration 0001: Core Tables
-- Run this FIRST in Supabase SQL Editor before 0002
-- ============================================================

-- 1. profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer','staff','store_admin','platform_admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles_self_write"
  ON profiles FOR ALL
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. boutiques
CREATE TABLE IF NOT EXISTS boutiques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  google_calendar_id TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  lat NUMERIC,
  lng NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE boutiques ENABLE ROW LEVEL SECURITY;

-- Public can read all active boutiques
CREATE POLICY "boutiques_public_read"
  ON boutiques FOR SELECT USING (is_active = true);

-- 3. dresses
CREATE TABLE IF NOT EXISTS dresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designer TEXT,
  style_number TEXT,
  color TEXT,
  price_cents INTEGER,
  description TEXT,
  images JSONB DEFAULT '[]',
  video_url TEXT,
  size_chart JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dresses ENABLE ROW LEVEL SECURITY;

-- Public can read all active dresses
CREATE POLICY "dresses_public_read"
  ON dresses FOR SELECT USING (is_active = true);

-- 4. wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dress_id UUID REFERENCES dresses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, dress_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlist_self_only"
  ON wishlist FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 5. fitting_room_sessions
CREATE TABLE IF NOT EXISTS fitting_room_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_token TEXT NOT NULL UNIQUE,
  dress_ids JSONB DEFAULT '[]',
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE fitting_room_sessions ENABLE ROW LEVEL SECURITY;

-- Owner can manage their session; share_token enables public read
CREATE POLICY "fitting_room_owner"
  ON fitting_room_sessions FOR ALL
  USING (
    (select auth.uid()) = user_id
    OR share_token IS NOT NULL
  );

-- 6. availability_inquiries
CREATE TABLE IF NOT EXISTS availability_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dress_id UUID REFERENCES dresses(id) ON DELETE CASCADE NOT NULL,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  school_name TEXT,
  event_date DATE,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE availability_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "inquiries_customer_create"
  ON availability_inquiries FOR INSERT
  WITH CHECK (true);

-- Customers can read their own inquiries
-- (Staff read policy is added in 0002 after boutique_staff table is created)
CREATE POLICY "inquiries_customer_read"
  ON availability_inquiries FOR SELECT
  USING (customer_id = (select auth.uid()));

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_dresses_active ON dresses(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_boutiques_slug ON boutiques(slug);
CREATE INDEX IF NOT EXISTS idx_boutiques_active ON boutiques(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_fitting_room_token ON fitting_room_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_fitting_room_share ON fitting_room_sessions(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_boutique ON availability_inquiries(boutique_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON availability_inquiries(status);

-- ── Auto-update updated_at ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS dresses_updated_at ON dresses;
CREATE TRIGGER dresses_updated_at
  BEFORE UPDATE ON dresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS fitting_room_updated_at ON fitting_room_sessions;
CREATE TRIGGER fitting_room_updated_at
  BEFORE UPDATE ON fitting_room_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS inquiries_updated_at ON availability_inquiries;
CREATE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON availability_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
