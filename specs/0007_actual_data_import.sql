-- ==============================================================================
-- Migration: 0007_actual_data_import.sql
-- Purpose: Import real Top 10 Prom boutique locations and full dress catalog.
-- Sources:
--   - lib/data/boutiques.ts  → Top 10 Prom franchise locations (fixed UUIDs)
--   - public/data/stores.json → Network partner boutiques
--   - lib/data/dresses.ts    → Full dress catalog (fixed UUIDs)
-- Run AFTER 0005 (boutiques and dresses tables must exist).
-- Safe to re-run: uses ON CONFLICT DO NOTHING throughout.
-- ==============================================================================


-- ============================================================================
-- 1. TOP 10 PROM FRANCHISE LOCATIONS
-- Source: lib/data/boutiques.ts
-- ============================================================================
INSERT INTO public.boutiques (id, name, slug, address, city, state, zip, phone, lat, lng, is_active, subscription_status)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Top 10 Prom Marietta',   'marietta',   '1255 Johnson Ferry Rd Suite 804',  'Marietta',   'GA', '30068', '(770) 977-1010', 33.9526, -84.4496, true, 'ACTIVE'),
  ('b1000000-0000-0000-0000-000000000002', 'Top 10 Prom Alpharetta', 'alpharetta', '5965 North Point Pkwy Suite 119',  'Alpharetta', 'GA', '30022', '(770) 664-1010', 34.0754, -84.2941, true, 'ACTIVE'),
  ('b1000000-0000-0000-0000-000000000003', 'Top 10 Prom Buckhead',   'buckhead',   '3393 Peachtree Rd NE Suite 3040',  'Atlanta',    'GA', '30326', '(404) 467-1010', 33.8490, -84.3640, true, 'ACTIVE'),
  ('b1000000-0000-0000-0000-000000000004', 'Top 10 Prom Kennesaw',   'kennesaw',   '2971 Cobb Pkwy NW Suite 101',      'Kennesaw',   'GA', '30152', '(770) 420-1010', 34.0234, -84.6154, true, 'ACTIVE'),
  ('b1000000-0000-0000-0000-000000000005', 'Top 10 Prom Smyrna',     'smyrna',     '4500 Akers Mill Rd SE Suite 224',  'Smyrna',     'GA', '30080', '(770) 433-1010', 33.8737, -84.5144, true, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 2. NETWORK PARTNER BOUTIQUES
-- Source: public/data/stores.json
-- No fixed UUIDs — slugs are unique identifiers for idempotency.
-- ============================================================================
INSERT INTO public.boutiques (name, slug, address, city, state, zip, lat, lng, is_active, subscription_status)
VALUES
  ('AB2B Boutique',                           'ab2b-boutique',                    '27001 US HWY 19 N Suite 2022',         'Clearwater',       'FL', '33761', 28.0170595,  -82.7355688,  true, 'ACTIVE'),
  ('The Dress Boutique',                      'the-dress-boutique',               '1348 Java Lane Suite 105',             'Burlington',       'NC', '27215', 36.0683037,  -79.5160632,  true, 'ACTIVE'),
  ('Wolsfelts Prom & Tux',                   'wolsfelts-prom-tux',               '153 Ashland Ave.',                     'Aurora',           'IL', '60505', 41.7378239,  -88.3272485,  true, 'ACTIVE'),
  ('Sash Prom',                               'sash-prom',                        '2150 Northwoods Blvd Suite 528-G',     'North Charleston', 'SC', '29406', 32.9447225,  -80.0447602,  true, 'ACTIVE'),
  ('Blue Violet Bridal & Prom',              'blue-violet-bridal-prom',          '32 High St.',                          'Westerly',         'RI', '02891', 41.3785690,  -71.8304264,  true, 'ACTIVE'),
  ('Angelique''s',                            'angeliques-bridal',                '10130 Davenport Street NE Suite 160',  'Blaine',           'MN', '55449', 45.1541228,  -93.2306345,  true, 'ACTIVE'),
  ('Merle Norman and More',                   'merle-norman-ripley',              '1204 North City Avenue',               'Ripley',           'MS', '38663', 34.7425797,  -88.9480077,  true, 'ACTIVE'),
  ('Laura''s Too',                            'lauras-too',                       '494 Route 3',                          'Plattsburgh',      'NY', '12901', 44.6969365,  -73.4962433,  true, 'ACTIVE'),
  ('South''s Specialty Clothiers',            'souths-specialty-clothiers',       'Boone Mall, 1180 Blowing Rock Rd.',    'Boone',            'NC', '28607', 36.2015574,  -81.6681577,  true, 'ACTIVE'),
  ('A Pink Boutique',                         'a-pink-boutique',                  '201 South Illinois St',                'Honart',           'IN', '46352', 41.5338700,  -87.2481699,  true, 'ACTIVE'),
  ('MB Prom',                                 'mb-prom',                          '123 South Urania Avenue',              'Greenburg',        'PA', '15601', 40.3022833,  -79.5380539,  true, 'ACTIVE'),
  ('Arden Bridal & Boutique',                'arden-bridal-boutique',            '171 Westshore Plaza',                  'Tampa',            'FL', '33609', 27.9465863,  -82.5268818,  true, 'ACTIVE'),
  ('My Formals',                              'my-formals',                       '200 Old Rte 66 N',                     'Lichfield',        'IL', '62056', 39.1760584,  -89.6662745,  true, 'ACTIVE'),
  ('Loyce''s',                                'loyces',                           '101 North Court Square',               'Waverly',          'TN', '37185', 36.0834680,  -87.7940910,  true, 'ACTIVE'),
  ('Elaine''s Wedding Center',               'elaines-wedding-center-green-bay', NULL,                                   'Green Bay',        'WI', '54304', 44.4766082,  -88.0752792,  true, 'ACTIVE'),
  ('Jarvis Couture',                          'jarvis-couture',                   '7264 Old Jacksonville Hwy',            'Tyler',            'TX', '75703', 32.2670616,  -95.3406039,  true, 'ACTIVE'),
  ('Sarah''s Bridal Gallery',                 'sarahs-bridal-gallery',            '207 W. Clay Street',                   'Mount Pleasant',   'IA', '52641', 40.9648720,  -91.5560521,  true, 'ACTIVE'),
  ('Oconee Formal',                           'oconee-formal',                    '1431 Capital Ave. Unit 107',           'Watkinsville',     'GA', '30677', 33.8694846,  -83.4467842,  true, 'ACTIVE'),
  ('Elaine''s Wedding Center Appleton',      'elaines-wedding-center-appleton',  '410 N. Mall Drive',                    'Appleton',         'WI', '54913', 44.2656323,  -88.4728329,  true, 'ACTIVE'),
  ('So Sweet Boutique',                       'so-sweet-boutique',                '1665 Oviedo Mall Blvd.',               'Oviedo',           'FL', '32765', 28.6634593,  -81.2335726,  true, 'ACTIVE'),
  ('Christine''s Bridal',                     'christines-bridal',                '138 Rt 12',                            'Hartland',         'VT', '05049', 43.5469393,  -72.4237134,  true, 'ACTIVE'),
  ('Formals XO 2',                            'formals-xo-2',                     '160 Gulph Road',                       'King of Prussia',  'PA', '19406', 40.0892302,  -75.3859145,  true, 'ACTIVE'),
  ('Rice N Ribbon',                           'rice-n-ribbon',                    '415 Main Street',                      'Rockport',         'IN', '47635', 37.8834223,  -87.0490059,  true, 'ACTIVE'),
  ('Black Tie and White Satin',               'black-tie-white-satin',            '507 North Broad Street',               'Fremont',          'NE', '68025', 41.4341214,  -96.4989561,  true, 'ACTIVE'),
  ('Oh My Dress',                             'oh-my-dress',                      '4821 Shaopping Way',                   'Corpus Christi',   'TX', '78411', 27.7134297,  -97.3719206,  true, 'ACTIVE'),
  ('The Prom Shop',                           'the-prom-shop',                    '517 Frontage Road NW',                 'Byron',            'MN', '55920', 44.0294276,  -92.6555894,  true, 'ACTIVE'),
  ('Glitz & Gowns',                          'glitz-and-gowns',                  '225 Kent Stone Blvd.',                 'Alabaster',        'AL', '35007', 33.2143053,  -86.8232131,  true, 'ACTIVE'),
  ('Lillian''s Prom',                         'lillians-prom',                    '19 East Main St.',                     'Peru',             'IN', '46970', 40.7538285,  -86.0680029,  true, 'ACTIVE'),
  ('Silver Spoon Formals',                    'silver-spoon-formals',             '320 East Fourth Street',               'London',           'KY', '40741', 37.1301187,  -84.0785150,  true, 'ACTIVE'),
  ('Bridal Novias',                           'bridal-novias',                    '6974 Gateway Blvd',                    'El Paso',          'TX', '79915', 31.7718468,  -106.3800836, true, 'ACTIVE'),
  ('Carrie''s Prom & Tux',                   'carries-prom-tux',                 '713 West Saint Germain St.',           'Saint Cloud',      'MN', '56301', 45.5601204,  -94.1612350,  true, 'ACTIVE'),
  ('Maggies Bridal & Prom',                  'maggies-bridal-prom',              '2975 W Market St',                     'Fairlawn',         'OH', '44333', 41.1285231,  -81.6093375,  true, 'ACTIVE'),
  ('RashawnRose Bridal and Prom',             'rashawnrose-bridal-prom',          '12920 W State Road 84',                'Davie',            'FL', '33325', 26.1154840,  -80.3213880,  true, 'ACTIVE'),
  ('The Bridal Connection / Prom Connection', 'bridal-connection-ankeny',         '708 N Ankeny Blvd',                    'Ankeny',           'IA', '50023', 41.7376551,  -93.6014599,  true, 'ACTIVE'),
  ('First Impressions',                       'first-impressions-jacksonville',   '500 Madden Road Suite C',              'Jacksonville',     'AR', '72076', 34.8892456,  -92.1036571,  true, 'ACTIVE'),
  ('Unique Lady',                             'unique-lady',                      '25000 Southfield Rd',                  'Southfield',       'MI', '48075', 42.4735929,  -83.2206100,  true, 'ACTIVE'),
  ('125 Bridal Prom & Tux',                  '125-bridal-prom-tux',              '37 Plaistow Rd',                       'Plaistow',         'NH', '03865', 42.8227643,  -71.1039090,  true, 'ACTIVE'),
  ('Fiancee Minot',                           'fiancee-minot',                    '6 Main St S',                          'Minot',            'ND', '58701', 48.2362646,  -101.2932458, true, 'ACTIVE'),
  ('Fancy Frocks Bridal Prom Tuxedo',         'fancy-frocks-bridal',              '820 Inlet Square Dr',                  'Murrells Inlet',   'SC', '29576', 33.5816624,  -79.0215517,  true, 'ACTIVE'),
  ('Best Bride Prom & Tux',                  'best-bride-prom-tux',              '800 Fairview Rd. Suite A-1',           'Asheville',        'NC', '28803', 35.5704168,  -82.5074949,  true, 'ACTIVE'),
  ('Ashley Rene''s',                          'ashley-renes',                     '7135 Heritage Square Dr.',             'Granger',          'IN', '46530', 41.7255821,  -86.1762090,  true, 'ACTIVE'),
  ('Signatures Formal Boutique',              'signatures-formal-boutique',       '1855 N. 25th St',                      'Middlesboro',      'KY', '40965', 36.6235665,  -83.7057322,  true, 'ACTIVE'),
  ('Cloud Nine Bridal Boutique',              'cloud-nine-bridal',                '4711 N. University St.',               'Peoria',           'IL', '61614', 40.7449776,  -89.6130892,  true, 'ACTIVE'),
  ('Anitra''s',                               'anitras',                          '811 North 4th St.',                    'Monroe',           'LA', '71201', 32.5098572,  -92.1203046,  true, 'ACTIVE'),
  ('Michelle''s Formal Wear',                 'michelles-formal-wear',            '101 S Burwell Ave',                    'Adel',             'GA', '31620', 31.1367305,  -83.4239978,  true, 'ACTIVE'),
  ('Ella Blu',                                'ella-blu',                         '5410 N. Mesa',                         'El Paso',          'TX', '79912', 31.8193786,  -106.5163572, true, 'ACTIVE'),
  ('CTO Prom & Formal',                      'cto-prom-formal',                  '7475 Douglas Blvd Ste 102',            'Douglasville',     'GA', '30135', 33.7228829,  -84.7701038,  true, 'ACTIVE'),
  ('Formals XO',                              'formals-xo',                       'Oxford Valley Mall, 2300 Lincoln Hwy', 'Langhorne',        'PA', '19047', 40.1838453,  -74.8804078,  true, 'ACTIVE')
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 3. DRESS CATALOG
-- Source: lib/data/dresses.ts (48 dresses across 5 designers)
-- ============================================================================
INSERT INTO public.dresses (id, name, designer, style_number, price_cents, description, images, event_types, is_active, created_at, updated_at)
VALUES

  -- ── Johnathan Kayne ────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000001',
   'Johnathan Kayne 2835', 'Johnathan Kayne', '2835', 44900,
   'Show-stopping formal gown from Johnathan Kayne. Luxurious fabric and impeccable construction built for the spotlight.',
   '[{"url":"/dresses/johnathan-kayne/2835.jpg","alt":"Johnathan Kayne style 2835","order":1,"is_primary":true}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000002',
   'Johnathan Kayne 3039', 'Johnathan Kayne', '3039', 46500,
   'Dramatic silhouette with signature Johnathan Kayne embellishment. Designed for unforgettable entrances.',
   '[{"url":"/dresses/johnathan-kayne/3039.jpg","alt":"Johnathan Kayne style 3039","order":1,"is_primary":true}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000003',
   'Johnathan Kayne 3084', 'Johnathan Kayne', '3084', 48000,
   'Elegant evening gown with striking design details. A Johnathan Kayne masterpiece for prom season.',
   '[{"url":"/dresses/johnathan-kayne/3084.jpg","alt":"Johnathan Kayne style 3084","order":1,"is_primary":true}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000036',
   'Johnathan Kayne 3144', 'Johnathan Kayne', '3144', 49500,
   'Glamorous gown with bold design elements and premium fabric. Built for the red carpet.',
   '[{"url":"/dresses/johnathan-kayne/3144.jpg","alt":"Johnathan Kayne style 3144","order":1,"is_primary":true}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000037',
   'Johnathan Kayne 3208', 'Johnathan Kayne', '3208', 52000,
   'Floor-length gown with intricate detailing and a commanding presence. A Johnathan Kayne signature piece.',
   '[{"url":"/dresses/johnathan-kayne/3208.jpg","alt":"Johnathan Kayne style 3208","order":1,"is_primary":true}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000038',
   'Johnathan Kayne 3251', 'Johnathan Kayne', '3251', 54000,
   'Couture-inspired formal gown with meticulous craftsmanship and luxe materials throughout.',
   '[{"url":"/dresses/johnathan-kayne/3251.jpg","alt":"Johnathan Kayne style 3251","order":1,"is_primary":true}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000039',
   'Johnathan Kayne 9213', 'Johnathan Kayne', '9213', 58000,
   'Iconic Johnathan Kayne design with breathtaking detail work. Shown from multiple angles.',
   '[{"url":"/dresses/johnathan-kayne/9213.jpg","alt":"Johnathan Kayne style 9213 front","order":1,"is_primary":true},{"url":"/dresses/johnathan-kayne/9213A.jpg","alt":"Johnathan Kayne style 9213 back","order":2,"is_primary":false}]',
   '["prom","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000040',
   'Johnathan Kayne Overskirt', 'Johnathan Kayne', 'OVERSKIRT', 62000,
   'Dramatic two-piece look featuring a detachable overskirt. Go from ceremony to dance floor in one stunning look.',
   '[{"url":"/dresses/johnathan-kayne/OVERSKIRT1.jpg","alt":"Johnathan Kayne overskirt — with overskirt","order":1,"is_primary":true},{"url":"/dresses/johnathan-kayne/OVERSKIRT2.jpg","alt":"Johnathan Kayne overskirt — without overskirt","order":2,"is_primary":false}]',
   '["prom","wedding","pageant"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- ── Ashley Lauren ───────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000004',
   'Ashley Lauren 11236', 'Ashley Lauren', '11236', 48000,
   'Hand-beaded column gown with timeless elegance. Meticulous bead placement creates a luminous, eye-catching effect.',
   '[{"url":"/dresses/ashley-lauren/11236.jpg","alt":"Ashley Lauren style 11236","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000013',
   'Ashley Lauren 11238', 'Ashley Lauren', '11238', 49000,
   'Sophisticated Ashley Lauren formal gown with expert beadwork and a flattering silhouette.',
   '[{"url":"/dresses/ashley-lauren/11238.jpg","alt":"Ashley Lauren style 11238","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000014',
   'Ashley Lauren 11690', 'Ashley Lauren', '11690', 51000,
   'Stunning Ashley Lauren gown with intricate embellishments and a silhouette designed to impress.',
   '[{"url":"/dresses/ashley-lauren/11690.jpg","alt":"Ashley Lauren style 11690","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000005',
   'Ashley Lauren 11751', 'Ashley Lauren', '11751', 56000,
   'Breathtaking gown with thousands of hand-applied crystals and a sweeping skirt that commands the room.',
   '[{"url":"/dresses/ashley-lauren/11751.jpg","alt":"Ashley Lauren style 11751","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000015',
   'Ashley Lauren 12149', 'Ashley Lauren', '12149', 53000,
   'Elegant Ashley Lauren design featuring signature embellishment and a refined, modern silhouette.',
   '[{"url":"/dresses/ashley-lauren/12149.jpg","alt":"Ashley Lauren style 12149","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000016',
   'Ashley Lauren 12230', 'Ashley Lauren', '12230', 55000,
   'Glamorous formal gown with Ashley Lauren''s signature attention to detail and premium fabric.',
   '[{"url":"/dresses/ashley-lauren/12230.jpg","alt":"Ashley Lauren style 12230","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000017',
   'Ashley Lauren 12231', 'Ashley Lauren', '12231', 55500,
   'Show-stopping evening gown with exceptional craftsmanship. A standout from the Ashley Lauren collection.',
   '[{"url":"/dresses/ashley-lauren/12231.jpg","alt":"Ashley Lauren style 12231","order":1,"is_primary":true}]',
   '["prom","wedding"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000018',
   'Ashley Lauren 1624', 'Ashley Lauren', '1624', 38000,
   'Classic Ashley Lauren silhouette with refined details and flattering construction for any formal occasion.',
   '[{"url":"/dresses/ashley-lauren/1624.jpg","alt":"Ashley Lauren style 1624","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000019',
   'Ashley Lauren 1740', 'Ashley Lauren', '1740', 40000,
   'Polished formal gown from Ashley Lauren with a timeless aesthetic and beautifully draped fabric.',
   '[{"url":"/dresses/ashley-lauren/1740.jpg","alt":"Ashley Lauren style 1740","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000020',
   'Ashley Lauren 4500', 'Ashley Lauren', '4500', 44000,
   'Refined and elegant Ashley Lauren gown with a sophisticated look perfect for prom and formal events.',
   '[{"url":"/dresses/ashley-lauren/4500.jpg","alt":"Ashley Lauren style 4500","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- ── Jessica Angel ───────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000028',
   'Jessica Angel 327R', 'Jessica Angel', '327R', 31000,
   'Bold Jessica Angel design with a striking silhouette and flattering fit. Perfect for the confident prom-goer.',
   '[{"url":"/dresses/jessica-angel/327R.jpg","alt":"Jessica Angel style 327R","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000029',
   'Jessica Angel 338', 'Jessica Angel', '338', 29500,
   'Head-turning Jessica Angel style with modern lines and premium stretch fabric for the perfect fit.',
   '[{"url":"/dresses/jessica-angel/338.jpg","alt":"Jessica Angel style 338","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000030',
   'Jessica Angel 345', 'Jessica Angel', '345', 30000,
   'Sleek and sophisticated Jessica Angel gown. A curve-hugging silhouette with dramatic flair.',
   '[{"url":"/dresses/jessica-angel/345.jpg","alt":"Jessica Angel style 345","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000031',
   'Jessica Angel 528', 'Jessica Angel', '528', 33500,
   'Statement-making Jessica Angel dress with eye-catching design details built for the dance floor.',
   '[{"url":"/dresses/jessica-angel/528.jpg","alt":"Jessica Angel style 528","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000032',
   'Jessica Angel 538', 'Jessica Angel', '538', 34000,
   'Figure-flattering Jessica Angel style with glam detailing and a confident, fashion-forward look.',
   '[{"url":"/dresses/jessica-angel/538.jpg","alt":"Jessica Angel style 538","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000033',
   'Jessica Angel 571', 'Jessica Angel', '571', 34500,
   'Chic Jessica Angel gown with alluring design details. Crafted in LA for maximum impact.',
   '[{"url":"/dresses/jessica-angel/571.jpg","alt":"Jessica Angel style 571","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000034',
   'Jessica Angel 573', 'Jessica Angel', '573', 35000,
   'Glamorous and confident Jessica Angel silhouette. Premium fabric with stunning drape and construction.',
   '[{"url":"/dresses/jessica-angel/573.jpg","alt":"Jessica Angel style 573","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000006',
   'Jessica Angel 727R', 'Jessica Angel', '727R', 32900,
   'Striking cutout design with bold silhouette and dramatic back detail. Built for the confident wearer.',
   '[{"url":"/dresses/jessica-angel/727R.jpg","alt":"Jessica Angel style 727R","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000007',
   'Jessica Angel 880', 'Jessica Angel', '880', 35500,
   'Head-to-toe glitter fabric in a figure-hugging silhouette with ruched detailing and a high slit.',
   '[{"url":"/dresses/jessica-angel/880.jpg","alt":"Jessica Angel style 880","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000035',
   'Jessica Angel 974', 'Jessica Angel', '974', 36000,
   'Luxurious Jessica Angel evening gown with an elevated, polished design. A standout in the collection.',
   '[{"url":"/dresses/jessica-angel/974.jpg","alt":"Jessica Angel style 974","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- ── Chandalier ──────────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000011',
   'Chandalier 30020', 'Chandalier', '30020', 32000,
   'Sleek LA-designed Chandalier gown with modern lines and fluid fabric. Effortlessly chic.',
   '[{"url":"/dresses/chandalier/30020.jpg","alt":"Chandalier style 30020","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000012',
   'Chandalier 30021', 'Chandalier', '30021', 32500,
   'Contemporary Chandalier silhouette with signature LA style. Designed for the modern prom queen.',
   '[{"url":"/dresses/chandalier/30021.jpg","alt":"Chandalier style 30021","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000021',
   'Chandalier 30023', 'Chandalier', '30023', 33000,
   'Bold Chandalier design with a fashion-forward aesthetic. Manufactured in Los Angeles with premium materials.',
   '[{"url":"/dresses/chandalier/30023.jpg","alt":"Chandalier style 30023","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000022',
   'Chandalier 30029', 'Chandalier', '30029', 33500,
   'Flawless Chandalier evening gown with a striking silhouette and impeccable LA craftsmanship.',
   '[{"url":"/dresses/chandalier/30029.jpg","alt":"Chandalier style 30029","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000023',
   'Chandalier 30032', 'Chandalier', '30032', 34000,
   'Stunning floor-length Chandalier gown with modern design sensibility and luxurious drape.',
   '[{"url":"/dresses/chandalier/30032.jpg","alt":"Chandalier style 30032","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000024',
   'Chandalier 30045', 'Chandalier', '30045', 35000,
   'Elegant Chandalier formal with sleek lines and a confident, runway-ready silhouette.',
   '[{"url":"/dresses/chandalier/30045.jpg","alt":"Chandalier style 30045","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000025',
   'Chandalier 30047', 'Chandalier', '30047', 35500,
   'Chic and sophisticated Chandalier dress. Designed and produced in Los Angeles for a polished finish.',
   '[{"url":"/dresses/chandalier/30047.jpg","alt":"Chandalier style 30047","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000026',
   'Chandalier 30063', 'Chandalier', '30063', 36000,
   'Contemporary Chandalier evening gown with a sleek, modern aesthetic and luxe fabric choice.',
   '[{"url":"/dresses/chandalier/30063.jpg","alt":"Chandalier style 30063","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000027',
   'Chandalier 30064', 'Chandalier', '30064', 36500,
   'Sophisticated Chandalier gown with seamless LA styling and a silhouette that turns heads.',
   '[{"url":"/dresses/chandalier/30064.jpg","alt":"Chandalier style 30064","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000010',
   'Chandalier 30081', 'Chandalier', '30081', 36800,
   'Sleek floor-length gown with dramatic thigh slit and daring low back. Fluid crepe fabric made in LA.',
   '[{"url":"/dresses/chandalier/30081.jpg","alt":"Chandalier style 30081","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- ── Kate Parker ─────────────────────────────────────────────────────────────
  ('d1000000-0000-0000-0000-000000000008',
   'Kate Parker 26014', 'Kate Parker', '26014', 22000,
   'Playful and flattering Kate Parker prom gown. Youthful silhouette with charming details.',
   '[{"url":"/dresses/kate-parker/26014.jpg","alt":"Kate Parker style 26014","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000041',
   'Kate Parker 26018', 'Kate Parker', '26018', 22500,
   'Sweet Kate Parker design with a fresh, modern look perfect for prom night.',
   '[{"url":"/dresses/kate-parker/26018.jpg","alt":"Kate Parker style 26018","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000042',
   'Kate Parker 26043', 'Kate Parker', '26043', 23000,
   'Charming Kate Parker gown with feminine styling and a flattering, age-appropriate silhouette.',
   '[{"url":"/dresses/kate-parker/26043.jpg","alt":"Kate Parker style 26043","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000043',
   'Kate Parker 26050', 'Kate Parker', '26050', 23500,
   'Beautiful Kate Parker formal gown with delicate detailing and a youthful, vibrant aesthetic.',
   '[{"url":"/dresses/kate-parker/26050.jpg","alt":"Kate Parker style 26050","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000044',
   'Kate Parker 26058', 'Kate Parker', '26058', 24000,
   'Eye-catching Kate Parker prom style with a fresh look and comfortable, confidence-boosting fit.',
   '[{"url":"/dresses/kate-parker/26058.jpg","alt":"Kate Parker style 26058","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000009',
   'Kate Parker 26080', 'Kate Parker', '26080', 24500,
   'Vibrant Kate Parker design with a modern silhouette and eye-catching style. Perfect for prom.',
   '[{"url":"/dresses/kate-parker/26080.jpg","alt":"Kate Parker style 26080","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000045',
   'Kate Parker 26084', 'Kate Parker', '26084', 25000,
   'Fresh and fun Kate Parker gown with a flattering fit and playful design details.',
   '[{"url":"/dresses/kate-parker/26084.jpg","alt":"Kate Parker style 26084","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000046',
   'Kate Parker 26085', 'Kate Parker', '26085', 25500,
   'Stylish Kate Parker prom dress with a chic silhouette and premium fabric for an elevated look.',
   '[{"url":"/dresses/kate-parker/26085.jpg","alt":"Kate Parker style 26085","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000047',
   'Kate Parker 26087', 'Kate Parker', '26087', 26000,
   'Elegant Kate Parker design with a polished finish and flattering lines for the perfect prom night.',
   '[{"url":"/dresses/kate-parker/26087.jpg","alt":"Kate Parker style 26087","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  ('d1000000-0000-0000-0000-000000000048',
   'Kate Parker 26088', 'Kate Parker', '26088', 26500,
   'Gorgeous Kate Parker formal gown with a standout look and impeccable fit for prom night.',
   '[{"url":"/dresses/kate-parker/26088.jpg","alt":"Kate Parker style 26088","order":1,"is_primary":true}]',
   '["prom"]', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z')

ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- VERIFICATION — Run to confirm counts:
-- ============================================================================
-- SELECT 'boutiques' AS table_name, COUNT(*) FROM public.boutiques
-- UNION ALL SELECT 'dresses', COUNT(*) FROM public.dresses;
-- Expected: boutiques = 53 (5 Top 10 + 48 network), dresses = 48
