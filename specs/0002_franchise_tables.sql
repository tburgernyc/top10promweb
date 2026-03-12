-- ============================================================
-- Top 10 Prom Phase 1 | Migration 0002: Franchise Tables
-- Multi-tenant architecture for 5+ boutique locations
-- ============================================================

-- 1. Add columns to profiles (already has role as TEXT with CHECK — skip enum)
-- (role column already exists from 0001 as TEXT with CHECK constraint)

-- 2. Update dresses table for multi-image and video support
-- (images, video_url, size_chart already exist from 0001 — IF NOT EXISTS skips safely)
ALTER TABLE dresses
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS size_chart JSONB DEFAULT '{}';

-- 3. Update boutiques table for calendar and timezone
-- (these already exist from 0001 — IF NOT EXISTS skips safely)
ALTER TABLE boutiques
  ADD COLUMN IF NOT EXISTS google_calendar_id TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
  ADD COLUMN IF NOT EXISTS zip TEXT;

-- 4. Update availability_inquiries for parent/guardian and school info
-- (these already exist from 0001 — IF NOT EXISTS skips safely)
ALTER TABLE availability_inquiries
  ADD COLUMN IF NOT EXISTS parent_email TEXT,
  ADD COLUMN IF NOT EXISTS parent_phone TEXT,
  ADD COLUMN IF NOT EXISTS school_name TEXT,
  ADD COLUMN IF NOT EXISTS event_date DATE;

-- ============================================================
-- NEW TABLES
-- ============================================================

-- 5. boutique_staff: Links users to locations with role-based access
CREATE TABLE IF NOT EXISTS boutique_staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('staff', 'store_admin')) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, boutique_id)
);

ALTER TABLE boutique_staff ENABLE ROW LEVEL SECURITY;

-- Staff can read their own assignments
CREATE POLICY "staff_read_own"
  ON boutique_staff FOR SELECT
  USING ((select auth.uid()) = user_id);

-- Platform admins can manage all staff
CREATE POLICY "platform_admin_manage_staff"
  ON boutique_staff FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'platform_admin'
    )
  );

-- Store admins can manage staff at their own boutique
CREATE POLICY "store_admin_manage_staff"
  ON boutique_staff FOR ALL
  USING (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
      AND bs.role = 'store_admin'
    )
  );

-- boutique_staff now exists — add staff read policy for availability_inquiries
CREATE POLICY "inquiries_staff_read"
  ON availability_inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boutique_staff bs
      WHERE bs.boutique_id = availability_inquiries.boutique_id
      AND bs.user_id = (select auth.uid())
    )
  );


-- 6. dress_inventory: Location-specific inventory
CREATE TABLE IF NOT EXISTS dress_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE NOT NULL,
  dress_id UUID REFERENCES dresses(id) ON DELETE CASCADE NOT NULL,
  sizes_available JSONB DEFAULT '[]',
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(boutique_id, dress_id)
);

ALTER TABLE dress_inventory ENABLE ROW LEVEL SECURITY;

-- Anyone can read inventory (public catalog)
CREATE POLICY "inventory_public_read"
  ON dress_inventory FOR SELECT
  USING (true);

-- Staff can insert inventory at their own boutique
CREATE POLICY "inventory_staff_write"
  ON dress_inventory FOR INSERT
  WITH CHECK (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
    )
  );

-- Staff can update inventory at their own boutique
CREATE POLICY "inventory_staff_update"
  ON dress_inventory FOR UPDATE
  USING (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
    )
  );

-- Staff can delete inventory at their own boutique
CREATE POLICY "inventory_staff_delete"
  ON dress_inventory FOR DELETE
  USING (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
    )
  );


-- 7. boutique_settings: Per-location configuration
CREATE TABLE IF NOT EXISTS boutique_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_hours JSONB DEFAULT '{
    "monday": {"open": "10:00", "close": "18:00"},
    "tuesday": {"open": "10:00", "close": "18:00"},
    "wednesday": {"open": "10:00", "close": "18:00"},
    "thursday": {"open": "10:00", "close": "20:00"},
    "friday": {"open": "10:00", "close": "18:00"},
    "saturday": {"open": "10:00", "close": "17:00"},
    "sunday": {"open": null, "close": null}
  }',
  booking_lead_time_hours INTEGER DEFAULT 24 CHECK (booking_lead_time_hours >= 0),
  max_daily_appointments INTEGER DEFAULT 12 CHECK (max_daily_appointments > 0),
  appointment_duration_minutes INTEGER DEFAULT 60 CHECK (appointment_duration_minutes > 0),
  auto_confirm_bookings BOOLEAN DEFAULT false,
  notification_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE boutique_settings ENABLE ROW LEVEL SECURITY;

