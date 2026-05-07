-- ============================================================
-- ORIGINO — Complete Database Schema
-- Supabase PostgreSQL with RLS
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Full-text search

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin','agent')),
  phone TEXT,
  country TEXT,
  avatar_url TEXT,
  whatsapp TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en','ur')),
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = user_id
      AND role = 'admin'
  );
$$;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (public.is_admin(auth.uid()));

-- ============================================================
-- BUYER COMPANIES
-- ============================================================
CREATE TABLE buyer_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  industry TEXT,
  annual_import_usd TEXT,
  vat_number TEXT,
  duns_number TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE buyer_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can manage own company" ON buyer_companies FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Admins can view all buyer companies" ON buyer_companies FOR SELECT USING (public.is_admin(auth.uid()));

-- ============================================================
-- APPLICATIONS
-- ============================================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_name_ur TEXT,
  city TEXT,
  category TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewing','approved','rejected','more_info')),
  audit_score INTEGER,
  audit_breakdown JSONB,
  step_completed INTEGER DEFAULT 0,
  form_data JSONB DEFAULT '{}',
  reviewer_id UUID REFERENCES profiles(id),
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers can view own application" ON applications FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Sellers can insert own application" ON applications FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Sellers can update own pending application" ON applications FOR UPDATE USING (auth.uid() = profile_id AND status = 'pending');
CREATE POLICY "Admins can manage all applications" ON applications FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id),
  company_name TEXT NOT NULL,
  company_name_ur TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_ur TEXT,
  city TEXT NOT NULL,
  cluster TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_categories TEXT[] DEFAULT '{}',
  verification_tier TEXT DEFAULT 'unverified' CHECK (verification_tier IN ('unverified','self_declared','document_verified','site_visited','origino_certified')),
  audit_score INTEGER,
  established_year INTEGER,
  employee_count TEXT,
  export_countries TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  hero_image_url TEXT,
  logo_url TEXT,
  video_url TEXT,
  factory_images TEXT[] DEFAULT '{}',
  moq_usd NUMERIC,
  lead_time_days TEXT,
  payment_terms TEXT[] DEFAULT '{}',
  response_rate NUMERIC DEFAULT 0,
  response_time_hours NUMERIC,
  health_score NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_suppliers_slug ON suppliers(slug);
CREATE INDEX idx_suppliers_category ON suppliers(category);
CREATE INDEX idx_suppliers_city ON suppliers(city);
CREATE INDEX idx_suppliers_tier ON suppliers(verification_tier);
CREATE INDEX idx_suppliers_search ON suppliers USING gin(to_tsvector('english', company_name || ' ' || COALESCE(description,'') || ' ' || category));
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active suppliers" ON suppliers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Sellers can manage own supplier" ON suppliers FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all suppliers" ON suppliers FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ur TEXT,
  slug TEXT NOT NULL,
  description TEXT,
  description_ur TEXT,
  origin_story TEXT,
  category TEXT NOT NULL,
  hs_code TEXT,
  images TEXT[] DEFAULT '{}',
  price_usd_min NUMERIC,
  price_usd_max NUMERIC,
  moq INTEGER NOT NULL DEFAULT 1,
  moq_unit TEXT NOT NULL DEFAULT 'pcs',
  lead_time_days TEXT,
  sample_available BOOLEAN DEFAULT FALSE,
  sample_price_usd NUMERIC,
  certifications TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  specifications_ur JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supplier_id, slug)
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Suppliers can manage own products" ON products FOR ALL USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_production','quality_check','shipped','delivered','disputed','cancelled')),
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  price_usd NUMERIC NOT NULL,
  total_usd NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT CHECK (payment_method IN ('stripe','jazzcash','easypaisa','wire','escrow')),
  escrow_status TEXT DEFAULT 'not_started' CHECK (escrow_status IN ('not_started','funded','released','disputed','refunded')),
  shipping_address JSONB,
  tracking_number TEXT,
  shipment_carrier TEXT,
  estimated_delivery DATE,
  self_reported_status JSONB,
  notes TEXT,
  buyer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Suppliers see own orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));
CREATE POLICY "Admins see all orders" ON orders FOR SELECT USING (public.is_admin(auth.uid()));

