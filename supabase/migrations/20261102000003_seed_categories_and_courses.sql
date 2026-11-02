-- Insert categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('ETAP & Power Systems', 'etap-power-systems', 'Training using ETAP software for power system analysis and optimization', 1),
  ('ETAP', 'etap', 'Dedicated ETAP software training courses', 2),
  ('Power Systems', 'power-systems', 'Power system design, analysis and engineering training', 3),
  ('Protection', 'protection', 'Power system protection, relay coordination and protection engineering', 4),
  ('Solar PV', 'solar-pv', 'Solar photovoltaic system design and installation training', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert courses as DRAFT (prices TBC in NGN)
INSERT INTO courses (title, slug, short_description, category_id, status, price, currency, mode, difficulty_level, sort_order) VALUES
  ('Power System Optimization Using ETAP Software', 'power-system-optimization-etap',
   'Master power system optimization techniques using ETAP software through practical, hands-on training.',
   (SELECT id FROM categories WHERE slug = 'etap-power-systems'), 'draft', NULL, 'NGN', 'Online', 'intermediate', 1),
  ('ETAP Training', 'etap-training',
   'Comprehensive ETAP software training covering modelling, analysis and reporting for power systems.',
   (SELECT id FROM categories WHERE slug = 'etap'), 'draft', NULL, 'NGN', 'Online', 'beginner', 2),
  ('Training on Power System Analysis', 'power-system-analysis',
   'Practical training on power system analysis methods including load flow, short-circuit and transient stability.',
   (SELECT id FROM categories WHERE slug = 'power-systems'), 'draft', NULL, 'NGN', 'Online', 'intermediate', 3),
  ('ETAP SLD Modelling', 'etap-sld-modelling',
   'Learn to build accurate single-line diagram models in ETAP for real-world power system projects.',
   (SELECT id FROM categories WHERE slug = 'etap'), 'draft', NULL, 'NGN', 'Online', 'beginner', 4),
  ('Training on Power System Design', 'power-system-design',
   'End-to-end power system design training covering standards, calculations and documentation.',
   (SELECT id FROM categories WHERE slug = 'power-systems'), 'draft', NULL, 'NGN', 'Online', 'intermediate', 5),
  ('Training on Power System Protection', 'power-system-protection',
   'Protection engineering fundamentals: relay selection, settings, coordination and testing.',
   (SELECT id FROM categories WHERE slug = 'protection'), 'draft', NULL, 'NGN', 'Online', 'intermediate', 6),
  ('Advanced Training on Power System Protection', 'advanced-power-system-protection',
   'Advanced protection engineering: complex relay coordination, differential protection and arc flash.',
   (SELECT id FROM categories WHERE slug = 'protection'), 'draft', NULL, 'NGN', 'Online', 'advanced', 7),
  ('Advanced Training on Solar PV System Design', 'solar-pv-system-design',
   'Advanced solar PV system design covering utility-scale projects, string sizing and grid integration.',
   (SELECT id FROM categories WHERE slug = 'solar-pv'), 'draft', NULL, 'NGN', 'Online', 'advanced', 8),
  ('Training on Solar PV Systems Design', 'solar-pv-systems',
   'Practical solar PV system design training from site assessment through to system commissioning.',
   (SELECT id FROM categories WHERE slug = 'solar-pv'), 'draft', NULL, 'NGN', 'Online', 'intermediate', 9),
  ('Advanced Training on Power System Analysis', 'advanced-power-system-analysis',
   'Advanced power system analysis: harmonics, motor dynamics, reliability and ETAP advanced studies.',
   (SELECT id FROM categories WHERE slug = 'power-systems'), 'draft', NULL, 'NGN', 'Online', 'advanced', 10)
ON CONFLICT (slug) DO NOTHING;
