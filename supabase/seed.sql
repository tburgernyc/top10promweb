-- ── Top 10 Prom · Seed Data ──────────────────────────────────────────────────
-- Run this in your Supabase SQL editor to populate boutiques and sample dresses.
-- Images use Unsplash placeholders — replace with real product photos.

-- ── 1. Boutiques — Top 10 Prom own stores ────────────────────────────────────
INSERT INTO boutiques (id, name, slug, address, city, state, zip, phone, email, timezone, lat, lng, is_active)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Top 10 Prom Marietta',   'marietta',   '1255 Johnson Ferry Rd Suite 804',   'Marietta',   'GA', '30068', '(770) 977-1010', 'marietta@top10prom.com',   'America/New_York', 33.9526, -84.4496, true),
  ('b1000000-0000-0000-0000-000000000002', 'Top 10 Prom Alpharetta', 'alpharetta', '5965 North Point Pkwy Suite 119',   'Alpharetta', 'GA', '30022', '(770) 664-1010', 'alpharetta@top10prom.com', 'America/New_York', 34.0754, -84.2941, true),
  ('b1000000-0000-0000-0000-000000000003', 'Top 10 Prom Buckhead',   'buckhead',   '3393 Peachtree Rd NE Suite 3040',   'Atlanta',    'GA', '30326', '(404) 467-1010', 'buckhead@top10prom.com',   'America/New_York', 33.8490, -84.3640, true),
  ('b1000000-0000-0000-0000-000000000004', 'Top 10 Prom Kennesaw',   'kennesaw',   '2971 Cobb Pkwy NW Suite 101',       'Kennesaw',   'GA', '30152', '(770) 420-1010', 'kennesaw@top10prom.com',   'America/New_York', 34.0234, -84.6154, true),
  ('b1000000-0000-0000-0000-000000000005', 'Top 10 Prom Smyrna',     'smyrna',     '4500 Akers Mill Rd SE Suite 224',   'Smyrna',     'GA', '30080', '(770) 433-1010', 'smyrna@top10prom.com',     'America/New_York', 33.8737, -84.5144, true)
ON CONFLICT (id) DO NOTHING;