-- ============================================================
-- INQUIRIES
-- ============================================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_company TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread','read','replied','quoted')),
  intent_score INTEGER DEFAULT 0,
  replies JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own inquiries" ON inquiries FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers create own inquiries" ON inquiries FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Suppliers see own inquiries" ON inquiries FOR SELECT USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));
CREATE POLICY "Suppliers update own inquiries" ON inquiries FOR UPDATE USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));
CREATE POLICY "Admins manage all inquiries" ON inquiries FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- QUOTES
-- ============================================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','responded','countered','accepted','rejected','expired')),
  quantity INTEGER NOT NULL,
  unit TEXT DEFAULT 'pcs',
  target_price_usd NUMERIC,
  offered_price_usd NUMERIC,
  final_price_usd NUMERIC,
  currency TEXT DEFAULT 'USD',
  lead_time_requested TEXT,
  lead_time_offered TEXT,
  payment_terms_requested TEXT,
  payment_terms_offered TEXT,
  notes TEXT,
  buyer_notes TEXT,
  negotiation_history JSONB DEFAULT '[]',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own quotes" ON quotes FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Suppliers see own quotes" ON quotes FOR SELECT USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));

-- ============================================================
-- ESCROW TRANSACTIONS
-- ============================================================
CREATE TABLE escrow_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  amount_usd NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','funded','released','refunded','disputed')),
  payment_provider TEXT DEFAULT 'stripe',
  stripe_payment_intent TEXT,
  stripe_transfer_id TEXT,
  funded_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  dispute_reason TEXT,
  dispute_opened_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties see own escrow" ON escrow_transactions FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (buyer_id = auth.uid() OR EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()))));
CREATE POLICY "Admins manage escrow" ON escrow_transactions FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- INSPECTIONS
-- ============================================================
CREATE TABLE inspection_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT DEFAULT 'Pakistan',
  cities TEXT[] DEFAULT '{}',
  accreditations TEXT[] DEFAULT '{}',
  contact_email TEXT,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  provider_id UUID REFERENCES inspection_providers(id),
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested','scheduled','in_progress','completed','passed','failed','cancelled')),
  scheduled_date DATE,
  completed_date DATE,
  result TEXT CHECK (result IN ('pass','fail','conditional',NULL)),
  score INTEGER,
  report_url TEXT,
  report_summary TEXT,
  checklist JSONB DEFAULT '{}',
  notes TEXT,
  cost_usd NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own inspections" ON inspections FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Suppliers see own inspections" ON inspections FOR SELECT USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));

-- ============================================================
-- SHIPMENT TRACKING
-- ============================================================
CREATE TABLE shipment_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  carrier TEXT,
  tracking_number TEXT,
  status TEXT,
  origin_port TEXT,
  destination_port TEXT,
  milestones JSONB DEFAULT '[]',
  estimated_arrival DATE,
  actual_arrival DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRADE FINANCE APPLICATIONS
-- ============================================================
CREATE TABLE trade_finance_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  order_id UUID REFERENCES orders(id),
  amount_pkr NUMERIC NOT NULL,
  tenor_days INTEGER NOT NULL,
  purpose_code TEXT,
  export_contract_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted','reviewing','approved','rejected','disbursed','repaid')),
  partner_bank TEXT,
  interest_rate NUMERIC,
  decision_date DATE,
  disbursement_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE trade_finance_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers see own TF applications" ON trade_finance_applications FOR SELECT USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));

-- ============================================================
-- VIRTUAL TOURS
-- ============================================================
CREATE TABLE virtual_tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  platform TEXT DEFAULT 'zoom',
  meeting_url TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested','confirmed','completed','cancelled')),
  notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAVED ITEMS & SEARCHES
-- ============================================================
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('supplier','product','rfq')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);

CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  filters JSONB NOT NULL DEFAULT '{}',
  alert_enabled BOOLEAN DEFAULT FALSE,
  last_alerted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved searches" ON saved_searches FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- RFQ REQUESTS & RESPONSES
