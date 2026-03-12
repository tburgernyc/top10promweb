-- ============================================================
-- Top 10 Prom Phase 2A | Migration 0004: Wedding Expansion
-- Adds event_types to dresses, wedding booking fields,
-- and bridal_parties / bridal_party_members tables
-- ============================================================

-- 1. Add event_types JSONB to dresses (already in DB types — IF NOT EXISTS guards)
ALTER TABLE dresses
  ADD COLUMN IF NOT EXISTS event_types JSONB DEFAULT '["prom"]';

-- 2. Add event_type to availability_inquiries
ALTER TABLE availability_inquiries
  ADD COLUMN IF NOT EXISTS event_type TEXT CHECK (event_type IN ('prom', 'wedding')) DEFAULT 'prom';

-- 3. Add event_type to fitting_room_sessions
ALTER TABLE fitting_room_sessions
  ADD COLUMN IF NOT EXISTS event_type TEXT CHECK (event_type IN ('prom', 'wedding')) DEFAULT 'prom';

-- 4. Make school_name nullable on dress_reservations (stores bride_name for wedding)
ALTER TABLE dress_reservations
  ALTER COLUMN school_name DROP NOT NULL;

-- 5. Add event_type to dress_reservations
ALTER TABLE dress_reservations
  ADD COLUMN IF NOT EXISTS event_type TEXT CHECK (event_type IN ('prom', 'wedding')) DEFAULT 'prom';

-- ============================================================
-- NEW TABLES
-- ============================================================

