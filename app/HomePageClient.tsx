"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WaitlistForm from "@/app/components/shared/WaitlistForm";
import { useLanguage } from "@/app/components/shared/LanguageProvider";
import { applySupplierOverrides } from "@/app/components/shared/supplierOverrides";
import type { Cluster } from "@/lib/mock-data";
import type { PageSection, Product, Supplier } from "@/types/database";

type HomePageClientProps = {
  suppliers: Supplier[];
  products: Product[];
  clusters: Cluster[];
  pageSections: PageSection[];
};

const HERO_IMAGE =
  "https://images.pexels.com/photos/28806603/pexels-photo-28806603.jpeg?auto=compress&cs=tinysrgb&w=1920";

const copy = {
  en: {
    browseMarketplace: "Browse Marketplace",
    listCompany: "List Your Company",
    suppliers: "Suppliers",
    products: "Products",
    verifiedLeaders: "Verified leaders",
    cityClusters: "City clusters",
    verified: "Verified",
    fastestReply: "Fastest reply",
    euReady: "EU ready",
    viewAll: "View All",
    browseAll: "Browse All",
    featuredSuppliers: "Featured Suppliers",
    trustBody: "Every serious supplier journey starts with audit scoring, document checks, sanctions screening, and visible verification tiers.",
    trustSanctions: "OFAC / UN / EU screened",
    trustDocs: "Document vault ready",
    trustEscrow: "Escrow and inspection workflows",
    auditBody: "Sellers are not pushed straight into the marketplace. They pass through a six-step readiness audit covering brand identity, digital presence, export history, product readiness, operations, and compliance.",
    auditCta: "Start AI Audit",
    auditScore: "80+ required for approval",
    conditional: "60-79 enters package-assisted improvement",
    roadmap: "Below 60 receives a readiness roadmap",
    rfqBody: "Buyers can search verified suppliers immediately or register to send an RFQ, request samples, compare suppliers, and move into quote negotiation.",
    rfqCta: "Create Buyer RFQ",
    compareCta: "Compare Suppliers",
    toolsBody: "ORIGINO is built around the checks international buyers already run: documentation, landed cost, verification, and supplier responsiveness.",
    docs: "Pakistan export guides",
    docsEyebrow: "Documentation",
    docsBody: "Form-E, GSP+, Certificate of Origin, CE, Halal, FDA, and phytosanitary documents.",
    cost: "Landed cost calculator",
    costingEyebrow: "Costing",
    costBody: "Estimate freight, insurance, customs duty, VAT, and Pakistan GSP+ savings.",
    compare: "Supplier comparison",
    sourcingEyebrow: "Sourcing",
    compareBody: "Compare verification, certifications, response rate, MOQ, lead time, and cluster fit.",
    updatesBody: "Join the waitlist for supplier drops, documentation guides, buyer-seller meets, and new verified exporters entering the marketplace.",
    response: "Response",
    moq: "MOQ",
  },
  ur: {
    browseMarketplace: "مارکیٹ پلیس دیکھیں",
    listCompany: "اپنی کمپنی شامل کریں",
    suppliers: "سپلائرز",
    products: "مصنوعات",
    verifiedLeaders: "تصدیق شدہ لیڈرز",
    cityClusters: "شہری کلسٹرز",
    verified: "تصدیق شدہ",
    fastestReply: "تیز ترین جواب",
    euReady: "یورپ کے لیے تیار",
    viewAll: "سب دیکھیں",
    browseAll: "سب دیکھیں",
    featuredSuppliers: "نمایاں سپلائرز",
    trustBody: "ہر سنجیدہ سپلائر کا سفر آڈٹ اسکور، دستاویزات کی جانچ، پابندیوں کی اسکریننگ، اور واضح تصدیقی درجات سے شروع ہوتا ہے۔",
    trustSanctions: "OFAC / UN / EU اسکریننگ",
    trustDocs: "دستاویز والٹ تیار",
    trustEscrow: "ایسکرو اور انسپیکشن ورک فلو",
    auditBody: "سیلرز کو فوراً مارکیٹ پلیس میں شامل نہیں کیا جاتا۔ وہ چھ مرحلوں کے آڈٹ سے گزرتے ہیں جس میں برانڈ، ڈیجیٹل موجودگی، ایکسپورٹ تجربہ، مصنوعات، آپریشنز، اور کمپلائنس شامل ہیں۔",
    auditCta: "AI آڈٹ شروع کریں",
    auditScore: "منظوری کے لیے 80+ اسکور ضروری",
    conditional: "60-79 پیکیج کے ذریعے بہتری",
    roadmap: "60 سے کم اسکور پر تیاری کا روڈ میپ",
    rfqBody: "خریدار فوراً تصدیق شدہ سپلائرز تلاش کر سکتے ہیں یا RFQ، سیمپل، موازنہ، اور کوٹیشن کے لیے رجسٹر ہو سکتے ہیں۔",
    rfqCta: "Buyer RFQ بنائیں",
    compareCta: "سپلائرز کا موازنہ",
    toolsBody: "ORIGINO ان چیکز کے گرد بنایا گیا ہے جو عالمی خریدار پہلے ہی کرتے ہیں: دستاویزات، landed cost، تصدیق، اور سپلائر کی جواب دہی۔",
    docs: "پاکستان ایکسپورٹ گائیڈز",
    docsEyebrow: "دستاویزات",
    docsBody: "Form-E، GSP+، Certificate of Origin، CE، Halal، FDA، اور phytosanitary دستاویزات۔",
    cost: "Landed cost کیلکولیٹر",
    costingEyebrow: "لاگت",
    costBody: "فریٹ، انشورنس، کسٹمز ڈیوٹی، VAT، اور پاکستان GSP+ بچت کا اندازہ لگائیں۔",
    compare: "سپلائر موازنہ",
    sourcingEyebrow: "سورسنگ",
    compareBody: "تصدیق، سرٹیفیکیشنز، جواب کی شرح، MOQ، lead time، اور cluster fit کا موازنہ کریں۔",
    updatesBody: "نئے سپلائرز، دستاویزی گائیڈز، buyer-seller meets، اور تصدیق شدہ ایکسپورٹرز کی اپ ڈیٹس حاصل کریں۔",
    response: "جواب",
    moq: "MOQ",
  },
};

