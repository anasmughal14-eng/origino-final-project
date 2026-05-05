import type {
  Application,
  Award,
  BlogPost,
  BuyerCompany,
  CommunityPost,
  EscrowTransaction,
  MarketingServiceOrder,
  Order,
  PageSection,
  Product,
  Profile,
  Quote,
  Supplier,
} from "@/types/database";

export type Inquiry = {
  id: string;
  supplier_id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_company: string;
  subject: string;
  message: string;
  quantity: number;
  product_id: string | null;
  status: "unread" | "read" | "replied" | "quoted";
  intent_score: number;
  created_at: string;
  replies: { id: string; author: "buyer" | "seller"; body: string; created_at: string }[];
};

export type ExportGuide = {
  slug: string;
  title: string;
  category: string;
  market: string;
  summary: string;
  body: string[];
  issuingAuthority: string;
  costEstimate: string;
  timeEstimate: string;
  related: string[];
};

export type AdminTask = {
  id: string;
  title: string;
  type: "sla_breach" | "sanctions_review" | "document_expiry" | "application_review" | "manual_follow_up";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "blocked" | "completed";
  assigned_to: string | null;
  linked_entity_type: "marketing_order" | "application" | "supplier" | "document" | "escrow";
  linked_entity_id: string;
  linked_href: string;
  due_at: string;
  notes: string | null;
  created_at: string;
};

export type Cluster = {
  slug: string;
  city: string;
  tagline: string;
  primaryCategories: string[];
  secondaryCategories: string[];
  exportShare: string;
  keyBuyers: string[];
  story: string;
  certifications: string[];
};

const now = "2026-05-03T09:00:00.000Z";

export const mockPageSections: PageSection[] = [
  {
    id: "home-hero",
    page: "home",
    type: "hero",
    order: 1,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Curated Sourcing From Pakistan",
      eyebrow_ur: "پاکستان ایکسپورٹ مارکیٹ پلیس",
      title: "Selected Pakistani manufacturers, seen with proof.",
      title_ur: "تصدیق شدہ پاکستانی مینوفیکچررز سے سورس کریں۔",
      description: "For global buyers who need fewer names, clearer evidence, and export-ready work from Pakistan.",
      description_ur: "ORIGINO عالمی خریداروں کو سیالکوٹ، فیصل آباد، لاہور، کراچی اور گوجرانوالہ کے ایکسپورٹ کے لیے تیار سپلائرز سے جوڑتا ہے۔",
    },
  },
  {
    id: "home-clusters",
    page: "home",
    type: "clusters",
    order: 2,
    is_active: true,
    created_at: now,
    content: {
      title: "Manufacturing Clusters",
      title_ur: "مینوفیکچرنگ کلسٹرز",
    },
  },
  {
    id: "home-featured",
    page: "home",
    type: "featured_suppliers",
    order: 3,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Featured Suppliers",
      eyebrow_ur: "نمایاں سپلائرز",
      title: "Buyer-ready exporters",
      title_ur: "خریداروں کے لیے تیار ایکسپورٹرز",
    },
  },
  {
    id: "home-trust",
    page: "home",
    type: "trust",
    order: 4,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Trust Layer",
      eyebrow_ur: "اعتماد کی تہہ",
      title: "Verification before introduction",
      title_ur: "تعارف سے پہلے تصدیق",
    },
  },
  {
    id: "home-audit",
    page: "home",
    type: "audit",
    order: 5,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Seller Audit",
      eyebrow_ur: "سیلر آڈٹ",
      title: "A strict gate for export readiness",
      title_ur: "ایکسپورٹ تیاری کے لیے سخت معیار",
    },
  },
  {
    id: "home-rfq",
    page: "home",
    type: "rfq",
    order: 6,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Buyer Sourcing",
      eyebrow_ur: "خریدار سورسنگ",
      title: "Start with a marketplace search or RFQ",
      title_ur: "مارکیٹ پلیس سرچ یا RFQ سے آغاز کریں",
    },
  },
  {
    id: "home-tools",
    page: "home",
    type: "tools",
    order: 7,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Trade Desk",
      eyebrow_ur: "ٹریڈ ڈیسک",
      title: "Tools buyers need before they send an RFQ",
      title_ur: "RFQ بھیجنے سے پہلے خریداروں کے لیے ضروری ٹولز",
    },
  },
  {
    id: "home-waitlist",
    page: "home",
    type: "waitlist",
    order: 8,
    is_active: true,
    created_at: now,
    content: {
      eyebrow: "Buyer Updates",
      eyebrow_ur: "خریدار اپ ڈیٹس",
      title: "Get early sourcing updates",
      title_ur: "سورسنگ اپ ڈیٹس جلد حاصل کریں",
    },
  },
];