-- Public read (needed for booking flow to check availability)
CREATE POLICY "settings_public_read"
  ON boutique_settings FOR SELECT
  USING (true);

-- Store admins can manage settings for their own boutique
CREATE POLICY "settings_staff_write"
  ON boutique_settings FOR ALL
  USING (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
      AND bs.role = 'store_admin'
    )
  );


-- 8. dress_reservations: THE COMPETITIVE MOAT
-- Prevents duplicate dresses at the same school prom
CREATE TABLE IF NOT EXISTS dress_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dress_id UUID REFERENCES dresses(id) ON DELETE CASCADE NOT NULL,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES profiles(id),
  school_name TEXT NOT NULL,
  event_name TEXT DEFAULT 'Prom',
  event_date DATE NOT NULL,
  status TEXT CHECK (status IN ('reserved', 'purchased', 'cancelled')) DEFAULT 'reserved',
  reserved_at TIMESTAMPTZ DEFAULT now(),
  -- A dress can only be reserved once per school per event date at a location
  UNIQUE(dress_id, boutique_id, school_name, event_date)
);

ALTER TABLE dress_reservations ENABLE ROW LEVEL SECURITY;

-- Public can check if a dress is reserved (but NOT who reserved it)
CREATE POLICY "reservations_public_read"
  ON dress_reservations FOR SELECT
  USING (true);

-- Customers can create reservations for themselves
CREATE POLICY "reservations_customer_create"
  ON dress_reservations FOR INSERT
  WITH CHECK (
    customer_id = (select auth.uid())
  );

-- Staff can manage reservations at their boutique
CREATE POLICY "reservations_staff_manage"
  ON dress_reservations FOR ALL
  USING (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
    )
  );


-- 9. social_votes: Friend voting on shared fitting rooms
CREATE TABLE IF NOT EXISTS social_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_token TEXT NOT NULL,
  dress_id UUID REFERENCES dresses(id) ON DELETE CASCADE NOT NULL,
  voter_name TEXT NOT NULL DEFAULT 'Anonymous',
  vote TEXT CHECK (vote IN ('up', 'down')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE social_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read and create votes (no auth required for voting)
CREATE POLICY "votes_public_read"
  ON social_votes FOR SELECT
  USING (true);

CREATE POLICY "votes_public_create"
  ON social_votes FOR INSERT
  WITH CHECK (true);


-- 10. platform_analytics: Event-based analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

-- Staff can read analytics for their boutique; platform_admin sees all
CREATE POLICY "analytics_staff_read"
  ON platform_analytics FOR SELECT
  USING (
    boutique_id IN (
      SELECT bs.boutique_id FROM boutique_staff bs
      WHERE bs.user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'platform_admin'
    )
  );

-- System can insert analytics (service role)
CREATE POLICY "analytics_insert"
  ON platform_analytics FOR INSERT
  WITH CHECK (true);


-- ============================================================
-- INDEXES for query performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_dress_inventory_boutique ON dress_inventory(boutique_id);
CREATE INDEX IF NOT EXISTS idx_dress_inventory_dress ON dress_inventory(dress_id);
CREATE INDEX IF NOT EXISTS idx_dress_inventory_active ON dress_inventory(boutique_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_dress_reservations_dress ON dress_reservations(dress_id);
CREATE INDEX IF NOT EXISTS idx_dress_reservations_school ON dress_reservations(school_name, event_date);
CREATE INDEX IF NOT EXISTS idx_dress_reservations_boutique ON dress_reservations(boutique_id);
CREATE INDEX IF NOT EXISTS idx_dress_reservations_status ON dress_reservations(status) WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_boutique_staff_user ON boutique_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_boutique_staff_boutique ON boutique_staff(boutique_id);

CREATE INDEX IF NOT EXISTS idx_social_votes_token ON social_votes(share_token);

CREATE INDEX IF NOT EXISTS idx_analytics_boutique_type ON platform_analytics(boutique_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON platform_analytics(created_at);

-- ============================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS dress_inventory_updated_at ON dress_inventory;
CREATE TRIGGER dress_inventory_updated_at
  BEFORE UPDATE ON dress_inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS boutique_settings_updated_at ON boutique_settings;
CREATE TRIGGER boutique_settings_updated_at
  BEFORE UPDATE ON boutique_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