-- ============================================================
CREATE TABLE rfq_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ur TEXT,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  target_price_usd NUMERIC,
  deadline DATE,
  certifications_required TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open','closed','awarded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE rfq_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfq_requests(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  offered_price_usd NUMERIC NOT NULL,
  lead_time_days TEXT,
  notes TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted','shortlisted','awarded','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rfq_id, supplier_id)
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  order_id UUID NOT NULL REFERENCES orders(id) UNIQUE,
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT,
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
  communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
  delivery_score INTEGER CHECK (delivery_score BETWEEN 1 AND 5),
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Buyers can write reviews for own orders" ON reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- COMMUNITY POSTS & COMMENTS
-- ============================================================
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  body_ur TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read posts" ON community_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Auth users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read comments" ON community_comments FOR SELECT USING (TRUE);
CREATE POLICY "Auth users can comment" ON community_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  title_ur TEXT,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  excerpt_ur TEXT,
  body TEXT NOT NULL,
  body_ur TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_blog_slug ON blog_posts(slug);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins manage all posts" ON blog_posts FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- EXPORT DOCUMENTATION GUIDES
-- ============================================================
CREATE TABLE export_documentation_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_ur TEXT,
  slug TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  body_ur TEXT,
  category TEXT NOT NULL,
  template_url TEXT,
  related_guides UUID[] DEFAULT '{}',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GOVERNMENT SCHEMES
-- ============================================================
CREATE TABLE government_schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ur TEXT,
  authority TEXT NOT NULL,
  description TEXT,
  eligibility TEXT,
  benefit TEXT,
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LOGISTICS PARTNERS
-- ============================================================
CREATE TABLE logistics_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('freight_forwarder','customs_agent','courier','carrier')),
  cities TEXT[] DEFAULT '{}',
  contact_email TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- SANCTIONS LOG
-- ============================================================
CREATE TABLE sanctions_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_name TEXT NOT NULL,
  entity_type TEXT CHECK (entity_type IN ('supplier','buyer','person','company')),
  checked_by UUID REFERENCES profiles(id),
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  result TEXT NOT NULL CHECK (result IN ('clear','match','possible_match')),
  lists_checked TEXT[] DEFAULT '{}',
  notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ
);
ALTER TABLE sanctions_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sanctions log" ON sanctions_log FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- SELLER PERFORMANCE METRICS
-- ============================================================
CREATE TABLE seller_performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  period TEXT NOT NULL,
  response_rate NUMERIC DEFAULT 0,
  avg_response_hours NUMERIC,
  quote_acceptance_rate NUMERIC,
  order_completion_rate NUMERIC,
  dispute_rate NUMERIC,
  avg_review_rating NUMERIC,
  inquiry_count INTEGER DEFAULT 0,
  quote_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  revenue_usd NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supplier_id, period)
);

-- ============================================================
-- AWARDS
-- ============================================================
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  category TEXT NOT NULL,
  period TEXT NOT NULL,
  rank INTEGER NOT NULL,
  score NUMERIC NOT NULL,
  badge TEXT,
  citation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view awards" ON awards FOR SELECT USING (TRUE);

-- ============================================================
-- MARKETING SERVICE ORDERS
-- ============================================================
CREATE TABLE marketing_service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  tier TEXT NOT NULL CHECK (tier IN ('basic','growth','premium')),
  price_usd NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','in_progress','delivered','active','expired','cancelled','breached')),
  payment_method TEXT DEFAULT 'stripe' CHECK (payment_method IN ('stripe','jazzcash','easypaisa','bank_transfer')),
  local_payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ,
  sla_status TEXT DEFAULT 'on_track' CHECK (sla_status IN ('on_track','at_risk','breached','delivered')),
  assigned_to TEXT,
  delay_notes TEXT,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE marketing_service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers see own marketing orders" ON marketing_service_orders FOR SELECT USING (EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND profile_id = auth.uid()));
CREATE POLICY "Admins manage marketing orders" ON marketing_service_orders FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- COMMISSIONS & REFERRALS
-- ============================================================
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  agent_id UUID REFERENCES profiles(id),
  rate NUMERIC NOT NULL,
  amount_usd NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE commission_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT UNIQUE,
  rate NUMERIC NOT NULL DEFAULT 0.05,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID NOT NULL REFERENCES profiles(id),
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','converted','expired')),
  reward_usd NUMERIC,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DISPUTES