export const mockProfiles: Profile[] = [
  { id: "buyer-1", email: "buyer@hansa-imports.de", full_name: "Marta Klein", role: "buyer", phone: "+49 30 5550 810", country: "Germany", created_at: now, updated_at: now, avatar_url: null, whatsapp: null, preferred_language: "en", two_fa_enabled: false },
  { id: "buyer-2", email: "sourcing@marina-trading.ae", full_name: "Omar Haddad", role: "buyer", phone: "+971 4 555 1400", country: "UAE", created_at: now, updated_at: now, avatar_url: null, whatsapp: null, preferred_language: "en", two_fa_enabled: false },
  { id: "seller-1", email: "exports@crescent-surgical.pk", full_name: "Adeel Qureshi", role: "seller", phone: "+92 52 3569001", country: "Pakistan", created_at: now, updated_at: now, avatar_url: null, whatsapp: "+923001234567", preferred_language: "en", two_fa_enabled: false },
  { id: "seller-2", email: "sales@nishat-weaves.pk", full_name: "Sana Mahmood", role: "seller", phone: "+92 41 8722211", country: "Pakistan", created_at: now, updated_at: now, avatar_url: null, whatsapp: "+923111122233", preferred_language: "ur", two_fa_enabled: false },
  { id: "admin-1", email: "admin@origino.store", full_name: "ORIGINO Admin", role: "admin", phone: null, country: "Pakistan", created_at: now, updated_at: now, avatar_url: null, whatsapp: null, preferred_language: "en", two_fa_enabled: true },
];

export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1", profile_id: "seller-1", company_name: "Crescent Surgical Works", company_name_ur: "کریسنٹ سرجیکل ورکس", slug: "crescent-surgical-works",
    description: "Sialkot manufacturer of reusable surgical and dental instruments for EU distributors.", description_ur: null, city: "Sialkot", cluster: "sialkot", category: "Surgical & Medical Instruments",
    sub_categories: ["General Surgery", "Dental", "Orthopedic"], verification_tier: "origino_certified", audit_score: 91, established_year: 1998, employee_count: "101-250",
    export_countries: ["Germany", "United Kingdom", "UAE"], certifications: ["ISO 13485", "CE", "FDA registered"], hero_image_url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80", logo_url: null, video_url: null,
    moq_usd: 2500, lead_time_days: "21-35", payment_terms: ["FOB", "CIF", "Wire", "Escrow"], response_rate: 96, response_time_hours: 5, health_score: 92, is_active: true, is_featured: true, created_at: now, updated_at: now,
  },
  {
    id: "sup-2", profile_id: "seller-2", company_name: "Nishat Weaves Faisalabad", company_name_ur: "نشاط ویوز فیصل آباد", slug: "nishat-weaves-faisalabad",
    description: "OEKO-TEX certified home textile and knitwear exporter serving EU retailers.", description_ur: null, city: "Faisalabad", cluster: "faisalabad", category: "Textiles & Apparel",
    sub_categories: ["Home Textiles", "Knitwear", "Garments"], verification_tier: "site_visited", audit_score: 84, established_year: 2007, employee_count: "251-500",
    export_countries: ["Netherlands", "Spain", "Saudi Arabia"], certifications: ["OEKO-TEX", "BSCI", "GOTS"], hero_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80", logo_url: null, video_url: null,
    moq_usd: 5000, lead_time_days: "30-45", payment_terms: ["FOB", "LC", "Wire"], response_rate: 89, response_time_hours: 9, health_score: 83, is_active: true, is_featured: true, created_at: now, updated_at: now,
  },
  {
    id: "sup-3", profile_id: "seller-3", company_name: "Lahore Leather Company", company_name_ur: null, slug: "lahore-leather-company",
    description: "Full-grain leather bags, footwear uppers, and small accessories for boutique importers.", description_ur: null, city: "Lahore", cluster: "lahore", category: "Leather Goods",
    sub_categories: ["Bags & Accessories", "Footwear", "Garments"], verification_tier: "document_verified", audit_score: 77, established_year: 2012, employee_count: "51-100",
    export_countries: ["Italy", "France", "Qatar"], certifications: ["SECP registered", "ISO 9001"], hero_image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80", logo_url: null, video_url: null,
    moq_usd: 3000, lead_time_days: "25-40", payment_terms: ["FOB", "Wire"], response_rate: 81, response_time_hours: 14, health_score: 76, is_active: true, is_featured: false, created_at: now, updated_at: now,
  },
  {
    id: "sup-4", profile_id: "seller-4", company_name: "Karachi Agro Foods", company_name_ur: null, slug: "karachi-agro-foods",
    description: "Rice, spices, and processed food exporter with Halal and HACCP documentation.", description_ur: null, city: "Karachi", cluster: "karachi", category: "Food & Agriculture",
    sub_categories: ["Rice", "Spices", "Processed Food"], verification_tier: "site_visited", audit_score: 82, established_year: 2003, employee_count: "101-250",
    export_countries: ["UAE", "Malaysia", "United Kingdom"], certifications: ["Halal", "HACCP", "ISO 22000"], hero_image_url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80", logo_url: null, video_url: null,
    moq_usd: 8000, lead_time_days: "14-28", payment_terms: ["CIF", "LC", "Wire"], response_rate: 93, response_time_hours: 7, health_score: 88, is_active: true, is_featured: true, created_at: now, updated_at: now,
  },
  {
    id: "sup-5", profile_id: "seller-5", company_name: "Gujranwala Tools & Cutlery", company_name_ur: null, slug: "gujranwala-tools-cutlery",
    description: "Hand tools, cutlery, and light engineering parts for hardware distributors.", description_ur: null, city: "Gujranwala", cluster: "gujranwala", category: "Engineering & Light Manufacturing",
    sub_categories: ["Cutlery", "Hand Tools", "Fasteners"], verification_tier: "self_declared", audit_score: 64, established_year: 2016, employee_count: "26-50",
    export_countries: ["Germany", "Poland"], certifications: ["ISO 9001"], hero_image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80", logo_url: null, video_url: null,
    moq_usd: 1500, lead_time_days: "20-30", payment_terms: ["EXW", "FOB"], response_rate: 72, response_time_hours: 22, health_score: 61, is_active: true, is_featured: false, created_at: now, updated_at: now,
  },
];

