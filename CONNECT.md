# ORIGINO Supabase + Vercel Connection Guide

## 0. Current Production-Handoff Status

The app now supports live Supabase mode and local mock mode.

- `NEXT_PUBLIC_USE_MOCK_DATA=false` makes the main data-service reads and supported workflow writes use Supabase.
- `NEXT_PUBLIC_USE_MOCK_DATA=true` keeps local mock data available for offline demos and design QA.
- API routes return the consistent shape `{ success: boolean, data?: ..., error?: string }`.
- Live write-through is wired for waitlist, supplier inquiries, inquiry read/reply updates, quotes, quote actions, orders, escrow release/dispute, buyer company profile, inspections, seller product create/edit/status, admin suppliers, admin tasks, admin applications, admin registry pages, and site builder saves.
- The remaining external actions are intentionally provider-gated until real credentials are added: Stripe checkout/connect/webhook, JazzCash, EasyPaisa, sanctions API, exchange-rate provider, Daily.co, AfterShip, Sentry, PostHog, and Upstash Redis. Payment routes return `503` while their enable flags are off, so users will not see fake payment success in production.
- Cron routes require `CRON_SECRET`; if it is missing, they fail closed instead of running openly.
- `.origino-runtime-store.json` is ignored by git and should not be deployed. It is only a mock-mode bridge.

Recommended local reset before a clean demo:

```bash
rm .origino-runtime-store.json
npm run dev
```

On Windows PowerShell:

```powershell
Remove-Item .origino-runtime-store.json -ErrorAction SilentlyContinue
npm run dev
```

## 1. Environment Variables

Set these in `.env.local` for local work and in Vercel Project Settings for production:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_APP_URL=https://origino.store
NEXT_PUBLIC_SITE_URL=https://origino.store
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
CRON_SECRET=YOUR_LONG_RANDOM_CRON_SECRET
NEXT_PUBLIC_WHATSAPP_NUMBER=923XXXXXXXXX
RESEND_API_KEY=YOUR_RESEND_KEY
EMAIL_FROM=noreply@origino.store
NOTIFICATION_EMAIL=origino.pk@gmail.com
ENABLE_STRIPE_PAYMENTS=false
ENABLE_STRIPE_CONNECT=false
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLIC_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
STRIPE_CONNECT_CLIENT_ID=YOUR_STRIPE_CONNECT_CLIENT_ID
ENABLE_LOCAL_PAYMENTS=false
JAZZCASH_MERCHANT_ID=YOUR_JAZZCASH_ID
JAZZCASH_PASSWORD=YOUR_JAZZCASH_PASSWORD
JAZZCASH_INTEGRITY_SALT=YOUR_JAZZCASH_SALT
EASYPAISA_STORE_ID=YOUR_EASYPAISA_STORE_ID
EASYPAISA_HASH_KEY=YOUR_EASYPAISA_HASH_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_AUDIT_MODEL=gpt-4.1-mini
OPEN_EXCHANGE_RATES_APP_ID=YOUR_RATES_APP_ID
NEXT_PUBLIC_POSTHOG_KEY=YOUR_POSTHOG_KEY
SENTRY_DSN=YOUR_SENTRY_DSN
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_TOKEN
DAILY_CO_API_KEY=YOUR_DAILY_KEY
AFTERSHIP_API_KEY=YOUR_AFTERSHIP_KEY
SANCTIONS_CHECK_API_KEY=YOUR_SANCTIONS_KEY
API_KEY_SALT=YOUR_API_KEY_SALT
```

Keep `NEXT_PUBLIC_USE_MOCK_DATA=false` for production and Supabase QA. Flip it to `true` only for offline mock demos.

Do not commit `.env.local`. In Vercel, set all production values under Project Settings -> Environment Variables for Production, Preview, and Development as needed.

## 1.1 External Service Setup

Before deploy, run:

```bash
npm run validate:production-env
npm run build
```

Stripe:

1. Create Stripe products/prices for Basic, Growth, and Premium marketing packages.
2. Keep `ENABLE_STRIPE_PAYMENTS=false` and `ENABLE_STRIPE_CONNECT=false` until the account is approved.
3. After approval, add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, and `STRIPE_CONNECT_CLIENT_ID`.
4. Configure the webhook URL as `https://YOUR_DOMAIN/api/stripe/webhook`.
5. Flip `ENABLE_STRIPE_PAYMENTS=true` and `ENABLE_STRIPE_CONNECT=true` only after checkout, Connect onboarding, and webhook signature verification are confirmed.