-- ============================================================
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  raised_by UUID NOT NULL REFERENCES profiles(id),
  against UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open','under_review','resolved_buyer','resolved_seller','escalated','closed')),
  resolution TEXT,
  resolver_id UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- API KEYS
-- ============================================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activity_log_user ON activity_log(user_id, created_at DESC);

-- ============================================================
-- DATA DELETION REQUESTS (GDPR)
-- ============================================================
CREATE TABLE data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  email TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processor_id UUID REFERENCES profiles(id)
);

-- ============================================================
-- BULK INQUIRY SESSIONS
-- ============================================================
CREATE TABLE bulk_inquiry_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  supplier_ids UUID[] NOT NULL,
  message TEXT NOT NULL,
  product TEXT,
  quantity INTEGER,
  status TEXT DEFAULT 'sent',
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPLIER RESPONSE TEMPLATES
-- ============================================================
CREATE TABLE supplier_response_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  body_ur TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE CONFIG & PAGE SECTIONS
-- ============================================================
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  type TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}',
  content_ur JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_page_sections_page ON page_sections(page, is_active, "order");

-- ============================================================
-- SELLER AGREEMENT VERSIONS
-- ============================================================
CREATE TABLE seller_agreement_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE seller_agreement_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  version_id UUID NOT NULL REFERENCES seller_agreement_versions(id),
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  UNIQUE(supplier_id, version_id)
);

-- ============================================================
-- COMPETITIVE INTELLIGENCE
-- ============================================================
CREATE TABLE competitive_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  market TEXT NOT NULL,
  competitor_country TEXT NOT NULL,
  average_price_usd NUMERIC,
  market_share_pct NUMERIC,
  pakistan_advantage TEXT,
  data_source TEXT,
  period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CARBON OFFSETS
-- ============================================================
CREATE TABLE carbon_offsets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  shipment_co2_kg NUMERIC,
  offset_co2_kg NUMERIC,
  provider TEXT,
  certificate_url TEXT,
  cost_usd NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AB TESTS
-- ============================================================
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('control','treatment')),
  user_id UUID NOT NULL REFERENCES profiles(id),
  page TEXT,
  conversion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN TASKS
-- ============================================================
CREATE TABLE admin_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sla_breach','sanctions_review','document_expiry','application_review','manual_follow_up')),
  linked_entity_type TEXT CHECK (linked_entity_type IN ('marketing_order','application','supplier','document','escrow')),
  linked_entity_id TEXT NOT NULL,
  linked_href TEXT NOT NULL DEFAULT '/admin/tasks',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  assigned_to TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','blocked','completed')),
  notes TEXT,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage admin tasks" ON admin_tasks FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- BUYER WAITLIST
-- ============================================================
CREATE TABLE buyer_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'All categories',
  city TEXT NOT NULL DEFAULT 'All cities',
  source TEXT NOT NULL DEFAULT 'marketplace_zero_state',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE buyer_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage buyer waitlist" ON buyer_waitlist FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- LANDED COST CALCULATIONS (Saved)
-- ============================================================
CREATE TABLE landed_cost_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  inputs JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON shipment_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON admin_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Supplier slug auto-generation helper
CREATE OR REPLACE FUNCTION generate_supplier_slug(name TEXT) RETURNS TEXT AS $$
BEGIN RETURN lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')); END;
$$ LANGUAGE plpgsql;

-- Update supplier health score on profile change
CREATE OR REPLACE FUNCTION calculate_health_score(supplier_uuid UUID) RETURNS NUMERIC AS $$
DECLARE score NUMERIC := 0;
BEGIN
  SELECT COALESCE(audit_score,0)*0.4 + COALESCE(response_rate,0)*0.3 + CASE WHEN array_length(certifications,1)>3 THEN 20 WHEN array_length(certifications,1)>0 THEN 10 ELSE 0 END + CASE WHEN verification_tier='origino_certified' THEN 10 WHEN verification_tier='site_visited' THEN 7 WHEN verification_tier='document_verified' THEN 4 ELSE 0 END INTO score FROM suppliers WHERE id=supplier_uuid;
  RETURN LEAST(100, score);
END;
$$ LANGUAGE plpgsql;