export const mockProducts: Product[] = [
  { id: "prod-1", supplier_id: "sup-1", name: "German Pattern Surgical Scissors", name_ur: null, slug: "german-pattern-surgical-scissors", description: "Reusable stainless-steel surgical scissors with passivation and CE documentation.", description_ur: null, category: "Surgical & Medical Instruments", hs_code: "9018.90", origin_story: "Made in Sialkot's precision instrument cluster.", images: ["https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=900&q=80"], price_usd_min: 2.4, price_usd_max: 6.8, moq: 1000, moq_unit: "pieces", lead_time_days: "25", sample_available: true, sample_price_usd: 45, certifications: ["ISO 13485", "CE"], specifications: { Material: "AISI 420 stainless steel", Finish: "Satin", Sterilization: "Autoclave safe" }, is_active: true, created_at: now },
  { id: "prod-2", supplier_id: "sup-1", name: "Dental Extraction Forceps Set", name_ur: null, slug: "dental-extraction-forceps-set", description: "Adult forceps set packed for distributor private label programs.", description_ur: null, category: "Surgical & Medical Instruments", hs_code: "9018.49", origin_story: "Hand-finished in Sialkot.", images: ["https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80"], price_usd_min: 38, price_usd_max: 62, moq: 100, moq_unit: "sets", lead_time_days: "30", sample_available: true, sample_price_usd: 70, certifications: ["ISO 13485"], specifications: { Pieces: "10", Steel: "Medical grade", Packaging: "Private label box" }, is_active: true, created_at: now },
  { id: "prod-3", supplier_id: "sup-2", name: "OEKO-TEX Terry Towel Set", name_ur: null, slug: "oeko-tex-terry-towel-set", description: "Hotel and retail towel programs in cotton terry.", description_ur: null, category: "Textiles & Apparel", hs_code: "6302.60", origin_story: "Woven and finished in Faisalabad.", images: ["https://images.unsplash.com/photo-1600369672770-985fd30004eb?auto=format&fit=crop&w=900&q=80"], price_usd_min: 4.8, price_usd_max: 12.5, moq: 500, moq_unit: "sets", lead_time_days: "35", sample_available: true, sample_price_usd: 25, certifications: ["OEKO-TEX", "BSCI"], specifications: { GSM: "500-650", Cotton: "100%", Sizes: "Custom" }, is_active: true, created_at: now },
  { id: "prod-4", supplier_id: "sup-2", name: "Organic Cotton Knit Hoodie", name_ur: null, slug: "organic-cotton-knit-hoodie", description: "Cut-and-sew hoodie for ethical apparel brands.", description_ur: null, category: "Textiles & Apparel", hs_code: "6110.20", origin_story: "Knitted, dyed, and stitched in Faisalabad.", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"], price_usd_min: 8.5, price_usd_max: 16, moq: 800, moq_unit: "pieces", lead_time_days: "45", sample_available: true, sample_price_usd: 55, certifications: ["GOTS", "OEKO-TEX"], specifications: { Fabric: "320 GSM fleece", Sizes: "XS-XXL", Label: "Private label" }, is_active: true, created_at: now },
  { id: "prod-5", supplier_id: "sup-3", name: "Full Grain Leather Tote", name_ur: null, slug: "full-grain-leather-tote", description: "Vegetable-tanned leather tote for boutique retail.", description_ur: null, category: "Leather Goods", hs_code: "4202.21", origin_story: "Patterned and stitched in Lahore.", images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"], price_usd_min: 24, price_usd_max: 48, moq: 150, moq_unit: "pieces", lead_time_days: "40", sample_available: true, sample_price_usd: 75, certifications: ["ISO 9001"], specifications: { Leather: "Full grain cowhide", Lining: "Cotton twill", Hardware: "Antique brass" }, is_active: true, created_at: now },
  { id: "prod-6", supplier_id: "sup-3", name: "Leather Safety Shoe Upper", name_ur: null, slug: "leather-safety-shoe-upper", description: "Industrial footwear uppers for assembly factories.", description_ur: null, category: "Leather Goods", hs_code: "6406.10", origin_story: "Lahore leather cluster production.", images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80"], price_usd_min: 7, price_usd_max: 13, moq: 1000, moq_unit: "pairs", lead_time_days: "30", sample_available: false, sample_price_usd: null, certifications: ["SECP registered"], specifications: { Leather: "Buffalo corrected grain", Thickness: "1.8-2.0 mm", Color: "Black or brown" }, is_active: true, created_at: now },
  { id: "prod-7", supplier_id: "sup-4", name: "1121 Sella Basmati Rice", name_ur: null, slug: "1121-sella-basmati-rice", description: "Export-grade long grain basmati rice in private label bags.", description_ur: null, category: "Food & Agriculture", hs_code: "1006.30", origin_story: "Milled near Karachi export corridor.", images: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80"], price_usd_min: 980, price_usd_max: 1220, moq: 1, moq_unit: "20ft container", lead_time_days: "21", sample_available: true, sample_price_usd: 35, certifications: ["Halal", "HACCP"], specifications: { Grain: "1121 Sella", Broken: "Max 2%", Packing: "5kg/10kg/25kg" }, is_active: true, created_at: now },
  { id: "prod-8", supplier_id: "sup-4", name: "Halal Spice Blend Range", name_ur: null, slug: "halal-spice-blend-range", description: "Retail spice blends for Middle East supermarkets.", description_ur: null, category: "Food & Agriculture", hs_code: "0910.99", origin_story: "Blended and packed in Karachi.", images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80"], price_usd_min: 0.65, price_usd_max: 1.4, moq: 5000, moq_unit: "packs", lead_time_days: "28", sample_available: true, sample_price_usd: 20, certifications: ["Halal", "ISO 22000"], specifications: { Pack: "50g-200g", ShelfLife: "18 months", Label: "Arabic/English" }, is_active: true, created_at: now },
  { id: "prod-9", supplier_id: "sup-5", name: "Stainless Kitchen Knife Set", name_ur: null, slug: "stainless-kitchen-knife-set", description: "Retail boxed kitchen knife set for hardware chains.", description_ur: null, category: "Engineering & Light Manufacturing", hs_code: "8211.10", origin_story: "Forged and sharpened in Gujranwala.", images: ["https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=900&q=80"], price_usd_min: 6.5, price_usd_max: 14, moq: 1000, moq_unit: "sets", lead_time_days: "30", sample_available: true, sample_price_usd: 40, certifications: ["ISO 9001"], specifications: { Steel: "3Cr13", Handle: "PP or wood", Pieces: "5" }, is_active: true, created_at: now },
  { id: "prod-10", supplier_id: "sup-5", name: "Drop Forged Combination Spanner", name_ur: null, slug: "drop-forged-combination-spanner", description: "Chrome vanadium hand tools for German distributors.", description_ur: null, category: "Engineering & Light Manufacturing", hs_code: "8204.11", origin_story: "Gujranwala toolmaking line.", images: ["https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?auto=format&fit=crop&w=900&q=80"], price_usd_min: 0.75, price_usd_max: 2.1, moq: 3000, moq_unit: "pieces", lead_time_days: "35", sample_available: true, sample_price_usd: 30, certifications: ["ISO 9001"], specifications: { Material: "Cr-V", Finish: "Mirror polish", Sizes: "6-32 mm" }, is_active: true, created_at: now },
];

export const mockOrders: Order[] = Array.from({ length: 8 }, (_, index) => {
  const product = mockProducts[index % mockProducts.length];
  const statuses: Order["status"][] = ["confirmed", "in_production", "quality_check", "shipped", "delivered", "pending", "disputed", "confirmed"];
  return {
    id: `ord-${index + 1}`,
    buyer_id: index % 2 === 0 ? "buyer-1" : "buyer-2",
    supplier_id: product.supplier_id,
    product_id: product.id,
    status: statuses[index],
    quantity: [1000, 300, 800, 1200, 200, 1, 5000, 2200][index],
    unit: product.moq_unit,
    price_usd: [5400, 18600, 7600, 12800, 9200, 24500, 8800, 6900][index],
    total_usd: [5400, 18600, 7600, 12800, 9200, 24500, 8800, 6900][index],
    currency: "USD",
    payment_method: index % 3 === 0 ? "stripe" : "wire",
    escrow_status: index % 4 === 0 ? "released" : index % 3 === 0 ? "funded" : "not_started",
    tracking_number: index > 2 ? `ORGN${2026000 + index}` : null,
    notes: "Mock order ready for portal workflow testing.",
    created_at: `2026-0${(index % 5) + 1}-12T10:00:00.000Z`,
    updated_at: now,
  };
});

export const mockQuotes: Quote[] = Array.from({ length: 6 }, (_, index) => {
  const product = mockProducts[index];
  const statuses: Quote["status"][] = ["pending", "responded", "countered", "accepted", "rejected", "expired"];
  return {
    id: `quo-${index + 1}`,
    buyer_id: index % 2 === 0 ? "buyer-1" : "buyer-2",
    supplier_id: product.supplier_id,
    product_id: product.id,
    status: statuses[index],
    quantity: [1000, 100, 500, 800, 150, 1000][index],
    unit: product.moq_unit,
    target_price_usd: product.price_usd_min,
    offered_price_usd: product.price_usd_max,
    final_price_usd: statuses[index] === "accepted" ? product.price_usd_max : null,
    currency: "USD",
    lead_time_requested: "30 days",
    lead_time_offered: product.lead_time_days,
    notes: "Includes export packing and commercial invoice.",
    buyer_notes: "Please confirm private label options.",
    expires_at: "2026-06-03T09:00:00.000Z",
    created_at: `2026-04-${10 + index}T09:00:00.000Z`,
    updated_at: now,
  };
});

export const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: "esc-1",
    order_id: "ord-3",
    amount_usd: 18400,
    currency: "USD",
    status: "funded",
    stripe_payment_intent: "pi_mock_sialkot_escrow",
    funded_at: "2026-04-22T09:00:00.000Z",
    released_at: null,
    dispute_reason: null,
    created_at: "2026-04-22T09:00:00.000Z",
  },
  {
    id: "esc-2",
    order_id: "ord-6",
    amount_usd: 27200,
    currency: "USD",
    status: "funded",
    stripe_payment_intent: "pi_mock_textile_escrow",
    funded_at: "2026-04-27T11:30:00.000Z",
    released_at: null,
    dispute_reason: null,
    created_at: "2026-04-27T11:30:00.000Z",
  },
  {
    id: "esc-3",
    order_id: "ord-4",
    amount_usd: 9600,
    currency: "USD",
    status: "released",
    stripe_payment_intent: "pi_mock_leather_release",
    funded_at: "2026-03-18T08:00:00.000Z",
    released_at: "2026-04-02T14:20:00.000Z",
    dispute_reason: null,
    created_at: "2026-03-18T08:00:00.000Z",
  },
];

export const mockMarketingServiceOrders: MarketingServiceOrder[] = [
  {
    id: "mkt-1",
    supplier_id: "sup-1",
    tier: "growth",
    price_usd: 799,
    status: "in_progress",
    payment_method: "stripe",
    local_payment_reference: null,
    paid_at: "2026-04-12T09:00:00.000Z",
    sla_due_at: "2026-05-24T18:00:00.000Z",
    sla_status: "on_track",
    assigned_to: "Brand Studio",
    delay_notes: null,
    starts_at: "2026-04-12T09:00:00.000Z",
    expires_at: "2026-07-12T09:00:00.000Z",
    created_at: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "mkt-2",
    supplier_id: "sup-5",
    tier: "basic",
    price_usd: 299,
    status: "breached",
    payment_method: "bank_transfer",
    local_payment_reference: "ORIGINO-BANK-2048",
    paid_at: "2026-03-20T10:30:00.000Z",
    sla_due_at: "2026-04-10T18:00:00.000Z",
    sla_status: "breached",
    assigned_to: null,
    delay_notes: "Logo concepts delayed; supplier has not received revised product overview.",
    starts_at: "2026-03-20T10:30:00.000Z",
    expires_at: "2026-06-20T10:30:00.000Z",
    created_at: "2026-03-20T10:30:00.000Z",
  },
  {
    id: "mkt-3",
    supplier_id: "sup-3",
    tier: "premium",
    price_usd: 1999,
    status: "in_progress",
    payment_method: "jazzcash",
    local_payment_reference: "JC-847220",
    paid_at: "2026-04-01T11:00:00.000Z",
    sla_due_at: "2026-06-10T18:00:00.000Z",
    sla_status: "at_risk",
    assigned_to: "Growth Team",
    delay_notes: "Video shoot date pending confirmation; account manager follow-up required.",
    starts_at: "2026-04-01T11:00:00.000Z",
    expires_at: "2026-07-01T11:00:00.000Z",
    created_at: "2026-04-01T11:00:00.000Z",
  },
];

export const mockAdminTasks: AdminTask[] = [
  {
    id: "task-1",
    title: "Recover breached Basic package delivery",
    type: "sla_breach",
    priority: "urgent",
    status: "open",
    assigned_to: null,
    linked_entity_type: "marketing_order",
    linked_entity_id: "mkt-2",
    linked_href: "/admin/marketing-orders",
    due_at: "2026-05-03T18:00:00.000Z",
    notes: "Gujranwala Tools & Cutlery is past SLA. Assign owner and contact supplier within 24 hours.",
    created_at: "2026-05-03T08:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Review Gujranwala Tools application",
    type: "application_review",
    priority: "high",
    status: "in_progress",
    assigned_to: "Admin Ops",
    linked_entity_type: "application",
    linked_entity_id: "app-2",
    linked_href: "/admin/applications/app-2",
    due_at: "2026-05-04T12:00:00.000Z",
    notes: "Conditional audit score. Confirm website/photo gap and marketing package path.",
    created_at: "2026-05-01T11:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Sanctions queue re-check for updated supplier data",
    type: "sanctions_review",
    priority: "urgent",
    status: "open",
    assigned_to: "Compliance",
    linked_entity_type: "supplier",
    linked_entity_id: "sup-5",
    linked_href: "/admin/sanctions",
    due_at: "2026-05-03T16:00:00.000Z",
    notes: "Supplier changed export-market details; run OFAC/UN/EU/HMT re-screen before approval.",
    created_at: "2026-05-03T09:30:00.000Z",
  },
  {
    id: "task-4",
    title: "ISO certificate expires in 30 days",
    type: "document_expiry",
    priority: "medium",
    status: "open",
    assigned_to: "Document Vault",
    linked_entity_type: "document",
    linked_entity_id: "doc-iso-sup-1",
    linked_href: "/admin/documents",
    due_at: "2026-05-20T18:00:00.000Z",
    notes: "Request updated ISO 13485 certificate from Crescent Surgical Works.",
    created_at: "2026-05-02T10:00:00.000Z",
  },
];

export const mockInquiries: Inquiry[] = [
  { id: "inq-1", supplier_id: "sup-1", buyer_id: "buyer-1", buyer_name: "Marta Klein", buyer_company: "Hansa Medical Imports", subject: "CE forceps program", message: "We need CE-ready extraction forceps for German dental distributors.", quantity: 500, product_id: "prod-2", status: "unread", intent_score: 88, created_at: "2026-05-01T10:00:00.000Z", replies: [] },
  { id: "inq-2", supplier_id: "sup-2", buyer_id: "buyer-2", buyer_name: "Omar Haddad", buyer_company: "Marina Trading LLC", subject: "Hotel towel tender", message: "Please quote white terry towel sets for a UAE hotel group.", quantity: 1200, product_id: "prod-3", status: "read", intent_score: 76, created_at: "2026-04-29T11:00:00.000Z", replies: [{ id: "rep-1", author: "seller", body: "We can support OEKO-TEX towels in 35 days.", created_at: "2026-04-29T15:00:00.000Z" }] },
  { id: "inq-3", supplier_id: "sup-4", buyer_id: "buyer-2", buyer_name: "Omar Haddad", buyer_company: "Marina Trading LLC", subject: "Halal spice private label", message: "Need Arabic/English packaging for retail spice blends.", quantity: 10000, product_id: "prod-8", status: "quoted", intent_score: 82, created_at: "2026-04-25T08:30:00.000Z", replies: [] },
  { id: "inq-4", supplier_id: "sup-5", buyer_id: "buyer-1", buyer_name: "Marta Klein", buyer_company: "Hansa Hardware GmbH", subject: "DIN spanner samples", message: "Can you provide mirror polish spanner samples with DIN markings?", quantity: 3000, product_id: "prod-10", status: "replied", intent_score: 69, created_at: "2026-04-20T12:00:00.000Z", replies: [{ id: "rep-2", author: "seller", body: "Samples can ship next week by DHL.", created_at: "2026-04-20T14:00:00.000Z" }] },
];

export const mockCommunityPosts: CommunityPost[] = [
  { id: "post-1", author_id: "seller-1", title: "How Sialkot exporters prepare CE technical files", body: "A practical checklist for technical files, declarations, and buyer evidence requests.", category: "export_tips", tags: ["CE", "Sialkot", "Surgical"], upvotes: 24, is_pinned: true, created_at: "2026-04-20T10:00:00.000Z" },
  { id: "post-2", author_id: "seller-2", title: "EU buyers are asking for OEKO-TEX before price", body: "Our latest textile inquiries show certification proof is requested before negotiation.", category: "market_insights", tags: ["Textiles", "EU"], upvotes: 18, is_pinned: false, created_at: "2026-04-24T10:00:00.000Z" },
  { id: "post-3", author_id: "buyer-1", title: "What makes a good first sample pack?", body: "Buyers need labelled samples, spec sheets, and realistic lead time notes.", category: "q_and_a", tags: ["Samples", "Buyers"], upvotes: 12, is_pinned: false, created_at: "2026-04-27T10:00:00.000Z" },
];

export const mockBlogPosts: BlogPost[] = [
  { id: "blog-1", author_id: "admin-1", title: "Why German buyers still source surgical instruments from Sialkot", slug: "german-buyers-sialkot-surgical-instruments", excerpt: "A look at precision manufacturing, ISO 13485, and the buyer trust signals that matter.", body: "Sialkot remains a global surgical instrument center because experienced workshops combine skilled finishing with export documentation discipline.\n\nFor German procurement teams, the decisive signals are ISO 13485, CE documentation, batch traceability, and fast technical replies.", cover_image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80", tags: ["Sialkot", "Surgical"], published: true, published_at: "2026-04-18T10:00:00.000Z", created_at: "2026-04-18T10:00:00.000Z" },
  { id: "blog-2", author_id: "admin-1", title: "Pakistan GSP+ benefits for EU textile importers", slug: "pakistan-gsp-plus-eu-textile-importers", excerpt: "How rules of origin and documentation can change landed cost for textile buyers.", body: "Pakistan's GSP+ status can reduce import duties for eligible EU textile shipments.\n\nThe commercial advantage only works when suppliers prepare certificates of origin, direct shipment evidence, and buyer-ready documentation.", cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80", tags: ["Textiles", "GSP+"], published: true, published_at: "2026-04-22T10:00:00.000Z", created_at: "2026-04-22T10:00:00.000Z" },
];

export const mockAwards: Award[] = [
  { id: "award-1", supplier_id: "sup-1", category: "Top Exporter", period: "Q2 2026", rank: 1, score: 96, created_at: now },
  { id: "award-2", supplier_id: "sup-2", category: "Most Responsive", period: "Q2 2026", rank: 1, score: 91, created_at: now },
  { id: "award-3", supplier_id: "sup-4", category: "Buyer Choice", period: "Q1 2026", rank: 1, score: 88, created_at: now },
];

export const mockBuyerCompanies: BuyerCompany[] = [
  { id: "bc-1", buyer_id: "buyer-1", company_name: "Hansa Medical Imports GmbH", country: "Germany", industry: "Medical Distribution", annual_import_usd: "$1M-$5M", vat_number: "DE123456789", duns_number: "315000111", verified: true, created_at: now },
];

export const mockApplications: Application[] = [
  {
    id: "app-1",
    profile_id: "seller-1",
    full_name: "Usman Malik",
    email: "exports@crescentsurgical.pk",
    phone: "+92 52 355 1844",
    company_name: "Crescent Surgical Works",
    city: "Sialkot",
    province: "Punjab",
    product_category: "Surgical & Medical Instruments",
    years_in_business: 18,
    product_description: "Reusable German-pattern surgical scissors, forceps, and dental instruments for EU distributors.",
    certifications: "ISO 13485, CE, FDA registered",
    has_exported: true,
    export_countries: "Germany, United Kingdom, United Arab Emirates",
    has_logo: true,
    has_website: true,
    has_social: true,
    has_photography: true,
    has_packaging: true,
    target_markets: "EU medical procurement and private hospital distributors",
    production_capacity: "45,000 instruments per month with in-house polishing and passivation",
    hs_code: "9018.90",
    status: "approved",
    audit_score: 91,
    audit_breakdown: { brand: 23, digital: 22, export: 19, product: 14, operations: 9, compliance: 4 },
    audit_ai_feedback: "As a Sialkot surgical exporter targeting EU medical procurement, Crescent already has the core ISO 13485 and CE signals buyers expect. The next priority is keeping technical files and batch traceability visible during supplier review.",
    reviewer_id: "admin-1",
    reviewer_notes: "Strong EU documentation.",
    admin_notes: "Approved for document-verified listing and site visit scheduling.",
    marketing_package_purchased: null,
    sanctions_check_passed: true,
    sanctions_checked_at: "2026-04-01T10:15:00.000Z",
    submitted_at: "2026-04-01T10:00:00.000Z",
    reviewed_at: "2026-04-02T10:00:00.000Z",
  },
  {
    id: "app-2",
    profile_id: "seller-5",
    full_name: "Hamza Butt",
    email: "sales@gujranwalatools.pk",
    phone: "+92 55 384 2040",
    company_name: "Gujranwala Tools & Cutlery",
    city: "Gujranwala",
    province: "Punjab",
    product_category: "Engineering & Light Manufacturing",
    years_in_business: 11,
    product_description: "Kitchen knives, utility blades, hand tools, and private-label cutlery for hardware retailers.",
    certifications: "ISO 9001 in progress",
    has_exported: true,
    export_countries: "United Arab Emirates, Saudi Arabia",
    has_logo: true,
    has_website: false,
    has_social: true,
    has_photography: false,
    has_packaging: true,
    target_markets: "German hardware stores and GCC distributors",
    production_capacity: "12,000 cutlery sets per month with outsourced packaging",
    hs_code: "8211.91",
    status: "pending",
    audit_score: 64,
    audit_breakdown: { brand: 14, digital: 12, export: 14, product: 11, operations: 8, compliance: 5 },
    audit_ai_feedback: "For a Gujranwala cutlery manufacturer targeting German hardware buyers, the missing website and product photography will block procurement review even if pricing is competitive. DIN-ready specifications and material-grade sheets should be prepared before approval.",
    reviewer_id: null,
    reviewer_notes: null,
    admin_notes: null,
    marketing_package_purchased: "basic",
    sanctions_check_passed: true,
    sanctions_checked_at: "2026-05-01T10:20:00.000Z",
    submitted_at: "2026-05-01T10:00:00.000Z",
    reviewed_at: null,
  },
  {
    id: "app-3",
    profile_id: "seller-3",
    full_name: "Ayesha Rahman",
    email: "exports@lahoreleather.pk",
    phone: "+92 42 3579 4410",
    company_name: "Lahore Leather Company",
    city: "Lahore",
    province: "Punjab",
    product_category: "Leather Goods",
    years_in_business: 9,
    product_description: "Full-grain leather bags, footwear uppers, and small accessories for boutique importers.",
    certifications: "SECP registered, ISO 9001",
    has_exported: false,
    export_countries: "",
    has_logo: true,
    has_website: true,
    has_social: true,
    has_photography: true,
    has_packaging: false,
    target_markets: "EU leather goods importers and GCC boutique retailers",
    production_capacity: "3,500 bags per month with seasonal artisan capacity",
    hs_code: "4202.21",
    status: "reviewing",
    audit_score: 77,
    audit_breakdown: { brand: 18, digital: 16, export: 17, product: 12, operations: 9, compliance: 5 },
    audit_ai_feedback: "As a Lahore leather supplier targeting EU boutiques, the brand story and photography are strong, but export packaging and buyer-ready incoterm clarity need attention before the listing can be promoted.",
    reviewer_id: null,
    reviewer_notes: null,
    admin_notes: "Review packaging readiness and export-country evidence.",
    marketing_package_purchased: "growth",
    sanctions_check_passed: true,
    sanctions_checked_at: "2026-04-25T10:20:00.000Z",
    submitted_at: "2026-04-25T10:00:00.000Z",
    reviewed_at: null,
  },
];

export const mockClusters: Cluster[] = [
  { slug: "sialkot", city: "Sialkot", tagline: "World Capital of Surgical Instruments & Sports Goods", primaryCategories: ["Surgical & Medical Instruments", "Sporting Goods"], secondaryCategories: ["Leather Goods", "Engineering"], exportShare: "~10% of Pakistan exports", keyBuyers: ["EU medical procurement", "UK NHS supply chains", "US sports retailers"], story: "Sialkot combines precision metalwork, skilled finishing, and generations of export discipline.", certifications: ["ISO 13485", "CE", "FDA registered"] },
  { slug: "faisalabad", city: "Faisalabad", tagline: "Pakistan's Textile Capital", primaryCategories: ["Textiles & Apparel"], secondaryCategories: ["Home Textiles"], exportShare: "~25% of textile exports", keyBuyers: ["EU fashion brands", "US retailers", "Middle East distributors"], story: "Faisalabad is Pakistan's deepest textile manufacturing base, from yarn to finished garments.", certifications: ["OEKO-TEX", "BSCI", "GOTS"] },
  { slug: "lahore", city: "Lahore", tagline: "Diverse Manufacturing Hub", primaryCategories: ["Leather Goods", "Furniture & Handicrafts"], secondaryCategories: ["Engineering", "Food Processing"], exportShare: "Major Punjab manufacturing hub", keyBuyers: ["EU leather importers", "GCC furniture retailers"], story: "Lahore blends design, leatherwork, packaging, and commercial services for export-ready SMEs.", certifications: ["ISO 9001", "SECP"] },
  { slug: "karachi", city: "Karachi", tagline: "Pakistan's Commercial Gateway", primaryCategories: ["Food & Agriculture", "Chemicals", "General Trade"], secondaryCategories: ["Textiles", "IT Services"], exportShare: "Largest port and logistics gateway", keyBuyers: ["Commodity traders", "Pharmaceutical distributors"], story: "Karachi gives exporters the closest access to ports, freight forwarders, banks, and regulators.", certifications: ["Halal", "HACCP", "ISO 22000"] },
  { slug: "gujranwala", city: "Gujranwala", tagline: "Engineering & Cutlery Capital", primaryCategories: ["Engineering & Light Manufacturing"], secondaryCategories: ["Sporting Goods"], exportShare: "Core light engineering cluster", keyBuyers: ["German hardware stores", "US tool distributors", "EU auto parts buyers"], story: "Gujranwala's workshops specialize in cutlery, tools, fans, fasteners, and metal fabrication.", certifications: ["ISO 9001", "DIN-ready specs"] },
];

export const mockExportGuides: ExportGuide[] = [
  { slug: "form-e-pakistan", title: "Form-E Pakistan Export Guide", category: "Banking", market: "All", summary: "State Bank export form basics for Pakistani exporters.", issuingAuthority: "Authorized dealer bank / State Bank of Pakistan", costEstimate: "Bank processing charges vary", timeEstimate: "1-3 working days", related: ["certificate-of-origin", "hs-code-lookup"], body: ["Form-E documents export proceeds through an authorized dealer bank.", "Exporters should match invoice, packing list, HS code, and buyer details before submission."] },
  { slug: "gsp-plus-certificate", title: "GSP+ Certificate for EU Buyers", category: "EU", market: "European Union", summary: "Preferential tariff documentation for eligible Pakistan-origin goods.", issuingAuthority: "TDAP / Chamber of Commerce", costEstimate: "Varies by chamber", timeEstimate: "2-5 working days", related: ["certificate-of-origin", "ce-marking-pakistan"], body: ["GSP+ can reduce duties for eligible EU shipments from Pakistan.", "Buyers need rules-of-origin evidence and direct shipment documentation."] },
  { slug: "certificate-of-origin", title: "Certificate of Origin", category: "Core Documents", market: "All", summary: "Proof that goods are manufactured or substantially transformed in Pakistan.", issuingAuthority: "Chamber of Commerce / TDAP", costEstimate: "Chamber fee", timeEstimate: "1-2 working days", related: ["form-e-pakistan", "gsp-plus-certificate"], body: ["Most buyers and customs brokers require a certificate of origin.", "Keep invoice, packing list, and chamber membership details aligned."] },
  { slug: "dtre-registration", title: "DTRE Registration", category: "Tax Relief", market: "All", summary: "Duty and Tax Remission for Exporters input relief.", issuingAuthority: "FBR Pakistan Customs", costEstimate: "Consultant and filing costs vary", timeEstimate: "2-6 weeks", related: ["form-e-pakistan", "hs-code-lookup"], body: ["DTRE helps exporters reduce input duty pressure.", "Manufacturers should prepare consumption ratios and export history before applying."] },
  { slug: "hs-code-lookup", title: "HS Code Lookup for Pakistani Exporters", category: "Classification", market: "All", summary: "Find and validate HS codes for export documents.", issuingAuthority: "Pakistan Customs / WCO HS system", costEstimate: "Free research, paid rulings vary", timeEstimate: "Same day to several weeks", related: ["form-e-pakistan"], body: ["HS code accuracy affects duties, certificates, and buyer landed-cost calculations.", "Use product material, function, and end use to classify correctly."] },
  { slug: "ce-marking-pakistan", title: "CE Marking for Pakistan Exporters", category: "EU", market: "European Union", summary: "EU compliance pathway for surgical, electronics, and regulated goods.", issuingAuthority: "EU notified bodies / manufacturer declaration", costEstimate: "Depends on product risk", timeEstimate: "2-12 weeks", related: ["gsp-plus-certificate"], body: ["CE requirements depend on product category and risk class.", "Surgical suppliers should maintain technical files and declarations of conformity."] },
  { slug: "halal-certification", title: "Halal Certification", category: "Food", market: "Middle East / Malaysia", summary: "Certification expectations for food and ingredients.", issuingAuthority: "Recognized Halal certification bodies", costEstimate: "Varies by scope", timeEstimate: "1-4 weeks", related: ["phytosanitary-certificate"], body: ["Halal certification helps food exporters access GCC and Malaysian buyers.", "Packaging should show recognized marks and certificate validity."] },
  { slug: "fda-registration", title: "FDA Registration", category: "USA", market: "United States", summary: "US registration considerations for food, pharma, and medical goods.", issuingAuthority: "US FDA", costEstimate: "Varies by product and agent", timeEstimate: "1-6 weeks", related: ["hs-code-lookup"], body: ["US buyers often request FDA registration proof before sampling.", "Food and medical products have different evidence requirements."] },
  { slug: "phytosanitary-certificate", title: "Phytosanitary Certificate", category: "Agriculture", market: "All", summary: "Plant and agriculture health certificate for exports.", issuingAuthority: "Department of Plant Protection", costEstimate: "Inspection and certificate fee", timeEstimate: "2-5 working days", related: ["halal-certification"], body: ["Agriculture exports may need phytosanitary inspection before shipment.", "Coordinate certificate timing with container loading and vessel cutoff."] },
];