Resend:

1. Verify the sending domain in Resend.
2. Add `RESEND_API_KEY`.
3. Set the production notification address in `NOTIFICATION_EMAIL`.

JazzCash and EasyPaisa:

1. Keep `ENABLE_LOCAL_PAYMENTS=false` until provider approval.
2. Add sandbox merchant credentials first: `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`, `JAZZCASH_INTEGRITY_SALT`, `EASYPAISA_STORE_ID`, `EASYPAISA_HASH_KEY`.
3. Test payment initiation, callback/hash verification, and admin marketing-order status updates.
4. Replace sandbox values with live credentials only after finance approval.
5. Flip `ENABLE_LOCAL_PAYMENTS=true` only after sandbox and live callback tests pass.

Cron:

1. Generate a strong random `CRON_SECRET`.
2. Add it to Vercel env vars.
3. Confirm every cron route checks the same secret before enabling production cron execution.

Optional production providers:

- `OPENAI_API_KEY` and `OPENAI_AUDIT_MODEL` for AI audit feedback.
- `OPEN_EXCHANGE_RATES_APP_ID` for exchange-rate refresh.
- `DAILY_CO_API_KEY` for virtual tours.
- `AFTERSHIP_API_KEY` for shipment tracking.
- `SANCTIONS_CHECK_API_KEY` for sanctions screening.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for rate limiting.
- `SENTRY_DSN` and `NEXT_PUBLIC_POSTHOG_KEY` for monitoring and analytics.

## 2. Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql` first. It is the current app-aligned schema and includes the operational tables needed by the portal flows.
3. Enable Row Level Security on every public table.
4. Add policies:
   - Public can read active suppliers, active products, published blog posts, export guides, community posts, awards, site_config, and active page_sections.
   - Buyers read/write their own buyer_companies, inquiries, quotes, orders, saved_items, inspections.
   - Sellers read/write their own supplier profile, products, documents, inquiries, quotes, orders, marketing orders.
   - Admin reads/writes all operational tables.
5. Run `supabase/seed.sql` for a development database. It creates demo auth users, profiles, suppliers, products, an inquiry, a quote, an order, escrow, admin tasks, a marketing order, community/blog content, awards, and home page sections.
6. Demo login emails created by `supabase/seed.sql`:
   - `admin@origino.test`
   - `seller@origino.test`
   - `buyer@origino.test`
   - Password for all three: `OriginoDemo123!`

Use the inline MVP SQL below only as a reference or emergency fallback. The maintained executable files are `supabase/schema.sql` and `supabase/seed.sql`.

### MVP Supabase SQL

Run this before flipping `NEXT_PUBLIC_USE_MOCK_DATA=false`.