function sectionText(section: PageSection | undefined, key: string, fallback: string) {
  const value = section?.content?.[key];
  return typeof value === "string" ? value : fallback;
}

function getSection(sections: PageSection[], type: string) {
  return sections.find((section) => section.type === type);
}

export default function HomePageClient({ suppliers, products, clusters, pageSections }: HomePageClientProps) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [effectiveSuppliers, setEffectiveSuppliers] = useState(() => applySupplierOverrides(suppliers));
  useEffect(() => {
    function syncSuppliers() {
      setEffectiveSuppliers(applySupplierOverrides(suppliers));
    }
    syncSuppliers();
    window.addEventListener("storage", syncSuppliers);
    window.addEventListener("origino:supplier-overrides", syncSuppliers);
    return () => {
      window.removeEventListener("storage", syncSuppliers);
      window.removeEventListener("origino:supplier-overrides", syncSuppliers);
    };
  }, [suppliers]);
  const activeSuppliers = effectiveSuppliers.filter((supplier) => supplier.is_active);
  const certified = activeSuppliers.filter((supplier) => supplier.verification_tier === "origino_certified" || supplier.verification_tier === "site_visited").length;
  const featured = activeSuppliers.filter((supplier) => supplier.is_featured).slice(0, 3);
  const hero = getSection(pageSections, "hero");
  const featuredSection = getSection(pageSections, "featured_suppliers");
  const audit = getSection(pageSections, "audit");
  const waitlist = getSection(pageSections, "waitlist");
  const titleKey = lang === "ur" ? "title_ur" : "title";
  const eyebrowKey = lang === "ur" ? "eyebrow_ur" : "eyebrow";
  const descriptionKey = lang === "ur" ? "description_ur" : "description";

  return (
    <div className="page-enter">
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="h-full w-full object-cover" src={HERO_IMAGE} alt="" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,235,0.94),rgba(247,242,235,0.58),rgba(247,242,235,0.05))]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(247,242,235,0.98),transparent)]" />
        </div>
        <div className="container-editorial relative z-10 py-32 text-[var(--ink)]">
          <div className="max-w-3xl blur-in">
            <p className="mb-8 inline-flex rounded-full bg-white/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)] backdrop-blur-md">
              {sectionText(hero, eyebrowKey, "Pakistan Export Marketplace")}
            </p>
            <h1 className="max-w-4xl text-6xl leading-[0.96] text-[var(--ink)] md:text-8xl">
              {sectionText(hero, titleKey, "Source from verified Pakistani manufacturers.")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#24221f]/75 md:text-xl">
              {sectionText(hero, descriptionKey, "ORIGINO connects global buyers with export-ready suppliers across Pakistan.")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn-pill btn-pill-forest min-h-[52px] px-8" href="/marketplace">{t.browseMarketplace}</Link>
              <Link className="btn-pill min-h-[52px] border-[rgba(36,34,31,0.22)] bg-white/55 px-8 text-[var(--ink)] backdrop-blur-sm hover:border-[var(--ink)]" href="/audit">{t.auditCta}</Link>
            </div>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 blur-in [animation-delay:180ms]">
            <div className="rounded-[999px] border border-white/55 bg-white/50 px-5 py-4 shadow-[0_20px_50px_rgba(64,52,38,0.08)] backdrop-blur-sm"><p className="metric-numeral text-2xl text-[var(--ink)]">{certified}</p><p className="text-sm text-[#24221f]/60">{t.verified}</p></div>
            <div className="rounded-[999px] border border-white/55 bg-white/50 px-5 py-4 shadow-[0_20px_50px_rgba(64,52,38,0.08)] backdrop-blur-sm"><p className="metric-numeral text-2xl text-[var(--ink)]">5h</p><p className="text-sm text-[#24221f]/60">{t.fastestReply}</p></div>
            <div className="rounded-[999px] border border-white/55 bg-white/50 px-5 py-4 shadow-[0_20px_50px_rgba(64,52,38,0.08)] backdrop-blur-sm"><p className="metric-numeral text-2xl text-[var(--ink)]">GSP+</p><p className="text-sm text-[#24221f]/60">{t.euReady}</p></div>
          </div>
          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--ink)]/70 md:flex">
            <span>Scroll</span>
            <span className="h-12 w-px bg-[var(--ink)]/18" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[rgba(84,98,64,0.12)] bg-[rgba(255,250,242,0.78)] py-5 text-[var(--ink)] shadow-[inset_0_1px_rgba(255,255,255,0.7)]">
        <div className="animate-marquee flex whitespace-nowrap">
          {[0, 1, 2].map((group) => (
            <div key={group} className="flex">
              <div className="inline-flex items-center gap-10 px-12"><span className="font-serif text-3xl">{activeSuppliers.length}</span><span className="text-sm font-medium text-[var(--ink-muted)]">{t.suppliers}</span><span className="text-[var(--forest-light)]">/</span></div>
              <div className="inline-flex items-center gap-10 px-12"><span className="font-serif text-3xl">{products.length}</span><span className="text-sm font-medium text-[var(--ink-muted)]">{t.products}</span><span className="text-[var(--forest-light)]">/</span></div>
              <div className="inline-flex items-center gap-10 px-12"><span className="font-serif text-3xl">{certified}</span><span className="text-sm font-medium text-[var(--ink-muted)]">{t.verifiedLeaders}</span><span className="text-[var(--forest-light)]">/</span></div>
              <div className="inline-flex items-center gap-10 px-12"><span className="font-serif text-3xl">{clusters.length}</span><span className="text-sm font-medium text-[var(--ink-muted)]">{t.cityClusters}</span><span className="text-[var(--forest-light)]">/</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="hidden border-y border-[rgba(26,26,24,0.12)] bg-[#f7f3ee]">
        <div className="container-editorial grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          <div><div className="metric-numeral text-3xl">{activeSuppliers.length}</div><p className="text-sm text-[#5a5a54]">{t.suppliers}</p></div>
          <div><div className="metric-numeral text-3xl">{products.length}</div><p className="text-sm text-[#5a5a54]">{t.products}</p></div>
          <div><div className="metric-numeral text-3xl">{certified}</div><p className="text-sm text-[#5a5a54]">{t.verifiedLeaders}</p></div>
          <div><div className="metric-numeral text-3xl">{clusters.length}</div><p className="text-sm text-[#5a5a54]">{t.cityClusters}</p></div>
        </div>
      </section>

      <section className="container-editorial py-12">
        <div className="panel-soft flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6c7652]">Source by region</p>
            <p className="mt-2 text-lg leading-8 text-[#5f5a53]">
              Filter suppliers by Sialkot, Faisalabad, Lahore, Karachi, or Gujranwala inside the marketplace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-pill btn-pill-forest min-h-[48px]" href="/marketplace">Open Marketplace</Link>
            <Link className="btn-pill btn-pill-outline min-h-[48px]" href="/clusters">{t.viewAll} Clusters</Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eadf] py-20">
        <div className="container-editorial">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f5b3a]">{sectionText(featuredSection, eyebrowKey, t.featuredSuppliers)}</p>
            <h2 className="text-4xl md:text-5xl">{sectionText(featuredSection, titleKey, "Buyer-ready exporters")}</h2>
          </div>
          <Link className="hidden items-center gap-2 text-sm font-semibold text-[#4f5b3a] transition hover:text-[#2a3320] sm:inline-flex" href="/marketplace">{t.browseAll}</Link>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {featured.map((supplier) => (
            <Link key={supplier.id} href={`/suppliers/${supplier.slug}`} className="group overflow-hidden rounded-[34px] border border-[rgba(84,98,64,0.10)] bg-[var(--warm-white)] shadow-[0_22px_70px_rgba(64,52,38,0.06)] hover-lift">
              <div className="relative m-3 aspect-[4/3] overflow-hidden rounded-[28px]">
                <img className="img-zoom h-full w-full object-cover" src={supplier.hero_image_url || "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1200"} alt={supplier.company_name} />
                <span className="badge-patch absolute left-4 top-4 bg-white/85 text-[#4f5b3a] backdrop-blur">{supplier.verification_tier.replace(/_/g, " ")}</span>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8a8a82]">{supplier.city} / {supplier.category}</p>
                <h3 className="mt-3 text-2xl transition group-hover:text-[#4f5b3a]">{lang === "ur" && supplier.company_name_ur ? supplier.company_name_ur : supplier.company_name}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#5a5a54]">{supplier.description}</p>
                <p className="mt-5 metric-numeral text-sm">{t.response} {supplier.response_rate}% / {t.moq} ${supplier.moq_usd?.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      <section className="container-editorial py-20">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="panel-soft p-6 md:p-10">
            <p className="badge-patch mb-5">{sectionText(audit, eyebrowKey, "AI Audit")}</p>
            <h2 className="max-w-2xl text-4xl md:text-6xl">{sectionText(audit, titleKey, "A strict gate before any supplier is listed.")}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5a5a54]">{t.auditBody}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["80-100", t.auditScore],
                ["60-79", t.conditional],
                ["0-59", t.roadmap],
              ].map(([score, label]) => (
                <div className="rounded-[26px] border border-[rgba(84,98,64,0.12)] bg-white/55 p-5" key={score}>
                  <p className="metric-numeral text-2xl">{score}</p>
                  <p className="mt-2 text-sm leading-5 text-[#6d675f]">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-pill btn-pill-forest min-h-[50px] px-8" href="/audit">{t.auditCta}</Link>
              <Link className="btn-pill btn-pill-outline min-h-[50px] px-8" href="/compare">{t.compareCta}</Link>
            </div>
          </div>

          <div className="panel-soft p-6 md:p-8">
            <p className="badge-patch tier-certified mb-5">Seller Packages</p>
            <h2 className="text-4xl">Marketing services sellers can buy quickly.</h2>
            <p className="mt-4 text-sm leading-7 text-[#5a5a54]">
              Basic, Growth, and Premium package the exact export-readiness work from the specification: brand audit, logo, photography, catalog, website, and buyer introductions.
            </p>
            <div className="mt-6 space-y-3">
              {[
                ["Basic", "$299", "3 weeks"],
                ["Growth", "$799", "6 weeks"],
                ["Premium", "$1,999", "10 weeks"],
              ].map(([name, price, delivery]) => (
                <Link className="flex items-center justify-between rounded-full border border-[rgba(84,98,64,0.12)] bg-white/55 px-5 py-4 transition hover:border-[var(--forest)]" href="/marketing-packages" key={name}>
                  <span className="font-semibold">{name}</span>
                  <span className="metric-numeral">{price}</span>
                  <span className="text-sm text-[#6d675f]">{delivery}</span>
                </Link>
              ))}
            </div>
            <Link className="btn-pill btn-pill-forest mt-7 w-full min-h-[50px]" href="/marketing-packages">View Marketing Packages</Link>
          </div>
        </div>
      </section>

      <section className="container-editorial py-16">
        <div className="grid gap-8 rounded-[28px] border border-[rgba(44,44,44,0.08)] bg-white/80 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_0.9fr] md:items-center md:p-8">
          <div>
            <p className="badge-patch mb-4">{sectionText(waitlist, eyebrowKey, "Buyer Updates")}</p>
            <h2 className="text-3xl">{sectionText(waitlist, titleKey, "Get early sourcing updates")}</h2>
            <p className="mt-4 max-w-2xl text-[#5a5a54]">{t.updatesBody}</p>
          </div>
          <div>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}
