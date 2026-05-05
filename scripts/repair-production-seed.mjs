import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const rawLine of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    env[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

const env = loadEnv();
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function countRows(table) {
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

async function insertIfMissing(table, match, row) {
  const query = db.from(table).select("id").limit(1);
  for (const [key, value] of Object.entries(match)) query.eq(key, value);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`${table} lookup failed: ${error.message}`);
  if (data?.id) return false;
  const { error: insertError } = await db.from(table).insert(row);
  if (insertError) throw new Error(`${table} insert failed: ${insertError.message}`);
  return true;
}

async function first(table, filters = {}) {
  let query = db.from(table).select("*").limit(1);
  for (const [key, value] of Object.entries(filters)) query = query.eq(key, value);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`${table} load failed: ${error.message}`);
  return data;
}

async function repairCoreCounts() {
  const admin = await first("profiles", { role: "admin" });
  const buyer = await first("profiles", { role: "buyer" });
  const gujranwala = await first("suppliers", { city: "Gujranwala" });
  const sialkot = await first("suppliers", { city: "Sialkot" });
  if (!admin || !buyer || !gujranwala || !sialkot) throw new Error("Required demo profiles/suppliers are missing.");

  await insertIfMissing("products", { slug: "drop-forged-combination-spanner" }, {
    supplier_id: gujranwala.id,
    name: "Drop Forged Combination Spanner",
    slug: "drop-forged-combination-spanner",
    description: "Chrome vanadium hand tools for German distributors.",
    category: "Engineering & Light Manufacturing",
    hs_code: "8204.11",
    origin_story: "Gujranwala toolmaking line with DIN-ready size range.",
    images: ["https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?auto=format&fit=crop&w=900&q=80"],
    price_usd_min: 0.75,
    price_usd_max: 2.1,
    moq: 3000,
    moq_unit: "pieces",
    lead_time_days: "35",
    sample_available: true,
    sample_price_usd: 30,
    certifications: ["ISO 9001"],
    specifications: { Material: "Cr-V", Finish: "Mirror polish", Sizes: "6-32 mm" },
    is_active: true,
  });

  const products = (await db.from("products").select("*")).data ?? [];
  const product = products[0];
  const secondProduct = products[1] ?? product;
  const orderCount = await countRows("orders");
  for (let i = orderCount; i < 8; i += 1) {
    const selectedProduct = i % 2 === 0 ? product : secondProduct;
    await db.from("orders").insert({
      buyer_id: buyer.id,
      supplier_id: selectedProduct.supplier_id,
      product_id: selectedProduct.id,
      status: i % 2 === 0 ? "confirmed" : "in_production",
      quantity: i % 2 === 0 ? 1200 : 500,
      unit: selectedProduct.moq_unit ?? "pieces",
      price_usd: i % 2 === 0 ? 6200 : 8400,
      total_usd: i % 2 === 0 ? 6200 : 8400,
      currency: "USD",
      payment_method: "escrow",
      escrow_status: "funded",
      tracking_number: null,
      notes: "Production seed repair order for end-to-end workflow QA.",
    });
  }

  const quoteCount = await countRows("quotes");
  for (let i = quoteCount; i < 6; i += 1) {
    const selectedProduct = i % 2 === 0 ? product : secondProduct;
    await db.from("quotes").insert({
      buyer_id: buyer.id,
      supplier_id: selectedProduct.supplier_id,
      product_id: selectedProduct.id,
      status: i % 2 === 0 ? "responded" : "countered",
      quantity: i % 2 === 0 ? 1000 : 600,
      unit: selectedProduct.moq_unit ?? "pieces",
      target_price_usd: selectedProduct.price_usd_min ?? 1,
      offered_price_usd: selectedProduct.price_usd_max ?? 2,
      final_price_usd: null,
      currency: "USD",
      lead_time_requested: "30 days",
      lead_time_offered: selectedProduct.lead_time_days ?? "35",
      notes: "Seeded quote for negotiation flow QA.",
      buyer_notes: "Confirm private label and inspection terms.",
      expires_at: "2026-06-30T09:00:00.000Z",
    });
  }

  const communityRows = [
    ["How Sialkot exporters prepare CE technical files", "A practical checklist for technical files, declarations, and buyer evidence requests.", "export_tips"],
    ["EU buyers ask for OEKO-TEX before price", "Certification evidence is often requested before negotiation in textile inquiries.", "market_insights"],
    ["What makes a good first sample pack?", "Buyers need labelled samples, spec sheets, and realistic lead time notes.", "q_and_a"],
  ];
  for (const [title, body, category] of communityRows) {
    await insertIfMissing("community_posts", { title }, {
      author_id: admin.id,
      title,
      body,
      category,
      tags: ["ORIGINO", category],
      upvotes: 12,
      is_pinned: category === "export_tips",
    });
  }

  const blogRows = [
    ["Why German buyers still source surgical instruments from Sialkot", "german-buyers-sialkot-surgical-instruments", "A look at precision manufacturing, ISO 13485, and buyer trust signals."],
    ["Pakistan GSP+ benefits for EU textile importers", "pakistan-gsp-plus-eu-textile-importers", "How rules of origin and documentation can change landed cost for textile buyers."],
  ];
  for (const [title, slug, excerpt] of blogRows) {
    await insertIfMissing("blog_posts", { slug }, {
      author_id: admin.id,
      title,
      slug,
      excerpt,
      body: `${excerpt}\n\nThis ORIGINO journal article is seeded for production preview and SEO validation.`,
      cover_image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80",
      tags: ["Pakistan exports", "Buyer trust"],
      published: true,
      published_at: new Date().toISOString(),
    });
  }

  const suppliers = (await db.from("suppliers").select("id")).data ?? [];
  const awardRows = [
    ["Top Exporter", "Q2 2026", 1, 96],
    ["Most Responsive", "Q2 2026", 1, 91],
    ["Buyer Choice", "Q1 2026", 1, 88],
  ];
  for (let i = 0; i < awardRows.length; i += 1) {
    const [category, period, rank, score] = awardRows[i];
    await insertIfMissing("awards", { category, period }, {
      supplier_id: suppliers[i % suppliers.length].id,
      category,
      period,
      rank,
      score,
    });
  }
}