-- 6. bridal_parties
CREATE TABLE IF NOT EXISTS bridal_parties (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bride_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bride_name    TEXT NOT NULL,
  wedding_date  DATE NOT NULL,
  venue_name    TEXT,
  party_size    INT,
  color_scheme  JSONB DEFAULT '[]',
  notes         TEXT,
  share_token   TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex') NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bridal_parties ENABLE ROW LEVEL SECURITY;

-- Bride can manage their own party
CREATE POLICY "bride_manage_own_party"
  ON bridal_parties
  USING ((select auth.uid()) = bride_id)
  WITH CHECK ((select auth.uid()) = bride_id);

-- Anyone can read via share_token (public shared link)
CREATE POLICY "public_read_by_token"
  ON bridal_parties FOR SELECT
  USING (true);

-- 7. bridal_party_members
CREATE TABLE IF NOT EXISTS bridal_party_members (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id       UUID REFERENCES bridal_parties(id) ON DELETE CASCADE NOT NULL,
  member_name    TEXT NOT NULL,
  member_email   TEXT,
  member_phone   TEXT,
  role           TEXT CHECK (role IN ('bride','maid_of_honor','bridesmaid','flower_girl','mother_of_bride','other')) DEFAULT 'bridesmaid',
  dress_id       UUID REFERENCES dresses(id) ON DELETE SET NULL,
  size           TEXT,
  status         TEXT CHECK (status IN ('invited','confirmed','fitted','purchased')) DEFAULT 'invited',
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bridal_party_members ENABLE ROW LEVEL SECURITY;

-- Party owner (bride) can manage members
CREATE POLICY "bride_manage_members"
  ON bridal_party_members
  USING (
    EXISTS (
      SELECT 1 FROM bridal_parties bp
      WHERE bp.id = party_id AND bp.bride_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bridal_parties bp
      WHERE bp.id = party_id AND bp.bride_id = (select auth.uid())
    )
  );

-- Public read (for shared party page)
CREATE POLICY "public_read_members"
  ON bridal_party_members FOR SELECT
  USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bridal_parties_bride_id ON bridal_parties(bride_id);
CREATE INDEX IF NOT EXISTS idx_bridal_parties_share_token ON bridal_parties(share_token);
CREATE INDEX IF NOT EXISTS idx_bridal_party_members_party_id ON bridal_party_members(party_id);
CREATE INDEX IF NOT EXISTS idx_dresses_event_types ON dresses USING gin(event_types);

-- ============================================================
-- SEED: Update existing dresses with event_types
-- (Run after seeding the 10 base dresses from seed_data.sql)
-- ============================================================

-- Tag dresses by position in creation order (adapt IDs in production):
-- 6 prom-only, 2 wedding-only, 2 dual-purpose
-- The seed_data.sql uses specific UUIDs — update those directly.
-- This script uses a positional approach for portability:

WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn
  FROM dresses
  WHERE is_active = true
)
UPDATE dresses d
SET event_types = CASE
  WHEN r.rn IN (7, 8)    THEN '["wedding"]'::jsonb
  WHEN r.rn IN (9, 10)   THEN '["prom","wedding"]'::jsonb
  ELSE                        '["prom"]'::jsonb
END
FROM ranked r
WHERE d.id = r.id;

-- ============================================================
-- SEED: Add 4 wedding-specific dresses
-- ============================================================
INSERT INTO dresses (name, designer, style_number, color, price_cents, description, images, event_types, is_active)
VALUES
  (
    'Ivory Lace A-Line Gown',
    'Allure Bridals',
    'AB-2401',
    'Ivory',
    289900,
    'Timeless ivory lace with sweetheart neckline and cathedral train. Classic A-line silhouette that flatters every figure.',
    '[{"url":"/images/wedding/lace-aline-01.jpg","alt":"Ivory Lace A-Line front","order":1,"is_primary":true},{"url":"/images/wedding/lace-aline-02.jpg","alt":"Ivory Lace A-Line back","order":2},{"url":"/images/wedding/lace-aline-03.jpg","alt":"Ivory Lace A-Line detail","order":3},{"url":"/images/wedding/lace-aline-04.jpg","alt":"Ivory Lace A-Line train","order":4}]'::jsonb,
    '["wedding"]'::jsonb,
    true
  ),
  (
    'Champagne Mermaid Gown',
    'Vera Wang Bride',
    'VW-M552',
    'Champagne',
    459900,
    'Body-skimming mermaid silhouette in luminous champagne satin. Off-shoulder neckline with dramatic chapel train.',
    '[{"url":"/images/wedding/mermaid-champagne-01.jpg","alt":"Champagne Mermaid front","order":1,"is_primary":true},{"url":"/images/wedding/mermaid-champagne-02.jpg","alt":"Champagne Mermaid side","order":2},{"url":"/images/wedding/mermaid-champagne-03.jpg","alt":"Champagne Mermaid back","order":3},{"url":"/images/wedding/mermaid-champagne-04.jpg","alt":"Champagne Mermaid train","order":4}]'::jsonb,
    '["wedding"]'::jsonb,
    true
  ),
  (
    'Blush Ball Gown',
    'Monique Lhuillier',
    'ML-BG03',
    'Blush',
    699900,
    'Voluminous blush tulle ball gown with hand-beaded bodice. The ultimate fairy-tale wedding statement.',
    '[{"url":"/images/wedding/ballgown-blush-01.jpg","alt":"Blush Ball Gown front","order":1,"is_primary":true},{"url":"/images/wedding/ballgown-blush-02.jpg","alt":"Blush Ball Gown side","order":2},{"url":"/images/wedding/ballgown-blush-03.jpg","alt":"Blush Ball Gown back","order":3},{"url":"/images/wedding/ballgown-blush-04.jpg","alt":"Blush Ball Gown detail","order":4}]'::jsonb,
    '["wedding"]'::jsonb,
    true
  ),
  (
    'Pearl Sheath Gown',
    'Carolina Herrera',
    'CH-S201',
    'Pearl White',
    524900,
    'Minimalist pearl-white sheath with bateau neckline and subtle trailing hem. Understated luxury for the modern bride.',
    '[{"url":"/images/wedding/sheath-pearl-01.jpg","alt":"Pearl Sheath front","order":1,"is_primary":true},{"url":"/images/wedding/sheath-pearl-02.jpg","alt":"Pearl Sheath side","order":2},{"url":"/images/wedding/sheath-pearl-03.jpg","alt":"Pearl Sheath back","order":3},{"url":"/images/wedding/sheath-pearl-04.jpg","alt":"Pearl Sheath detail","order":4}]'::jsonb,
    '["wedding"]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;
