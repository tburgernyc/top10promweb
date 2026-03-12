-- ============================================================
-- Top 10 Prom Phase 1 | Seed Data
-- Run AFTER all migrations (0001, 0002) are applied
-- ============================================================

-- ── 5 Boutique Locations ──────────────────────────────────────────────────
INSERT INTO boutiques (id, name, slug, address, city, state, zip, phone, email, timezone, lat, lng) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Top 10 Prom - Atlanta', 'atlanta', '2145 Peachtree Rd NE Suite 100', 'Atlanta', 'GA', '30309', '(404) 555-0101', 'atlanta@top10prom.com', 'America/New_York', 33.8490, -84.3880),
  ('b1000000-0000-0000-0000-000000000002', 'Top 10 Prom - Marietta', 'marietta', '1450 Roswell Rd Suite 200', 'Marietta', 'GA', '30062', '(770) 555-0202', 'marietta@top10prom.com', 'America/New_York', 33.9526, -84.5499),
  ('b1000000-0000-0000-0000-000000000003', 'Top 10 Prom - Alpharetta', 'alpharetta', '5765 North Point Pkwy Suite 150', 'Alpharetta', 'GA', '30022', '(678) 555-0303', 'alpharetta@top10prom.com', 'America/New_York', 34.0754, -84.2941),
  ('b1000000-0000-0000-0000-000000000004', 'Top 10 Prom - Buckhead', 'buckhead', '3500 Piedmont Rd NE Suite 300', 'Atlanta', 'GA', '30305', '(404) 555-0404', 'buckhead@top10prom.com', 'America/New_York', 33.8503, -84.3733),
  ('b1000000-0000-0000-0000-000000000005', 'Top 10 Prom - Demo', 'demo', '100 Showroom Plaza', 'Atlanta', 'GA', '30301', '(800) 555-0000', 'demo@top10prom.com', 'America/New_York', 33.7490, -84.3880)
ON CONFLICT (slug) DO NOTHING;

-- ── Boutique Settings ─────────────────────────────────────────────────────
INSERT INTO boutique_settings (boutique_id, booking_lead_time_hours, max_daily_appointments, appointment_duration_minutes, auto_confirm_bookings, notification_email) VALUES
  ('b1000000-0000-0000-0000-000000000001', 24, 12, 60, false, 'atlanta@top10prom.com'),
  ('b1000000-0000-0000-0000-000000000002', 24, 10, 60, false, 'marietta@top10prom.com'),
  ('b1000000-0000-0000-0000-000000000003', 24, 10, 60, true,  'alpharetta@top10prom.com'),
  ('b1000000-0000-0000-0000-000000000004', 48, 8,  90, false, 'buckhead@top10prom.com'),
  ('b1000000-0000-0000-0000-000000000005', 0,  20, 60, true,  'demo@top10prom.com')
ON CONFLICT (boutique_id) DO NOTHING;

