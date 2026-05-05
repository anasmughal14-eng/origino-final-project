-- ============================================================
-- ORIGINO demo seed data
-- Run after supabase/schema.sql in a development Supabase project.
-- Password for seeded auth users: OriginoDemo123!
-- Replace these records with production data before launch.
-- ============================================================

create extension if not exists "pgcrypto";

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@origino.test', crypt('OriginoDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"ORIGINO Admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seller@origino.test', crypt('OriginoDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Adeel Khan"}', now(), now()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'buyer@origino.test', crypt('OriginoDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marta Klein"}', now(), now())
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@origino.test","email_verified":true,"phone_verified":false}', 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub":"00000000-0000-0000-0000-000000000002","email":"seller@origino.test","email_verified":true,"phone_verified":false}', 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '{"sub":"00000000-0000-0000-0000-000000000003","email":"buyer@origino.test","email_verified":true,"phone_verified":false}', 'email', now(), now(), now())
on conflict do nothing;

insert into profiles (id, email, full_name, role, phone, country, preferred_language) values
  ('00000000-0000-0000-0000-000000000001', 'admin@origino.test', 'ORIGINO Admin', 'admin', '+92 300 0000000', 'Pakistan', 'en'),
  ('00000000-0000-0000-0000-000000000002', 'seller@origino.test', 'Adeel Khan', 'seller', '+92 321 5551000', 'Pakistan', 'ur'),
  ('00000000-0000-0000-0000-000000000003', 'buyer@origino.test', 'Marta Klein', 'buyer', '+49 30 5550100', 'Germany', 'en')
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  updated_at = now();

insert into suppliers (
  id, profile_id, company_name, company_name_ur, slug, description, city, cluster, category,
  sub_categories, verification_tier, audit_score, established_year, employee_count,
  export_countries, certifications, moq_usd, lead_time_days, payment_terms,
  response_rate, response_time_hours, health_score, is_active, is_featured
) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Crescent Surgical Works', 'کریسنٹ سرجیکل ورکس', 'crescent-surgical-works', 'Sialkot manufacturer of reusable surgical and dental instruments for EU distributors.', 'Sialkot', 'sialkot', 'Surgical & Medical Instruments', '{"General Surgery","Dental"}', 'origino_certified', 92, 1998, '120-250', '{"Germany","United Kingdom","UAE"}', '{"ISO 13485","CE","FDA Registered"}', 2500, '21-35 days', '{"FOB","CIF","Wire"}', 96, 5, 92, true, true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Nishat Weaves Faisalabad', 'نشاط ویوز فیصل آباد', 'nishat-weaves-faisalabad', 'OEKO-TEX certified home textile and knitwear exporter serving EU retailers.', 'Faisalabad', 'faisalabad', 'Textiles & Apparel', '{"Home Textiles","Knitwear"}', 'site_visited', 83, 2005, '250-500', '{"France","Spain","Saudi Arabia"}', '{"OEKO-TEX","BSCI","GOTS"}', 5000, '30-45 days', '{"FOB","LC"}', 89, 9, 83, true, true),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Lahore Leather Company', 'لاہور لیدر کمپنی', 'lahore-leather-company', 'Full-grain leather bags, footwear uppers, and small accessories for boutique importers.', 'Lahore', 'lahore', 'Leather Goods', '{"Bags & Accessories","Footwear"}', 'document_verified', 76, 2012, '50-120', '{"Italy","UAE","Qatar"}', '{"SECP Registered","ISO 9001"}', 3000, '25-40 days', '{"FOB","Advance"}', 81, 14, 76, true, false),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Karachi Agro Foods', 'کراچی ایگرو فوڈز', 'karachi-agro-foods', 'Rice, spices, and processed food exporter with Halal and HACCP documentation.', 'Karachi', 'karachi', 'Food & Agriculture', '{"Rice","Spices","Processed Food"}', 'site_visited', 88, 2001, '80-160', '{"UAE","Malaysia","Oman"}', '{"Halal","HACCP","ISO 22000"}', 8000, '14-28 days', '{"CIF","LC"}', 93, 7, 88, true, true),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Gujranwala Tools & Cutlery', 'گوجرانوالہ ٹولز اینڈ کٹلری', 'gujranwala-tools-cutlery', 'Hand tools, kitchen knives, and light engineering parts for hardware distributors.', 'Gujranwala', 'gujranwala', 'Engineering & Light Manufacturing', '{"Cutlery","Hand Tools"}', 'self_declared', 61, 2017, '30-80', '{"Germany","Poland"}', '{"ISO 9001"}', 1800, '35-50 days', '{"FOB","EXW"}', 72, 18, 61, true, false)
on conflict (id) do update set verification_tier = excluded.verification_tier, updated_at = now();

