-- ── Top 10 Prom · Seed Data ──────────────────────────────────────────────────
-- Run this in your Supabase SQL editor to populate boutiques and sample dresses.
-- Images use Unsplash placeholders — replace with real product photos.

-- ── 1. Boutiques ─────────────────────────────────────────────────────────────
INSERT INTO boutiques (id, name, slug, address, city, state, zip, phone, email, timezone, lat, lng, is_active)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Top 10 Prom Marietta',   'marietta',   '1255 Johnson Ferry Rd Suite 804',   'Marietta',   'GA', '30068', '(770) 977-1010', 'marietta@top10prom.com',   'America/New_York', 33.9526, -84.4496, true),
  ('b1000000-0000-0000-0000-000000000002', 'Top 10 Prom Alpharetta', 'alpharetta', '5965 North Point Pkwy Suite 119',   'Alpharetta', 'GA', '30022', '(770) 664-1010', 'alpharetta@top10prom.com', 'America/New_York', 34.0754, -84.2941, true),
  ('b1000000-0000-0000-0000-000000000003', 'Top 10 Prom Buckhead',   'buckhead',   '3393 Peachtree Rd NE Suite 3040',   'Atlanta',    'GA', '30326', '(404) 467-1010', 'buckhead@top10prom.com',   'America/New_York', 33.8490, -84.3640, true),
  ('b1000000-0000-0000-0000-000000000004', 'Top 10 Prom Kennesaw',   'kennesaw',   '2971 Cobb Pkwy NW Suite 101',       'Kennesaw',   'GA', '30152', '(770) 420-1010', 'kennesaw@top10prom.com',   'America/New_York', 34.0234, -84.6154, true),
  ('b1000000-0000-0000-0000-000000000005', 'Top 10 Prom Smyrna',     'smyrna',     '4500 Akers Mill Rd SE Suite 224',   'Smyrna',     'GA', '30080', '(770) 433-1010', 'smyrna@top10prom.com',     'America/New_York', 33.8737, -84.5144, true)
ON CONFLICT (id) DO NOTHING;

-- ── 2. Dresses — Johnathan Kayne ─────────────────────────────────────────────
INSERT INTO dresses (id, name, designer, style_number, color, price_cents, description, images, event_types, is_active)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Sequin Mermaid Gown', 'Johnathan Kayne', '3315', 'Gold',
   42900, 'Glamorous fully-sequined mermaid silhouette with a dramatic flared hem. Intricate goldwork throughout.',
   '[{"url":"https://images.unsplash.com/photo-1566479179-c3b76e6b3f6e?w=800","alt":"Gold sequin mermaid gown","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),
  ('d1000000-0000-0000-0000-000000000002', 'Feather Trim Ball Gown', 'Johnathan Kayne', '3244', 'Ivory',
   52500, 'Luxurious ball gown with feather-trimmed hem and sweetheart neckline. Structured corset bodice.',
   '[{"url":"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800","alt":"Ivory feather ball gown","order":1,"is_primary":true}]'::jsonb,
   '["prom","wedding"]'::jsonb, true),
  ('d1000000-0000-0000-0000-000000000003', 'Beaded A-Line Gown', 'Johnathan Kayne', '3209', 'Navy Blue',
   38900, 'Elegant A-line silhouette with intricate hand-beaded bodice and flowy chiffon skirt.',
   '[{"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800","alt":"Navy beaded A-line gown","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),

-- ── Ashley Lauren ────────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000004', 'Hand-Beaded Column Gown', 'Ashley Lauren', '11236', 'Silver',
   48000, 'Fully hand-beaded column gown with timeless elegance. Meticulous bead placement creates a luminous effect.',
   '[{"url":"https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800","alt":"Silver hand-beaded column gown","order":1,"is_primary":true}]'::jsonb,
   '["prom","wedding"]'::jsonb, true),
  ('d1000000-0000-0000-0000-000000000005', 'Crystal Embellished Ballgown', 'Ashley Lauren', '11751', 'Blush',
   56000, 'Breathtaking ballgown with thousands of hand-applied crystals on a blush tulle skirt.',
   '[{"url":"https://images.unsplash.com/photo-1519657337289-077653f724ed?w=800","alt":"Blush crystal ballgown","order":1,"is_primary":true}]'::jsonb,
   '["prom","wedding"]'::jsonb, true),

-- ── Jessica Angel ────────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000006', 'Bold Cutout Dress', 'Jessica Angel', '727R', 'Red',
   32900, 'Striking cutout design with bold silhouette and dramatic back detail. Built for the confident wearer.',
   '[{"url":"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800","alt":"Red cutout dress","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),
  ('d1000000-0000-0000-0000-000000000007', 'Glitter Mermaid Dress', 'Jessica Angel', '880', 'Black',
   35500, 'Head-to-toe glitter fabric in a figure-hugging mermaid cut with high slit and ruched detailing.',
   '[{"url":"https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800","alt":"Black glitter mermaid dress","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),

-- ── Kate Parker ──────────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000008', 'Tulle Princess Gown', 'Kate Parker', '26034', 'Light Blue',
   28900, 'Youthful and playful multi-layer tulle princess silhouette with embellished bodice.',
   '[{"url":"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800","alt":"Light blue tulle princess gown","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),
  ('d1000000-0000-0000-0000-000000000009', 'Floral Print Maxi', 'Kate Parker', '26080', 'Multicolor',
   24500, 'Vibrant floral print with modern wrap silhouette. Eye-catching pattern in a flattering maxi length.',
   '[{"url":"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800","alt":"Floral print maxi dress","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),

-- ── Chandalier ───────────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000010', 'LA Slit Gown', 'Chandalier', '30081', 'Black',
   36800, 'Sleek LA-designed floor-length gown with dramatic thigh slit and daring low back. Fluid crepe fabric.',
   '[{"url":"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800","alt":"Black LA slit gown","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),
  ('d1000000-0000-0000-0000-000000000011', 'Velvet Cowl Neck Dress', 'Chandalier', '30108', 'Plum',
   33200, 'Luxurious stretch velvet with elegant cowl neckline. Designed and manufactured in Los Angeles.',
   '[{"url":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800","alt":"Plum velvet cowl neck dress","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true),

-- ── 2Cute Homecoming ─────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000012', 'Sequin Mini Dress', '2Cute Homecoming', '33558', 'Hot Pink',
   18900, 'Flirty all-over sequin mini with flattering ruched sides. The ultimate homecoming statement.',
   '[{"url":"https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800","alt":"Hot pink sequin mini dress","order":1,"is_primary":true}]'::jsonb,
   '["prom"]'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- ── 3. Dress Inventory — link dresses to boutiques ───────────────────────────
INSERT INTO dress_inventory (dress_id, boutique_id, is_active)
SELECT d.id, b.id, true
FROM dresses d, boutiques b
WHERE d.id LIKE 'd1000000%' AND b.id LIKE 'b1000000%'
ON CONFLICT DO NOTHING;
