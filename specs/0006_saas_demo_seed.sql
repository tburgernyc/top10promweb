-- ==============================================================================
-- Migration: 0006_saas_demo_seed.sql
-- Purpose: Populate the database with realistic demo data for CEO walkthrough.
-- Password for ALL demo accounts: DemoProm2026!
-- ==============================================================================
-- IMPORTANT: Run this AFTER 0005_rbac_and_clienteling.sql has been applied.
-- Run this in Supabase Dashboard → SQL Editor.
-- ==============================================================================

-- Use pgcrypto for password hashing (enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fixed UUIDs for predictability across runs
DO $$
DECLARE
  -- Auth User IDs
  uid_super_admin   UUID := 'a0000000-0000-0000-0000-000000000001';
  uid_owner_nyc     UUID := 'a0000000-0000-0000-0000-000000000002';
  uid_owner_tx      UUID := 'a0000000-0000-0000-0000-000000000003';
  uid_owner_fl      UUID := 'a0000000-0000-0000-0000-000000000004';
  uid_mgr_nyc       UUID := 'a0000000-0000-0000-0000-000000000005';
  uid_assoc_nyc_1   UUID := 'a0000000-0000-0000-0000-000000000006';
  uid_assoc_nyc_2   UUID := 'a0000000-0000-0000-0000-000000000007';
  uid_mgr_tx        UUID := 'a0000000-0000-0000-0000-000000000008';
  uid_assoc_tx_1    UUID := 'a0000000-0000-0000-0000-000000000009';

  -- Boutique IDs
  bid_nyc  UUID := 'b0000000-0000-0000-0000-000000000001';
  bid_tx   UUID := 'b0000000-0000-0000-0000-000000000002';
  bid_fl   UUID := 'b0000000-0000-0000-0000-000000000003';

  -- Store Customer IDs
  cid_01 UUID := 'c0000000-0000-0000-0000-000000000001';
  cid_02 UUID := 'c0000000-0000-0000-0000-000000000002';
  cid_03 UUID := 'c0000000-0000-0000-0000-000000000003';
  cid_04 UUID := 'c0000000-0000-0000-0000-000000000004';
  cid_05 UUID := 'c0000000-0000-0000-0000-000000000005';
  cid_06 UUID := 'c0000000-0000-0000-0000-000000000006';
  cid_07 UUID := 'c0000000-0000-0000-0000-000000000007';
  cid_08 UUID := 'c0000000-0000-0000-0000-000000000008';
  cid_09 UUID := 'c0000000-0000-0000-0000-000000000009';
  cid_10 UUID := 'c0000000-0000-0000-0000-000000000010';

  hashed_pw TEXT := crypt('DemoProm2026!', gen_salt('bf'));

BEGIN

  -- ============================================================================
  -- 1. AUTH USERS
  -- ============================================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    role, aud, confirmation_token, recovery_token
  ) VALUES
    -- SUPER ADMIN
    (uid_super_admin, '00000000-0000-0000-0000-000000000000',
     'ceo@top10prom.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"SUPER_ADMIN","provider":"email","providers":["email"]}',
     '{"full_name":"Alex Rivera"}',
     'authenticated', 'authenticated', '', ''),
    -- OWNER NYC
    (uid_owner_nyc, '00000000-0000-0000-0000-000000000000',
     'owner@glamourpromnyc.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000001","store_role":"OWNER","provider":"email","providers":["email"]}',
     '{"full_name":"Maria Santos"}',
     'authenticated', 'authenticated', '', ''),
    -- OWNER TX
    (uid_owner_tx, '00000000-0000-0000-0000-000000000000',
     'owner@texaspageant.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000002","store_role":"OWNER","provider":"email","providers":["email"]}',
     '{"full_name":"Jake Morrison"}',
     'authenticated', 'authenticated', '', ''),
    -- OWNER FL
    (uid_owner_fl, '00000000-0000-0000-0000-000000000000',
     'owner@sunshineballgowns.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000003","store_role":"OWNER","provider":"email","providers":["email"]}',
     '{"full_name":"Diane Fontaine"}',
     'authenticated', 'authenticated', '', ''),
    -- NYC MANAGER
    (uid_mgr_nyc, '00000000-0000-0000-0000-000000000000',
     'manager@glamourpromnyc.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000001","store_role":"MANAGER","provider":"email","providers":["email"]}',
     '{"full_name":"Priya Nair"}',
     'authenticated', 'authenticated', '', ''),
    -- NYC ASSOCIATE 1
    (uid_assoc_nyc_1, '00000000-0000-0000-0000-000000000000',
     'jessica@glamourpromnyc.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000001","store_role":"ASSOCIATE","provider":"email","providers":["email"]}',
     '{"full_name":"Jessica Wu"}',
     'authenticated', 'authenticated', '', ''),
    -- NYC ASSOCIATE 2
    (uid_assoc_nyc_2, '00000000-0000-0000-0000-000000000000',
     'tyrone@glamourpromnyc.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000001","store_role":"ASSOCIATE","provider":"email","providers":["email"]}',
     '{"full_name":"Tyrone Adams"}',
     'authenticated', 'authenticated', '', ''),
    -- TX MANAGER
    (uid_mgr_tx, '00000000-0000-0000-0000-000000000000',
     'manager@texaspageant.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000002","store_role":"MANAGER","provider":"email","providers":["email"]}',
     '{"full_name":"Carlos Reyes"}',
     'authenticated', 'authenticated', '', ''),
    -- TX ASSOCIATE
    (uid_assoc_tx_1, '00000000-0000-0000-0000-000000000000',
     'brittany@texaspageant.com', hashed_pw,
     NOW(), NOW(), NOW(),
     '{"system_role":"USER","store_id":"b0000000-0000-0000-0000-000000000002","store_role":"ASSOCIATE","provider":"email","providers":["email"]}',
     '{"full_name":"Brittany Cole"}',
     'authenticated', 'authenticated', '', '')
  ON CONFLICT (id) DO NOTHING;

  -- ============================================================================
  -- 2. PUBLIC PROFILES
  -- ============================================================================
  INSERT INTO public.profiles (id, email, full_name, system_role) VALUES
    (uid_super_admin, 'ceo@top10prom.com',           'Alex Rivera',    'SUPER_ADMIN'),
    (uid_owner_nyc,   'owner@glamourpromnyc.com',    'Maria Santos',   'USER'),
    (uid_owner_tx,    'owner@texaspageant.com',       'Jake Morrison',  'USER'),
    (uid_owner_fl,    'owner@sunshineballgowns.com',  'Diane Fontaine', 'USER'),
    (uid_mgr_nyc,     'manager@glamourpromnyc.com',  'Priya Nair',     'USER'),
    (uid_assoc_nyc_1, 'jessica@glamourpromnyc.com',  'Jessica Wu',     'USER'),
    (uid_assoc_nyc_2, 'tyrone@glamourpromnyc.com',   'Tyrone Adams',   'USER'),
    (uid_mgr_tx,      'manager@texaspageant.com',    'Carlos Reyes',   'USER'),
    (uid_assoc_tx_1,  'brittany@texaspageant.com',   'Brittany Cole',  'USER')
  ON CONFLICT (id) DO NOTHING;

  -- ============================================================================
  -- 3. BOUTIQUES
  -- ============================================================================
  INSERT INTO public.boutiques (id, name, slug, city, state, phone, email, timezone, is_active, subscription_status) VALUES
    (bid_nyc, 'Glamour Prom NYC',     'glamour-prom-nyc',     'New York',   'NY', '(212) 555-0101', 'info@glamourpromnyc.com',    'America/New_York',    true, 'ACTIVE'),
    (bid_tx,  'Texas Pageant Co.',    'texas-pageant-co',     'Dallas',     'TX', '(214) 555-0202', 'info@texaspageant.com',       'America/Chicago',     true, 'ACTIVE'),
    (bid_fl,  'Sunshine Ball Gowns',  'sunshine-ball-gowns',  'Miami',      'FL', '(305) 555-0303', 'info@sunshineballgowns.com',  'America/New_York',    true, 'PAST_DUE')
  ON CONFLICT (id) DO NOTHING;

  -- ============================================================================
  -- 4. STORE STAFF (Junction Table)
  -- ============================================================================
  INSERT INTO public.store_staff (user_id, store_id, role, is_active) VALUES
    (uid_owner_nyc,   bid_nyc, 'OWNER',     true),
    (uid_mgr_nyc,     bid_nyc, 'MANAGER',   true),
    (uid_assoc_nyc_1, bid_nyc, 'ASSOCIATE', true),
    (uid_assoc_nyc_2, bid_nyc, 'ASSOCIATE', true),
    (uid_owner_tx,    bid_tx,  'OWNER',     true),
    (uid_mgr_tx,      bid_tx,  'MANAGER',   true),
    (uid_assoc_tx_1,  bid_tx,  'ASSOCIATE', true),
    (uid_owner_fl,    bid_fl,  'OWNER',     true)
  ON CONFLICT (user_id, store_id) DO NOTHING;

  -- ============================================================================
  -- 5. STORE CUSTOMERS (Localized CRM — NYC Boutique)
  -- ============================================================================
  INSERT INTO public.store_customers (id, store_id, first_name, last_name, phone, email, notes) VALUES
    (cid_01, bid_nyc, 'Emma',      'Rodriguez',  '(917) 555-1001', 'emma.r@email.com',     'Loves Sherri Hill. Looking for red or rose gold. Size 4.'),
    (cid_02, bid_nyc, 'Sophia',    'Chen',       '(917) 555-1002', 'sophia.c@email.com',   'Interested in Jovani. Budget $600. Prefers A-line silhouette.'),
    (cid_03, bid_nyc, 'Aaliyah',   'Johnson',    '(917) 555-1003', 'aaliyah.j@email.com',  'Walk-in — came with mom. Looking for something unique, non-traditional.'),
    (cid_04, bid_nyc, 'Olivia',    'Martinez',   '(347) 555-1004', NULL,                   'Missed first appointment. Called to reschedule — very interested.'),
    (cid_05, bid_nyc, 'Isabella',  'Kim',        '(646) 555-1005', 'bella.k@email.com',    'Purchased Sherri Hill 54861 in Fuchsia. Needs alterations by April 15.'),
    (cid_06, bid_nyc, 'Mia',       'Thompson',   '(917) 555-1006', 'mia.t@email.com',      'Browsed — not sure yet. Follow up in 2 weeks.'),
    -- Texas Boutique Customers
    (cid_07, bid_tx,  'Madison',   'Williams',   '(214) 555-2001', 'maddy.w@email.com',    'Pageant competitor. Looking for Ashley Lauren. Very specific about neckline.'),
    (cid_08, bid_tx,  'Chloe',     'Davis',      '(972) 555-2002', 'chloe.d@email.com',    'Sweet 16 dress. Mom wants formal, daughter wants edgy. Budget $500.'),
    (cid_09, bid_tx,  'Avery',     'Wilson',     '(214) 555-2003', NULL,                   'Walk-in. Group prom shopping with 3 friends. No appointment needed.'),
    (cid_10, bid_tx,  'Zoe',       'Anderson',   '(469) 555-2004', 'zoe.a@email.com',      'Returning customer — bought from us last year. Wants something different.')
  ON CONFLICT (id) DO NOTHING;

  -- ============================================================================
  -- 6. APPOINTMENTS (Mix of statuses for realistic demo)
  -- ============================================================================
  INSERT INTO public.appointments (
    store_id, store_customer_id, appointment_date,
    appointment_type, status, notes, sales_feedback
  ) VALUES
    -- NYC — Completed with purchase
    (bid_nyc, cid_05, NOW() - INTERVAL '3 days',  'APPOINTMENT', 'COMPLETED',    'Try-on session',                     'Purchased Sherri Hill 54861 Fuchsia size 4. Total $589.'),
    (bid_nyc, cid_01, NOW() - INTERVAL '5 days',  'APPOINTMENT', 'COMPLETED',    'First visit — very enthusiastic',    'Tried on 4 Sherri Hill gowns. Returning Saturday to decide.'),
    -- NYC — Walk-ins (recent)
    (bid_nyc, cid_03, NOW() - INTERVAL '1 day',   'WALK_IN',     'IN_PROGRESS',  'Walked in at 2pm with her mom',      NULL),
    (bid_nyc, cid_06, NOW() - INTERVAL '2 days',  'WALK_IN',     'COMPLETED',    'Quick browse session',               'Did not purchase. Follow-up recommended in 2 weeks.'),
    -- NYC — No-Shows
    (bid_nyc, cid_04, NOW() - INTERVAL '7 days',  'APPOINTMENT', 'NO_SHOW',      '2pm appointment — did not show',     NULL),
    (bid_nyc, cid_02, NOW() - INTERVAL '4 days',  'APPOINTMENT', 'NO_SHOW',      'Called 30min before — no answer',    NULL),
    -- NYC — Upcoming
    (bid_nyc, cid_01, NOW() + INTERVAL '2 days',  'APPOINTMENT', 'SCHEDULED',    'Return visit to make final decision', NULL),
    (bid_nyc, cid_02, NOW() + INTERVAL '3 days',  'APPOINTMENT', 'SCHEDULED',    'Rescheduled from last week',         NULL),

    -- Texas — Mix of statuses
    (bid_tx, cid_07, NOW() - INTERVAL '2 days',   'APPOINTMENT', 'COMPLETED',    'Full try-on session — 6 gowns',      'Purchased Ashley Lauren 11291 in Champagne. Total $712.'),
    (bid_tx, cid_08, NOW() - INTERVAL '6 days',   'APPOINTMENT', 'COMPLETED',    'Mom and daughter appointment',       'No purchase. Budget mismatch — will return with higher budget.'),
    (bid_tx, cid_09, NOW() - INTERVAL '1 day',    'WALK_IN',     'COMPLETED',    'Group of 4 friends',                 'One purchase in the group — Jovani gown $499.'),
    (bid_tx, cid_10, NOW() - INTERVAL '3 days',   'APPOINTMENT', 'NO_SHOW',      'Returning customer no-show',         NULL),
    (bid_tx, cid_07, NOW() + INTERVAL '5 days',   'APPOINTMENT', 'SCHEDULED',    'Follow-up to confirm alterations',   NULL),
    (bid_tx, cid_10, NOW() + INTERVAL '1 day',    'APPOINTMENT', 'SCHEDULED',    'Rescheduled — confirmed via phone',  NULL),

    -- FL — Fewer entries (PAST_DUE boutique — less active)
    (bid_fl, NULL,   NOW() - INTERVAL '14 days',  'WALK_IN',     'COMPLETED',    'Walk-in — no CRM record created',    'Sold 1 gown.'),
    (bid_fl, NULL,   NOW() - INTERVAL '20 days',  'APPOINTMENT', 'NO_SHOW',      '3pm appointment — no show',          NULL)

  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- VERIFICATION QUERY — Run this to confirm seed data was inserted:
-- ============================================================================
-- SELECT 'boutiques' AS table_name, COUNT(*) FROM boutiques
-- UNION ALL SELECT 'store_staff', COUNT(*) FROM store_staff
-- UNION ALL SELECT 'store_customers', COUNT(*) FROM store_customers
-- UNION ALL SELECT 'appointments', COUNT(*) FROM appointments;