-- ── 10 Sample Dresses ─────────────────────────────────────────────────────
INSERT INTO dresses (id, name, designer, style_number, color, price_cents, description, images, is_active) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Midnight Cascade', 'Jovani', 'JV-2501', 'Midnight Blue', 49900,
   'A floor-length mermaid gown with cascading sequin detailing and a dramatic open back.',
   '[{"url":"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800","alt":"Midnight Cascade front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800","alt":"Midnight Cascade back","order":2},{"url":"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800","alt":"Midnight Cascade detail","order":3},{"url":"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800","alt":"Midnight Cascade full length","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000002', 'Golden Hour', 'Sherri Hill', 'SH-55623', 'Gold', 57900,
   'Strapless A-line ballgown with hand-applied 3D floral embellishments and full tulle skirt.',
   '[{"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800","alt":"Golden Hour front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800","alt":"Golden Hour side","order":2},{"url":"https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800","alt":"Golden Hour detail","order":3},{"url":"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800","alt":"Golden Hour full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000003', 'Rose Illusion', 'La Femme', 'LF-29874', 'Blush Rose', 38500,
   'V-neck sheath dress with sheer lace overlay, illusion bodice, and chapel train.',
   '[{"url":"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800","alt":"Rose Illusion front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800","alt":"Rose Illusion back","order":2},{"url":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800","alt":"Rose Illusion detail","order":3},{"url":"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800","alt":"Rose Illusion full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000004', 'Scarlet Affair', 'Mac Duggal', 'MD-67384', 'Scarlet Red', 62900,
   'Off-shoulder column gown with dramatic thigh-high slit and crystal belt detail.',
   '[{"url":"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800","alt":"Scarlet Affair front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800","alt":"Scarlet Affair side","order":2},{"url":"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800","alt":"Scarlet Affair detail","order":3},{"url":"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800","alt":"Scarlet Affair full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000005', 'Ivory Dream', 'Morilee', 'MO-21456', 'Ivory', 44500,
   'Princess ball gown with heavily beaded bodice, voluminous tulle skirt, and subtle silver accents.',
   '[{"url":"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800","alt":"Ivory Dream front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800","alt":"Ivory Dream back","order":2},{"url":"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800","alt":"Ivory Dream detail","order":3},{"url":"https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800","alt":"Ivory Dream full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000006', 'Emerald Envy', 'Jovani', 'JV-2619', 'Emerald Green', 53900,
   'One-shoulder asymmetric gown with textured ruffle skirt and elegant floor-sweeping hem.',
   '[{"url":"https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800","alt":"Emerald Envy front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800","alt":"Emerald Envy side","order":2},{"url":"https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800","alt":"Emerald Envy back","order":3},{"url":"https://images.unsplash.com/photo-1594938298603-c8148c4b4f40?w=800","alt":"Emerald Envy detail","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000007', 'Midnight Siren', 'Sherri Hill', 'SH-54412', 'Black', 58500,
   'High-neck bodycon sheath with full back cut-out, spaghetti straps, and iridescent sequin finish.',
   '[{"url":"https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800","alt":"Midnight Siren front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1586985289906-406988974504?w=800","alt":"Midnight Siren back","order":2},{"url":"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800","alt":"Midnight Siren detail","order":3},{"url":"https://images.unsplash.com/photo-1558171813-35b1736c2116?w=800","alt":"Midnight Siren full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000008', 'Lavender Fields', 'La Femme', 'LF-30128', 'Lavender', 41500,
   'Flowy chiffon two-piece with floral lace crop top, high-waist palazzo pants, and flared hem.',
   '[{"url":"https://images.unsplash.com/photo-1544441893-675973e31985?w=800","alt":"Lavender Fields front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800","alt":"Lavender Fields side","order":2},{"url":"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800","alt":"Lavender Fields back","order":3},{"url":"https://images.unsplash.com/photo-1553655740-5aba7b39b6d5?w=800","alt":"Lavender Fields full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000009', 'Platinum Princess', 'Mac Duggal', 'MD-49123', 'Silver', 67500,
   'Strapless sweetheart ballgown with all-over crystal embellishment, cathedral train, and corset lacing.',
   '[{"url":"https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800","alt":"Platinum Princess front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800","alt":"Platinum Princess back","order":2},{"url":"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800","alt":"Platinum Princess detail","order":3},{"url":"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800","alt":"Platinum Princess full","order":4}]',
   true),
  ('d1000000-0000-0000-0000-000000000010', 'Coral Sunset', 'Morilee', 'MO-22871', 'Coral', 36900,
   'Romantic floral-appliqué A-line with tulle skirt, sweetheart neckline, and bow-back detail.',
   '[{"url":"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800","alt":"Coral Sunset front","order":1,"is_primary":true},{"url":"https://images.unsplash.com/photo-1561171537-d60a56a62ae0?w=800","alt":"Coral Sunset back","order":2},{"url":"https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800","alt":"Coral Sunset detail","order":3},{"url":"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800","alt":"Coral Sunset full","order":4}]',
   true)
ON CONFLICT (id) DO NOTHING;

-- ── Dress Inventory (all 5 boutiques × 10 dresses) ────────────────────────
INSERT INTO dress_inventory (boutique_id, dress_id, sizes_available, quantity, is_active)
SELECT
  b.id,
  d.id,
  '["0","2","4","6","8","10","12","14","16"]'::jsonb,
  3,
  true
FROM boutiques b
CROSS JOIN dresses d
ON CONFLICT (boutique_id, dress_id) DO NOTHING;