insert into products (
  id, supplier_id, name, slug, description, category, hs_code, images, price_usd_min, price_usd_max,
  moq, moq_unit, lead_time_days, sample_available, sample_price_usd, certifications, specifications, is_active
) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'German Pattern Surgical Scissors', 'german-pattern-surgical-scissors', 'Reusable stainless steel scissors with CE documentation.', 'Surgical & Medical Instruments', '9018.90', '{}', 2.4, 6.8, 500, 'pieces', '21-35 days', true, 12, '{"ISO 13485","CE"}', '{"material":"AISI 420","finish":"satin","sterilization":"autoclave"}', true),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Dental Extraction Forceps Set', 'dental-extraction-forceps-set', 'Dental extraction kit for clinics and distributors.', 'Surgical & Medical Instruments', '9018.49', '{}', 38, 62, 100, 'sets', '30 days', true, 45, '{"ISO 13485","CE"}', '{"pieces":"10","steel":"stainless","packaging":"export carton"}', true),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'OEKO-TEX Terry Towel Set', 'oeko-tex-terry-towel-set', 'Hotel-grade terry towel set for EU and GCC hospitality buyers.', 'Textiles & Apparel', '6302.60', '{}', 4.8, 12.5, 1200, 'sets', '30-45 days', true, 8, '{"OEKO-TEX","BSCI"}', '{"gsm":"550","fiber":"100% cotton","sizes":"hand, bath, bath sheet"}', true),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'Full Grain Leather Tote', 'full-grain-leather-tote', 'Small-batch leather tote with export packaging.', 'Leather Goods', '4202.21', '{}', 24, 48, 250, 'pieces', '25-40 days', true, 30, '{"SECP Registered"}', '{"leather":"full grain","lining":"cotton","hardware":"brass"}', true),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', '1121 Sella Basmati Rice', '1121-sella-basmati-rice', 'Export-grade 1121 sella basmati rice.', 'Food & Agriculture', '1006.30', '{}', 980, 1220, 24, 'metric tons', '14-28 days', false, null, '{"Halal","HACCP"}', '{"grain":"1121 sella","packing":"5kg/10kg/25kg","origin":"Sindh/Punjab"}', true),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', 'Stainless Kitchen Knife Set', 'stainless-kitchen-knife-set', 'Retail-ready stainless kitchen knife set.', 'Engineering & Light Manufacturing', '8211.10', '{}', 6.5, 14, 500, 'sets', '35-50 days', true, 10, '{"ISO 9001"}', '{"steel":"stainless","pieces":"6","packaging":"color box"}', true)
on conflict (supplier_id, slug) do nothing;

insert into buyer_companies (buyer_id, company_name, country, industry, annual_import_usd, vat_number, duns_number, verified) values
  ('00000000-0000-0000-0000-000000000003', 'Hansa Medical Imports GmbH', 'Germany', 'Medical distribution', '$1M-$5M', 'DE123456789', '315999111', true)
on conflict do nothing;

insert into inquiries (id, supplier_id, buyer_id, buyer_name, buyer_company, subject, message, quantity, product_id, status, intent_score, replies) values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Marta Klein', 'Hansa Medical Imports GmbH', 'CE forceps program', 'Please quote CE-marked forceps for our Q3 distributor program.', 500, '20000000-0000-0000-0000-000000000002', 'unread', 88, '[]')
on conflict (id) do nothing;