async function repairReferenceTables() {
  const guides = [
    ["Form-E Pakistan Export Guide", "form-e-pakistan", "Banking", "State Bank export form basics for Pakistani exporters."],
    ["GSP+ Certificate for EU Buyers", "gsp-plus-certificate", "EU", "Preferential tariff documentation for eligible Pakistan-origin goods."],
    ["Certificate of Origin", "certificate-of-origin", "Core Documents", "Proof that goods are manufactured or substantially transformed in Pakistan."],
    ["DTRE Registration", "dtre-registration", "Tax Relief", "Duty and Tax Remission for Exporters input relief."],
    ["HS Code Lookup for Pakistani Exporters", "hs-code-lookup", "Classification", "Find and validate HS codes for export documents."],
    ["CE Marking for Pakistan Exporters", "ce-marking-pakistan", "EU", "EU compliance pathway for surgical, electronics, and regulated goods."],
    ["Halal Certification", "halal-certification", "Food", "Certification expectations for food and ingredients."],
    ["FDA Registration", "fda-registration", "USA", "US registration considerations for food, pharma, and medical goods."],
    ["Phytosanitary Certificate", "phytosanitary-certificate", "Agriculture", "Plant and agriculture health certificate for exports."],
  ];
  for (const [title, slug, category, body] of guides) {
    await insertIfMissing("export_documentation_guides", { slug }, { title, slug, category, body, published: true });
  }

  const schemes = [
    ["TDAP Export Development Fund", "TDAP", "Subsidised export marketing and international fair participation.", "SME exporters with valid registration.", "Marketing cost support", "https://tdap.gov.pk/"],
    ["SMEDA SME Support Program", "SMEDA", "Business development and advisory support for Pakistani SMEs.", "Registered Pakistani SMEs.", "Technical and advisory support", "https://smeda.org/"],
    ["SBP Export Finance Scheme", "State Bank of Pakistan", "Concessionary export finance for eligible exporters.", "Export order or performance history.", "Lower working capital rate", "https://www.sbp.org.pk/"],
    ["DTRE Duty and Tax Remission", "FBR Pakistan Customs", "Input duty relief for exporters.", "Export manufacturers with consumption records.", "Reduced input-duty pressure", "https://www.fbr.gov.pk/"],
    ["Technology Upgradation Fund", "Government of Pakistan", "Machinery upgrade support for export sectors.", "Eligible industrial units.", "Capital support", "https://invest.gov.pk/"],
  ];
  for (const [name, authority, description, eligibility, benefit, application_url] of schemes) {
    await insertIfMissing("government_schemes", { name }, { name, authority, description, eligibility, benefit, application_url, is_active: true });
  }

  const partners = [
    ["DHL Express Pakistan", "courier", ["Karachi", "Lahore", "Sialkot"], "https://www.dhl.com/pk-en/home.html"],
    ["Maersk Pakistan", "carrier", ["Karachi"], "https://www.maersk.com/"],
    ["SGS Pakistan Logistics Desk", "customs_agent", ["Karachi", "Lahore"], "https://www.sgs.com/"],
    ["Sialkot Dry Port Trust", "freight_forwarder", ["Sialkot"], "https://www.sdpt.org.pk/"],
  ];
  for (const [name, type, cities, website] of partners) {
    await insertIfMissing("logistics_partners", { name }, { name, type, cities, website, is_active: true });
  }

  const commissionRows = [
    ["Surgical & Medical Instruments", 0.05],
    ["Textiles & Apparel", 0.045],
    ["Leather Goods", 0.05],
    ["Food & Agriculture", 0.035],
    ["Engineering & Light Manufacturing", 0.05],
  ];
  for (const [category, rate] of commissionRows) {
    await insertIfMissing("commission_config", { category }, { category, rate });
  }

  const intelligenceRows = [
    ["Surgical & Medical Instruments", "Germany", "China", 5.8, 42, "ISO 13485 suppliers can compete on smaller MOQs and technical responsiveness."],
    ["Textiles & Apparel", "European Union", "Bangladesh", 9.4, 38, "GSP+ and OEKO-TEX evidence improve landed cost comparison."],
    ["Leather Goods", "GCC", "India", 31, 22, "Lower artisan MOQ and private label flexibility."],
    ["Engineering & Light Manufacturing", "Germany", "China", 1.9, 51, "Gujranwala tools can win with DIN-ready specs and inspection reports."],
  ];
  for (const [category, market, competitor_country, average_price_usd, market_share_pct, pakistan_advantage] of intelligenceRows) {
    await insertIfMissing("competitive_intelligence", { category, market }, {
      category,
      market,
      competitor_country,
      average_price_usd,
      market_share_pct,
      pakistan_advantage,
      data_source: "ORIGINO baseline seed",
      period: "Q2 2026",
    });
  }
}

async function main() {
  await repairCoreCounts();
  await repairReferenceTables();
  const tables = [
    "suppliers",
    "products",
    "orders",
    "quotes",
    "inquiries",
    "community_posts",
    "blog_posts",
    "awards",
    "competitive_intelligence",
    "commission_config",
    "logistics_partners",
    "government_schemes",
    "export_documentation_guides",
  ];
  for (const table of tables) {
    console.log(`${table}: ${await countRows(table)}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
