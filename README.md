# ORIGINO — Pakistan's First Curated B2B Export Marketplace

A premium vintage-editorial B2B export marketplace connecting global buyers with Pakistan's finest verified manufacturers.

## Design Language

Built with a "vintage editorial journal meets private members club" aesthetic:
- **Colors**: Forest green (#2d4a3e), warm cream (#fdfbf8), terracotta (#c0623a), ink black (#1a1a18)
- **Typography**: Playfair Display (serif headlines) + DM Sans (body) + Courier Prime (metrics)
- **Imagery**: All B&W documentary-style photography with film grain
- **Badges**: Embroidered patch / letterman badge verification tiers
- **Layout**: Editorial grid, thin rules, generous whitespace — no cards

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Payments**: Stripe (international) + JazzCash + EasyPaisa (local PKR)
- **Email**: Resend
- **Fonts**: Google Fonts (Playfair Display, DM Sans, Courier Prime, Noto Nastaliq Urdu)

## Portals

| Portal | Path | Access |
|--------|------|--------|
| Public | `/` | All users |
| Marketplace | `/marketplace` | All users |
| Supplier | `/seller/*` | Verified sellers |
| Buyer | `/buyer/*` | Registered buyers |
| Admin | `/admin/*` | Admin only |

## Verification Tiers

1. ○ **Unverified** — Basic listing
2. ◈ **Self-Declared** — Company-submitted information
3. ◆ **Document Verified** — Legal docs reviewed
4. ◉ **Site Visited** — Factory inspected in person
5. ✦ **ORIGINO Certified** — Full certification with annual renewal

## Setup

```bash
# 1. Clone and install
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase, Stripe, JazzCash, EasyPaisa, Resend keys

# 3. Set up database
# Run supabase/schema.sql in your Supabase SQL editor

# 4. Run development server
npm run dev
```

## Key Pages

### Public
- `/` — Editorial homepage with B&W hero
- `/marketplace` — Faceted supplier search
- `/suppliers/[slug]` — Documentary supplier profile
- `/clusters/[slug]` — City cluster editorial features
- `/export-docs` — Vintage reference library
- `/landed-cost` — Cost calculator as vintage ledger
- `/awards` — Quarterly honours board
- `/compare` — Side-by-side editorial comparison
- `/community` — Club bulletin board forum
- `/blog` — Editorial journal

### Seller Portal (`/seller/*`)
- Dashboard, Onboarding (6-step AI audit), Profile, Products, Inquiries, Quotes, Orders, Documents, Performance, Marketing packages

### Buyer Portal (`/buyer/*`)
- Dashboard, Company Profile, Inquiries, Quotes, Orders, Saved, Compare, Inspections

### Admin Portal (`/admin/*`)
- Command Centre, Applications, Suppliers, Orders, Escrow Ledger, Marketing Orders, Site Builder

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/submit-audit` | POST | Calculate AI audit score |
| `/api/join-waitlist` | POST | Buyer waitlist signup |
| `/api/contact-supplier` | POST | Send inquiry |
| `/api/search` | GET | Faceted supplier search |
| `/api/rfq` | POST/GET | RFQ management |
| `/api/quotes` | POST/PATCH | Quote negotiation |
| `/api/orders` | POST/GET | Order management |
| `/api/orders/track` | GET | Shipment tracking |
| `/api/orders/confirm` | POST | Confirm order |
| `/api/escrow/fund` | POST | Fund escrow |
| `/api/escrow/release` | POST | Release funds |
| `/api/escrow/dispute` | POST | Open dispute |
| `/api/inspection` | POST | Book inspection |
| `/api/trade-finance` | POST | Apply for EFS |
| `/api/landed-cost/calculate` | POST | Calculate landed cost |
| `/api/sanctions` | POST | Sanctions screening |
| `/api/stripe/checkout` | POST | Stripe session |
| `/api/stripe/webhook` | POST | Stripe events |
| `/api/local-payment/jazzcash` | POST | JazzCash payment |
| `/api/local-payment/easypaisa` | POST | EasyPaisa payment |
| `/api/local-payment/verify` | POST | Verify local payment |
| `/api/nda/accept` | POST | Accept supplier NDA |
| `/api/virtual-tour/schedule` | POST | Book virtual tour |
| `/api/community` | POST/GET | Forum posts |
| `/api/reviews` | POST/GET | Supplier reviews |
| `/api/notifications` | GET/PATCH | User notifications |
| `/api/awards` | GET/POST | Supplier awards |
| `/api/exchange-rates` | GET | PKR/USD/EUR rates |
| `/api/generate-invoice` | POST | Generate PDF invoice |
| `/api/sla/check` | POST | SLA breach check (cron) |
| `/api/email-sequences/process` | POST | Email drips (cron) |
| `/api/saved-searches/notify` | POST | Search alerts (cron) |
| `/api/performance-metrics` | POST | Metrics update (cron) |

## Database Schema

**46 tables** including: profiles, suppliers, products, orders, quotes, escrow_transactions, inspections, shipment_tracking, trade_finance_applications, virtual_tours, saved_items, saved_searches, rfq_requests, rfq_responses, reviews, community_posts, community_comments, blog_posts, notifications, export_documentation_guides, government_schemes, logistics_partners, sanctions_log, seller_performance_metrics, awards, marketing_service_orders, commissions, commission_config, referrals, disputes, api_keys, activity_log, data_deletion_requests, bulk_inquiry_sessions, supplier_response_templates, site_config, page_sections, seller_agreement_versions, seller_agreement_acceptances, competitive_intelligence, carbon_offsets, ab_tests, admin_tasks, landed_cost_calculations, buyer_companies, applications

All tables include:
- UUID primary keys
- Row Level Security (RLS) policies
- Proper foreign key constraints  
- `_ur` columns for Urdu content (i18n)
- `updated_at` triggers

## Cron Jobs (Vercel Cron or similar)

```
# Every hour: Check SLA breaches
POST /api/sla/check

# Every 6 hours: Update exchange rates  
GET /api/exchange-rates

# Daily: Process email sequences
POST /api/email-sequences/process

# Daily: Notify saved search matches
POST /api/saved-searches/notify

# Weekly: Recalculate performance metrics
POST /api/performance-metrics

# Quarterly: Calculate supplier awards
POST /api/awards
```

## i18n

- English (default) + Urdu (RTL)
- Language toggle in navigation (EN / اردو)
- Urdu uses Noto Nastaliq Urdu font
- All content tables have `_ur` columns
- CSS logical properties for RTL layout

## Manufacturing Clusters Covered

| City | Speciality | Annual Exports |
|------|-----------|----------------|
| Sialkot | Surgical, Sports, Leather | $800M+ |
| Faisalabad | Textiles, Knitwear | $3.2B+ |
| Lahore | Fashion, Furniture, Pharma | $1.4B+ |
| Karachi | Chemicals, Seafood, Engineering | $5.1B+ |
| Gujranwala | Steel, Ceramics, Electrical | $600M+ |