insert into quotes (id, buyer_id, supplier_id, product_id, status, quantity, unit, target_price_usd, offered_price_usd, currency, lead_time_requested, lead_time_offered, notes) values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'responded', 500, 'sets', 42, 45, 'USD', '30 days', '28 days', 'Includes CE documentation and export carton packing.')
on conflict (id) do nothing;

insert into orders (id, buyer_id, supplier_id, product_id, status, quantity, unit, price_usd, total_usd, currency, payment_method, escrow_status, tracking_number, notes) values
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'quality_check', 500, 'sets', 45, 22500, 'USD', 'escrow', 'funded', 'DHL-ORIGINO-001', 'Inspection booked before shipment.')
on conflict (id) do nothing;

insert into escrow_transactions (id, order_id, amount_usd, currency, status, payment_provider, funded_at) values
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 22500, 'USD', 'funded', 'stripe', now())
on conflict (id) do nothing;

insert into applications (id, profile_id, company_name, company_name_ur, city, category, status, audit_score, audit_breakdown, form_data, submitted_at) values
  ('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Crescent Surgical Works', 'کریسنٹ سرجیکل ورکس', 'Sialkot', 'Surgical & Medical Instruments', 'approved', 92, '{"brand":23,"digital":22,"export":18,"product":14,"operations":10,"compliance":5}', '{"target_markets":"EU, UK","hs_code":"9018.90"}', now())
on conflict (id) do nothing;

insert into marketing_service_orders (id, supplier_id, tier, price_usd, status, payment_method, local_payment_reference, paid_at, sla_due_at, sla_status, starts_at, expires_at) values
  ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'growth', 799, 'active', 'stripe', 'pi_demo_growth', now(), now() + interval '42 days', 'on_track', now(), now() + interval '1 year')
on conflict (id) do nothing;

insert into admin_tasks (id, title, type, priority, status, assigned_to, linked_entity_type, linked_entity_id, linked_href, due_at, notes) values
  ('90000000-0000-0000-0000-000000000001', 'Review Gujranwala Tools application', 'application_review', 'high', 'open', 'Admin Ops', 'application', '70000000-0000-0000-0000-000000000001', '/admin/applications/70000000-0000-0000-0000-000000000001', now() + interval '1 day', 'Confirm audit score, website/photo gap, and marketing package path.'),
  ('90000000-0000-0000-0000-000000000002', 'ISO certificate expires in 30 days', 'document_expiry', 'medium', 'open', 'Document Vault', 'document', 'doc-iso-sup-1', '/admin/documents', now() + interval '30 days', 'Request updated ISO 13485 certificate from Crescent Surgical Works.')
on conflict (id) do nothing;

insert into community_posts (id, author_id, title, body, category, tags, upvotes, is_pinned) values
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Welcome to the ORIGINO export community', 'Share practical sourcing, export documentation, and buyer readiness questions here.', 'export_tips', '{"documentation","community"}', 12, true)
on conflict (id) do nothing;

insert into blog_posts (id, author_id, title, slug, excerpt, body, tags, published, published_at) values
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'How EU buyers evaluate Pakistani surgical suppliers', 'eu-buyers-pakistani-surgical-suppliers', 'A practical readiness guide for Sialkot manufacturers.', 'EU procurement teams look for traceable certifications, stable lead times, and clear technical documentation.', '{"sialkot","surgical","eu"}', true, now())
on conflict (id) do nothing;

insert into awards (id, supplier_id, category, period, rank, score, badge, citation) values
  ('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Most Responsive', '2026-Q2', 1, 96, 'origino_certified', 'Fast response and complete export documentation.')
on conflict (id) do nothing;

insert into page_sections (id, page, type, "order", content, is_active) values
  ('d0000000-0000-0000-0000-000000000001', 'home', 'hero', 1, '{"eyebrow":"Pakistan Export Marketplace","title":"Source from verified Pakistani manufacturers.","body":"ORIGINO connects global buyers with export-ready suppliers across Sialkot, Faisalabad, Lahore, Karachi, and Gujranwala."}', true),
  ('d0000000-0000-0000-0000-000000000002', 'home', 'stats', 2, '{"suppliers":5,"products":6,"clusters":5}', true)
on conflict (id) do nothing;