-- ── 1b. Boutiques — Authorized network retailers (48 stores) ─────────────────
INSERT INTO boutiques (id, name, slug, address, city, state, zip, timezone, lat, lng, is_active)
VALUES
  ('b2000000-0000-0000-0000-000000000001', 'AB2B Boutique',                          'ab2b-boutique',              '27001 US HWY 19 N, Suite 2022',        'Clearwater',       'FL', '33761', 'America/New_York', 28.0170595,  -82.7355688, true),
  ('b2000000-0000-0000-0000-000000000002', 'The Dress Boutique',                     'the-dress-boutique',         '1348 Java Lane, Suite 105',            'Burlington',       'NC', '27215', 'America/New_York', 36.0683037,  -79.5160632, true),
  ('b2000000-0000-0000-0000-000000000003', 'Wolsfelts Prom & Tux',                   'wolsfelts-prom-tux',         '153 Ashland Ave.',                     'Aurora',           'IL', '60505', 'America/Chicago',  41.7378239,  -88.3272485, true),
  ('b2000000-0000-0000-0000-000000000004', 'Sash Prom',                              'sash-prom',                  '2150 Northwoods Blvd Suite 528-G',     'North Charleston', 'SC', '29406', 'America/New_York', 32.9447225,  -80.0447602, true),
  ('b2000000-0000-0000-0000-000000000005', 'Blue Violet Bridal & Prom',              'blue-violet-bridal-prom',    '32 High St.',                          'Westerly',         'RI', '02891', 'America/New_York', 41.378569,   -71.8304264, true),
  ('b2000000-0000-0000-0000-000000000006', 'Angelique''s',                           'angeliques',                 '10130 Davenport Street NE, Suite 160', 'Blaine',           'MN', '55449', 'America/Chicago',  45.1541228,  -93.2306345, true),
  ('b2000000-0000-0000-0000-000000000007', 'Merle Norman and More',                  'merle-norman-and-more',      '1204 North City Avenue',               'Ripley',           'MS', '38663', 'America/Chicago',  34.7425797,  -88.9480077, true),
  ('b2000000-0000-0000-0000-000000000008', 'Laura''s Too',                           'lauras-too',                 '494 Route 3',                          'Plattsburgh',      'NY', '12901', 'America/New_York', 44.6969365,  -73.4962433, true),
  ('b2000000-0000-0000-0000-000000000009', 'South''s Specialty Clothiers',           'souths-specialty-clothiers', '1180 Blowing Rock Rd., Boone Mall',    'Boone',            'NC', '28607', 'America/New_York', 36.2015574,  -81.6681577, true),
  ('b2000000-0000-0000-0000-000000000010', 'A Pink Boutique',                        'a-pink-boutique',            '201 South Illinois St',                'Honart',           'IN', '46352', 'America/Chicago',  41.53387,    -87.2481699, true),
  ('b2000000-0000-0000-0000-000000000011', 'MB Prom',                                'mb-prom',                    '123 South Urania Avenue',              'Greenburg',        'PA', '15601', 'America/New_York', 40.3022833,  -79.5380539, true),
  ('b2000000-0000-0000-0000-000000000012', 'Arden Bridal & Boutique',                'arden-bridal-boutique',      '171 Westshore Plaza',                  'Tampa',            'FL', '33609', 'America/New_York', 27.9465863,  -82.5268818, true),
  ('b2000000-0000-0000-0000-000000000013', 'My Formals',                             'my-formals',                 '200 Old Rte 66 N',                     'Litchfield',       'IL', '62056', 'America/Chicago',  39.1760584,  -89.6662745, true),
  ('b2000000-0000-0000-0000-000000000014', 'Loyce''s',                               'loyces',                     '101 North Court Square',               'Waverly',          'TN', '37185', 'America/Chicago',  36.083468,   -87.794091,  true),
  ('b2000000-0000-0000-0000-000000000015', 'Elaine''s Wedding Center',               'elaines-green-bay',          'Elaine''s Wedding Center',             'Green Bay',        'WI', '54304', 'America/Chicago',  44.4766082,  -88.0752792, true),
  ('b2000000-0000-0000-0000-000000000016', 'Jarvis Couture',                         'jarvis-couture',             '7264 Old Jacksonville Hwy',            'Tyler',            'TX', '75703', 'America/Chicago',  32.2670616,  -95.3406039, true),
  ('b2000000-0000-0000-0000-000000000017', 'Sarah''s Bridal Gallery',                'sarahs-bridal-gallery',      '207 W. Clay Street',                   'Mount Pleasant',   'IA', '52641', 'America/Chicago',  40.964872,   -91.5560521, true),
  ('b2000000-0000-0000-0000-000000000018', 'Oconee Formal',                          'oconee-formal',              '1431 Capital Ave. Unit 107',           'Watkinsville',     'GA', '30677', 'America/New_York', 33.8694846,  -83.4467842, true),
  ('b2000000-0000-0000-0000-000000000019', 'Elaine''s Wedding Center Appleton',      'elaines-appleton',           '410 N. Mall Drive',                    'Appleton',         'WI', '54913', 'America/Chicago',  44.2656323,  -88.4728329, true),
  ('b2000000-0000-0000-0000-000000000020', 'So Sweet Boutique',                      'so-sweet-boutique',          '1665 Oviedo Mall Blvd.',               'Oviedo',           'FL', '32765', 'America/New_York', 28.6634593,  -81.2335726, true),
  ('b2000000-0000-0000-0000-000000000021', 'Christine''s Bridal',                    'christines-bridal',          '138 Rt 12',                            'Hartland',         'VT', '05049', 'America/New_York', 43.5469393,  -72.4237134, true),
  ('b2000000-0000-0000-0000-000000000022', 'Formals XO King of Prussia',             'formals-xo-kop',             '160 Gulph Road',                       'King of Prussia',  'PA', '19406', 'America/New_York', 40.0892302,  -75.3859145, true),
  ('b2000000-0000-0000-0000-000000000023', 'Rice N Ribbon',                          'rice-n-ribbon',              '415 Main Street',                      'Rockport',         'IN', '47635', 'America/Chicago',  37.8834223,  -87.0490059, true),
  ('b2000000-0000-0000-0000-000000000024', 'Black Tie and White Satin',              'black-tie-white-satin',      '507 North Broad Street',               'Fremont',          'NE', '68025', 'America/Chicago',  41.4341214,  -96.4989561, true),
  ('b2000000-0000-0000-0000-000000000025', 'Oh My Dress',                            'oh-my-dress',                '4821 Shopping Way',                    'Corpus Christi',   'TX', '78411', 'America/Chicago',  27.7134297,  -97.3719206, true),
  ('b2000000-0000-0000-0000-000000000026', 'The Prom Shop',                          'the-prom-shop',              '517 Frontage Road NW',                 'Byron',            'MN', '55920', 'America/Chicago',  44.0294276,  -92.6555894, true),
  ('b2000000-0000-0000-0000-000000000027', 'Glitz & Gowns',                          'glitz-and-gowns',            '225 Kent Stone Blvd.',                 'Alabaster',        'AL', '35007', 'America/Chicago',  33.2143053,  -86.8232131, true),
  ('b2000000-0000-0000-0000-000000000028', 'Lillian''s Prom',                        'lillians-prom',              '19 East Main St.',                     'Peru',             'IN', '46970', 'America/New_York', 40.7538285,  -86.0680029, true),
  ('b2000000-0000-0000-0000-000000000029', 'Silver Spoon Formals',                   'silver-spoon-formals',       '320 East Fourth Street',               'London',           'KY', '40741', 'America/New_York', 37.1301187,  -84.078515,  true),
  ('b2000000-0000-0000-0000-000000000030', 'Bridal Novias',                          'bridal-novias',              '6974 Gateway Blvd',                    'El Paso',          'TX', '79915', 'America/Denver',   31.7718468,  -106.3800836,true),
  ('b2000000-0000-0000-0000-000000000031', 'Carrie''s Prom & Tux',                   'carries-prom-tux',           '713 West Saint Germain St.',           'Saint Cloud',      'MN', '56301', 'America/Chicago',  45.5601204,  -94.161235,  true),
  ('b2000000-0000-0000-0000-000000000032', 'Maggies Bridal & Prom',                  'maggies-bridal-prom',        '2975 W Market St',                     'Fairlawn',         'OH', '44333', 'America/New_York', 41.1285231,  -81.6093375, true),
  ('b2000000-0000-0000-0000-000000000033', 'RashawnRose Bridal and Prom',            'rashawnrose',                '12920 W State Road 84',                'Davie',            'FL', '33325', 'America/New_York', 26.115484,   -80.321388,  true),
  ('b2000000-0000-0000-0000-000000000034', 'The Bridal Connection / Prom Connection','bridal-connection-ankeny',   '708 N Ankeny Blvd',                    'Ankeny',           'IA', '50023', 'America/Chicago',  41.7376551,  -93.6014599, true),
  ('b2000000-0000-0000-0000-000000000035', 'First Impressions',                      'first-impressions-ar',       '500 Madden Road, Suite C',             'Jacksonville',     'AR', '72076', 'America/Chicago',  34.8892456,  -92.1036571, true),
  ('b2000000-0000-0000-0000-000000000036', 'Unique Lady',                            'unique-lady',                '25000 Southfield Rd',                  'Southfield',       'MI', '48075', 'America/Detroit',  42.4735929,  -83.22061,   true),
  ('b2000000-0000-0000-0000-000000000037', '125 Bridal Prom & Tux',                  '125-bridal-prom-tux',        '37 Plaistow Rd',                       'Plaistow',         'NH', '03865', 'America/New_York', 42.8227643,  -71.103909,  true),
  ('b2000000-0000-0000-0000-000000000038', 'Fiancee Minot',                          'fiancee-minot',              '6 Main St S',                          'Minot',            'ND', '58701', 'America/Chicago',  48.2362646,  -101.2932458,true),
  ('b2000000-0000-0000-0000-000000000039', 'Fancy Frocks Bridal Prom Tuxedo',        'fancy-frocks',               '820 Inlet Square Dr',                  'Murrells Inlet',   'SC', '29576', 'America/New_York', 33.5816624,  -79.0215517, true),
  ('b2000000-0000-0000-0000-000000000040', 'Best Bride Prom & Tux',                  'best-bride-asheville',       '800 Fairview Rd. Suite A-1',           'Asheville',        'NC', '28803', 'America/New_York', 35.5704168,  -82.5074949, true),
  ('b2000000-0000-0000-0000-000000000041', 'Ashley Rene''s',                         'ashley-renes',               '7135 Heritage Square Dr.',             'Granger',          'IN', '46530', 'America/New_York', 41.7255821,  -86.176209,  true),
  ('b2000000-0000-0000-0000-000000000042', 'Signatures Formal Boutique',             'signatures-formal',          '1855 N. 25th St',                      'Middlesboro',      'KY', '40965', 'America/New_York', 36.6235665,  -83.7057322, true),
  ('b2000000-0000-0000-0000-000000000043', 'Cloud Nine Bridal Boutique',             'cloud-nine-peoria',          '4711 N. University St.',               'Peoria',           'IL', '61614', 'America/Chicago',  40.7449776,  -89.6130892, true),
  ('b2000000-0000-0000-0000-000000000044', 'Anitra''s',                              'anitras',                    '811 North 4th St.',                    'Monroe',           'LA', '71201', 'America/Chicago',  32.5098572,  -92.1203046, true),
  ('b2000000-0000-0000-0000-000000000045', 'Michelle''s Formal Wear',                'michelles-formal-wear',      '101 S Burwell Ave',                    'Adel',             'GA', '31620', 'America/New_York', 31.1367305,  -83.4239978, true),
  ('b2000000-0000-0000-0000-000000000046', 'Ella Blu',                               'ella-blu',                   '5410 N. Mesa',                         'El Paso',          'TX', '79912', 'America/Denver',   31.8193786,  -106.5163572,true),
  ('b2000000-0000-0000-0000-000000000047', 'CTO Prom & Formal',                      'cto-prom-formal',            '7475 Douglas Blvd Ste 102',            'Douglasville',     'GA', '30135', 'America/New_York', 33.7228829,  -84.7701038, true),
  ('b2000000-0000-0000-0000-000000000048', 'Formals XO',                             'formals-xo',                 '2300 Lincoln Hwy, Oxford Valley Mall', 'Langhorne',        'PA', '19047', 'America/New_York', 40.1838453,  -74.8804078, true)
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