```sql
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('buyer','seller','admin','agent')),
  phone text,
  country text,
  avatar_url text,
  whatsapp text,
  preferred_language text not null default 'en' check (preferred_language in ('en','ur')),
  two_fa_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  company_name_ur text,
  slug text not null unique,
  description text,
  description_ur text,
  city text not null,
  cluster text not null,
  category text not null,
  sub_categories text[] not null default '{}',
  verification_tier text not null default 'self_declared' check (verification_tier in ('unverified','self_declared','document_verified','site_visited','origino_certified')),
  audit_score integer,
  established_year integer,
  employee_count text,
  export_countries text[] not null default '{}',
  certifications text[] not null default '{}',
  hero_image_url text,
  logo_url text,
  video_url text,
  moq_usd numeric,
  lead_time_days text,
  payment_terms text[] not null default '{}',
  response_rate integer,
  response_time_hours numeric,
  health_score integer,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  name text not null,
  name_ur text,
  slug text not null unique,
  description text,
  description_ur text,
  category text not null,
  hs_code text,
  origin_story text,
  images text[] not null default '{}',
  price_usd_min numeric,
  price_usd_max numeric,
  moq integer not null default 1,
  moq_unit text not null default 'units',
  lead_time_days text not null default '30 days',
  sample_available boolean not null default false,
  sample_price_usd numeric,
  certifications text[] not null default '{}',
  specifications jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists buyer_companies (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  country text not null,
  industry text not null,
  annual_import_usd text,
  vat_number text,
  duns_number text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected','more_info')),
  audit_score integer,
  audit_breakdown jsonb,
  reviewer_id uuid references profiles(id),
  reviewer_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles(id),
  supplier_id uuid not null references suppliers(id),
  product_id uuid references products(id),
  status text not null default 'pending' check (status in ('pending','responded','countered','accepted','rejected','expired')),
  quantity integer not null,
  unit text not null default 'units',
  target_price_usd numeric,
  offered_price_usd numeric,
  final_price_usd numeric,
  currency text not null default 'USD',
  lead_time_requested text,
  lead_time_offered text,
  notes text,
  buyer_notes text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles(id),
  supplier_id uuid not null references suppliers(id),
  product_id uuid references products(id),
  status text not null default 'pending' check (status in ('pending','confirmed','in_production','quality_check','shipped','delivered','disputed','cancelled')),
  quantity integer not null,
  unit text not null default 'units',
  price_usd numeric not null,
  total_usd numeric not null,
  currency text not null default 'USD',
  payment_method text not null default 'stripe' check (payment_method in ('stripe','jazzcash','easypaisa','wire')),
  escrow_status text not null default 'not_started' check (escrow_status in ('not_started','funded','released','disputed','refunded')),
  tracking_number text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id),
  title text not null,
  body text not null,
  category text not null,
  tags text[] not null default '{}',
  upvotes integer not null default 0,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists awards (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id),
  category text not null,
  period text not null,
  rank integer not null,
  score integer not null,
  created_at timestamptz not null default now()
);

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  type text not null,
  "order" integer not null,
  content jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table buyer_companies enable row level security;
alter table applications enable row level security;
alter table quotes enable row level security;
alter table orders enable row level security;
alter table community_posts enable row level security;
alter table blog_posts enable row level security;
alter table awards enable row level security;
alter table page_sections enable row level security;

create policy "public read active suppliers" on suppliers for select using (is_active = true);
create policy "public read active products" on products for select using (is_active = true);
create policy "public read published blog" on blog_posts for select using (published = true);
create policy "public read community" on community_posts for select using (true);
create policy "public read awards" on awards for select using (true);
create policy "public read active page sections" on page_sections for select using (is_active = true);
create policy "profiles own read" on profiles for select using (auth.uid() = id);
create policy "profiles own update" on profiles for update using (auth.uid() = id);
create policy "buyer companies own" on buyer_companies for all using (auth.uid() = buyer_id);
create policy "applications own" on applications for all using (auth.uid() = profile_id);
create policy "suppliers owner write" on suppliers for all using (auth.uid() = profile_id);
```

Use the service-role key only for admin/server actions and seed scripts. Never expose it to browser code.

### Full v4 Schema Gap

The original ORIGINO v4 prompt describes 30+ production tables. The MVP SQL above is the minimum required for the current app boundary. Before launch, add the remaining production tables and policies from the v4 specification:

```text
supplier_documents, product_variants, price_tiers, product_ndas,
inquiries, inquiry_messages, rfq_requests, rfq_responses, reviews,
saved_items, saved_searches, buyer_subscriptions, agent_profiles,
marketing_service_orders, commissions, commission_config, referrals,
disputes, notifications, export_documentation_guides, government_schemes,
logistics_partners, sanctions_log, seller_performance_metrics, campaigns,
api_keys, activity_log, data_deletion_requests, bulk_inquiry_sessions,
supplier_response_templates, site_config, seller_agreement_versions,
admin_tasks, ab_tests, escrow_transactions, inspection_providers,
inspection_bookings, shipment_tracking, trade_finance_applications,
virtual_tours, landed_cost_calculations, community_comments,
competitive_intelligence, carbon_offsets
```

Do not flip production traffic to Supabase until the tables used by the active pages have seed rows and RLS policies. Mock mode deliberately keeps the UI testable while those tables are being provisioned.

## 3. Storage Buckets

Create these Supabase Storage buckets:

```text
supplier-logos
supplier-hero-images
product-images
supplier-documents
inspection-reports
catalog-pdfs
invoices
```

Make public buckets read-only for anonymous users where assets are public. Keep documents, reports, and invoices private with signed URLs.

## 4. Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Set Framework Preset: Next.js.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Add all environment variables from section 1.
7. Configure the production domain.
8. Add Stripe webhook URL: `https://YOUR_DOMAIN/api/stripe/webhook`.
9. Add Vercel Cron jobs for the cron routes from the v4 spec, protected by `CRON_SECRET`.

## 5. Flip From Mock To Supabase

1. Confirm `npm run build` passes with mock data.
2. Confirm Supabase migrations and seed data are present.
3. Create test rows for at least one buyer, one seller, five suppliers, ten products, one inquiry thread, one quote, one order, one escrow transaction, one admin task, and one marketing order.
4. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` locally first and restart `npm run dev`.
5. Test these flows locally: marketplace filters, supplier detail, product detail, login redirect, buyer inquiry creation, seller inquiry reply, quote counter/accept, order detail, escrow release/dispute, admin applications, admin suppliers, admin tasks, and site builder publish.
6. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in Vercel.
7. Redeploy and repeat the same production smoke test.

## 6. Page/Form Persistence Map

| Area | Current endpoint/service | Supabase target |
| --- | --- | --- |
| Homepage waitlist | `/api/join-waitlist` | `profiles` or `waitlist` table to add in production |
| Seller AI audit | `/api/submit-audit` | `applications`, then `suppliers` after approval |
| Marketplace/search | `lib/data-service.ts` | `suppliers`, `products`, future `saved_searches` |
| Supplier inquiry | `/api/contact-supplier` | `inquiries`, `inquiry_messages`, `notifications` |
| Product sample | `/api/sample-request` | `sample_requests`, `notifications` |
| Quotes | `/api/quotes`, `/api/quotes/[id]/accept`, `/counter` | `quotes`, `orders`, `escrow_transactions` |
| Orders | `/api/orders`, `/api/orders/report`, `/confirm`, `/track` | `orders`, shipment tracking tables |
| Buyer company | Buyer company page | `buyer_companies` |
| Inspections | `/api/inspection`, `/api/inspection/book` | `inspections` or `inspection_bookings` |
| Marketing packages | `/api/stripe/checkout`, local payment APIs | `marketing_service_orders`, payment transaction tables |
| Admin site builder | `/api/admin/site-builder` | `page_sections`, `site_config` |
| Community | `/api/community`, `/api/community/post` | `community_posts`, future `community_comments` |
| Blog/resources | `lib/data-service.ts` | `blog_posts`, `export_documentation_guides` |

## 7. AI Audit Connection

The audit route works without OpenAI. To enable generated feedback:

1. Set `OPENAI_API_KEY`.
2. Set `OPENAI_AUDIT_MODEL` to the model approved for your account.
3. Keep `NEXT_PUBLIC_USE_MOCK_DATA=true` if you only want AI feedback without database writes.
4. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` and send `profileId` with the audit payload to write to `applications`.
