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

type Audience = "buyer" | "seller";

const HERO_IMAGE =
  "https://images.pexels.com/photos/28806603/pexels-photo-28806603.jpeg?auto=compress&cs=tinysrgb&w=1920";

const copy = {
  en: {
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
    clarityBody: "Origino is a curated sourcing platform. We do not list thousands of suppliers. We work with a few, carefully chosen, properly understood, and presented to build trust before conversation begins.",
    trustBody: "Manufacturing already exists. What is missing is careful presentation, visible evidence, and a reason to be chosen.",
    trustSanctions: "OFAC / UN / EU screened",
    trustDocs: "Document vault ready",
    trustEscrow: "Escrow and inspection workflows",
    auditBody: "Not everything should be listed. Before a manufacturer is shown, ORIGINO looks at brand identity, digital presence, export history, product readiness, operations, and compliance.",
    auditCta: "Apply to be selected",
    pathEyebrow: "Choose your path",
    buyerPath: "I source from Pakistan",
    sellerPath: "I make in Pakistan",
    buyerPanelTitle: "For global buyers",
    buyerPanelBody: "Start with a smaller field of manufacturers. Compare evidence, ask clearly, and move only when the fit is visible.",
    sellerPanelTitle: "For manufacturers",
    sellerPanelBody: "Begin with the export-readiness audit. If the work is ready, it can be reviewed for listing and buyer presentation.",
    openMarketplace: "See selected manufacturers",
    viewPackages: "View Packages",
    gateEyebrow: "ORIGINO",
    gateTitle: "What brings you here?",
    gateBody: "Choose the side of the platform you need. The site will open with the work that belongs to you.",
    select: "Select",
    buyerGateTitle: "I'm a Buyer",
    buyerGateBody: "Browse selected manufacturers, compare proof, then send a clear inquiry.",
    sellerGateTitle: "I'm a Manufacturer",
    sellerGateBody: "Create a seller account, choose support when needed, and use the audit to understand readiness.",
    switchPath: "Switch path",
    buyerSplit: "I'm a Buyer",
    manufacturerSplit: "I'm a Manufacturer",
    clarityTitle: "Origino is a curated sourcing platform.",
    clarityBlock: "We do not list thousands of suppliers. We work with a few, carefully chosen, properly understood, and presented to build trust before conversation begins.",
    buyerHeroEyebrow: "For Global Buyers",
    buyerHeroTitle: "Selected manufacturers. Not endless options.",
    buyerHeroBody: "Browse selected suppliers, compare evidence, and begin a clear inquiry.",
    buyerClarity: "Selected manufacturers from Pakistan. Built for global buyers. First compare documents, verification signals, response data, and sourcing context. Then begin the conversation.",
    sellerHeroEyebrow: "For Pakistani Manufacturers",
    sellerHeroTitle: "What you make deserves to be seen.",
    sellerHeroBody: "Keep making well. ORIGINO helps with the presentation, documents, and buyer context around the work.",
    sellerClarity: "Many Pakistani manufacturers do not lack skill; they lack the time and system to market themselves properly. ORIGINO handles that visibility layer while the audit shows what must improve before public listing.",
    auditScore: "80+ required for approval",
    conditional: "60-79 enters package-assisted improvement",
    roadmap: "Below 60 receives a readiness roadmap",
    rfqBody: "Buyers see fewer names, with more context. Search, compare, ask for samples, and move into quote negotiation only when the fit is clear.",
    rfqCta: "Create Buyer RFQ",
    compareCta: "Compare Suppliers",
    toolsBody: "The useful checks stay close to the listing: documentation, landed cost, verification, and response discipline.",
    docs: "Pakistan export guides",
    docsEyebrow: "Documentation",
    docsBody: "Form-E, GSP+, Certificate of Origin, CE, Halal, FDA, and phytosanitary guides.",
    cost: "Landed cost calculator",
    costingEyebrow: "Costing",
    costBody: "Estimate freight, insurance, duty, VAT, and Pakistan GSP+ savings.",
    compare: "Supplier comparison",
    sourcingEyebrow: "Sourcing",
    compareBody: "Read verification, certifications, response rate, MOQ, lead time, and cluster fit side by side.",
    buyerToolsTitle: "Tools for a clearer shortlist.",
    buyerToolsBody: "Compare manufacturers, estimate landed cost, and understand the movement of goods before an inquiry becomes serious.",
    logistics: "Logistics partners",
    logisticsBody: "Freight and movement context for Pakistani export routes.",
    sellerDocsTitle: "Documents before distance.",
    sellerDocsBody: "Form-E, GSP+, Certificate of Origin, CE, Halal, FDA, and phytosanitary guidance for sellers preparing to export.",
    updatesBody: "Receive quiet updates when new manufacturers, guides, and buyer-seller meetings are ready.",
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
    clarityBody: "ORIGINO منتخب پاکستانی مینوفیکچررز کی export readiness، دستاویزات، verification signals، اور sourcing context کو واضح کرتا ہے۔ اچھی manufacturing موجود ہے؛ مسئلہ اکثر visibility کا ہوتا ہے۔",
    trustBody: "ہر سنجیدہ سپلائر کا سفر آڈٹ اسکور، دستاویزات کی جانچ، پابندیوں کی اسکریننگ، اور واضح تصدیقی درجات سے شروع ہوتا ہے۔",
    trustSanctions: "OFAC / UN / EU اسکریننگ",
    trustDocs: "دستاویز والٹ تیار",
    trustEscrow: "ایسکرو اور انسپیکشن ورک فلو",
    auditBody: "سیلرز کو فوراً مارکیٹ پلیس میں شامل نہیں کیا جاتا۔ وہ چھ مرحلوں کے آڈٹ سے گزرتے ہیں جس میں برانڈ، ڈیجیٹل موجودگی، ایکسپورٹ تجربہ، مصنوعات، آپریشنز، اور کمپلائنس شامل ہیں۔",
    auditCta: "Apply to be selected",
    pathEyebrow: "اپنا راستہ منتخب کریں",
    buyerPath: "میں پاکستان سے سورس کرتا ہوں",
    sellerPath: "میں پاکستان میں بناتا ہوں",
    buyerPanelTitle: "عالمی خریداروں کے لیے",
    buyerPanelBody: "کم مگر بہتر منتخب مینوفیکچررز سے شروع کریں۔ ثبوت دیکھیں، موازنہ کریں، اور واضح فٹ کے بعد آگے بڑھیں۔",
    sellerPanelTitle: "مینوفیکچررز کے لیے",
    sellerPanelBody: "ایکسپورٹ readiness آڈٹ سے شروع کریں۔ اگر کام تیار ہے، تو اسے listing اور buyer presentation کے لیے review کیا جا سکتا ہے۔",
    openMarketplace: "See selected manufacturers",
    viewPackages: "پیکیجز دیکھیں",
    gateEyebrow: "ORIGINO",
    gateTitle: "What brings you here?",
    gateBody: "Choose the side of the platform you need. The site will open with the work that belongs to you.",
    select: "Select",
    buyerGateTitle: "I'm a Buyer",
    buyerGateBody: "Browse selected manufacturers, compare proof, then send a clear inquiry.",
    sellerGateTitle: "I'm a Manufacturer",
    sellerGateBody: "Apply, complete the audit, enter review, then choose support if it is needed.",
    switchPath: "Switch path",
    buyerSplit: "I'm a Buyer",
    manufacturerSplit: "I'm a Manufacturer",
    clarityTitle: "Origino is a curated sourcing platform.",
    clarityBlock: "We do not list thousands of suppliers. We work with a few, carefully chosen, properly understood, and presented to build trust before conversation begins.",
    buyerHeroEyebrow: "For Global Buyers",
    buyerHeroTitle: "Selected manufacturers. Not endless options.",
    buyerHeroBody: "Browse selected suppliers, compare evidence, and begin a clear inquiry.",
    buyerClarity: "Selected manufacturers from Pakistan. Built for global buyers. First compare documents, verification signals, response data, and sourcing context. Then begin the conversation.",
    sellerHeroEyebrow: "For Pakistani Manufacturers",
    sellerHeroTitle: "What you make deserves to be seen.",
    sellerHeroBody: "Apply for review, complete the audit, and prepare your work for global buyers.",
    sellerClarity: "Pakistani manufacturers are often strongest at making. ORIGINO supports the visibility layer around that work while the audit shows what must improve before public listing.",
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
    buyerToolsTitle: "Tools for a clearer shortlist.",
    buyerToolsBody: "Compare manufacturers, estimate landed cost, and understand the movement of goods before an inquiry becomes serious.",
    logistics: "Logistics partners",
    logisticsBody: "Freight and movement context for Pakistani export routes.",
    sellerDocsTitle: "Documents before distance.",
    sellerDocsBody: "Form-E, GSP+, Certificate of Origin, CE, Halal, FDA, and phytosanitary guidance for sellers preparing to export.",
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
  const [audience, setAudience] = useState<Audience | null>(null);
  const [effectiveSuppliers, setEffectiveSuppliers] = useState(() => applySupplierOverrides(suppliers));
  useEffect(() => {
    const savedUserType = window.localStorage.getItem("userType");
    if (savedUserType === "buyer") {
      setAudience("buyer");
      return;
    }
    if (savedUserType === "manufacturer") {
      setAudience("seller");
      return;
    }
    const savedAudience = window.localStorage.getItem("origino_audience");
    if (savedAudience === "buyer" || savedAudience === "seller") setAudience(savedAudience);
  }, []);
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
  const hasMarketplaceStats = activeSuppliers.length > 0 || products.length > 0 || certified > 0;
  const audit = getSection(pageSections, "audit");
  const waitlist = getSection(pageSections, "waitlist");
  const titleKey = lang === "ur" ? "title_ur" : "title";
  const eyebrowKey = lang === "ur" ? "eyebrow_ur" : "eyebrow";
  const chooseAudience = (nextAudience: Audience) => {
    window.localStorage.setItem("origino_audience", nextAudience);
    window.localStorage.setItem("userType", nextAudience === "buyer" ? "buyer" : "manufacturer");
    window.dispatchEvent(new CustomEvent("origino:audience-change", { detail: nextAudience }));
    setAudience(nextAudience);
  };
  const resetAudience = () => {
    window.localStorage.removeItem("origino_audience");
    window.localStorage.removeItem("userType");
    window.dispatchEvent(new CustomEvent("origino:audience-change", { detail: null }));
    setAudience(null);
  };
  if (!audience) {
    return (
      <div className="page-enter">
        <section className="audience-gate">
          <div className="audience-gate-backdrop">
            <img className="audience-gate-image" src={HERO_IMAGE} alt="" aria-hidden="true" />
            <div className="audience-gate-overlay" />
          </div>
          <div className="audience-gate-panel">
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseAudience("buyer")}
                className="audience-gate-card group"
              >
                <span className="badge-patch mb-10">Buyer</span>
                <span className="audience-gate-title">{t.buyerGateTitle}</span>
                <span className="audience-gate-body">{t.buyerGateBody}</span>
                <span className="audience-gate-action">{t.select}</span>
              </button>
              <button
                type="button"
                onClick={() => chooseAudience("seller")}
                className="audience-gate-card group"
              >
                <span className="badge-patch mb-10">Seller</span>
                <span className="audience-gate-title">{t.sellerGateTitle}</span>
                <span className="audience-gate-body">{t.sellerGateBody}</span>
                <span className="audience-gate-action">{t.select}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const isBuyer = audience === "buyer";
  const heroEyebrow = isBuyer ? t.buyerHeroEyebrow : t.sellerHeroEyebrow;
  const heroTitle = isBuyer ? t.buyerHeroTitle : t.sellerHeroTitle;
  const heroBody = isBuyer ? t.buyerHeroBody : t.sellerHeroBody;
  const heroClarity = isBuyer ? t.buyerClarity : t.sellerClarity;
  const processSteps = isBuyer
    ? [
        ["1", "Browse", "Start with selected Pakistani manufacturers."],
        ["2", "Compare", "Review documents, verification, response data, and fit."],
        ["3", "Inquire", "Send one clear request and move into quote discussion."],
      ]
    : [
        ["1", "Create", "Create a seller account and choose support when you need it."],
        ["2", "Diagnose", "Use the audit to see gaps in brand, digital presence, documents, and readiness."],
        ["3", "Review", "Public listing still depends on score, documents, sanctions, and admin review."],
      ];
  const proofPoints = isBuyer
    ? ["Verification tier visible", "Documents and certifications surfaced", "MOQ, lead time, and response discipline shown"]
    : ["Six-category readiness score", "Admin review before listing", "Marketing support can start anytime"];

  return (
    <div className="page-enter">
      <section className="home-hero relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="h-full w-full object-cover" src={HERO_IMAGE} alt="" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,235,0.94),rgba(247,242,235,0.58),rgba(247,242,235,0.05))]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(247,242,235,0.98),transparent)]" />
        </div>
        <div className="container-editorial home-hero-inner relative z-10 text-[var(--ink)]">
          <div className="home-hero-content blur-in">
            <p className="home-hero-kicker">
              {heroEyebrow}
            </p>
            <h1 className="home-hero-title text-[var(--ink)]">
              {heroTitle}
            </h1>
            <p className="home-hero-body">
              {heroBody}
            </p>
            <p className="home-hero-clarity">
              {heroClarity}
            </p>
            <div className="home-hero-actions">
              {isBuyer ? (
                <Link className="btn-pill btn-pill-forest min-h-[52px] px-8" href="/marketplace">{t.openMarketplace}</Link>
              ) : (
                <Link className="btn-pill btn-pill-forest min-h-[52px] px-8" href="/audit">{t.auditCta}</Link>
              )}
              <button className="btn-pill btn-pill-outline min-h-[52px] px-8" type="button" onClick={resetAudience}>{t.switchPath}</button>
            </div>
          </div>
          <div className="home-proof-strip blur-in [animation-delay:180ms]">
            <div className="home-proof-pill"><p className="metric-numeral text-[var(--ink)]">{certified}</p><p>{t.verified}</p></div>
            <div className="home-proof-pill"><p className="metric-numeral text-[var(--ink)]">5h</p><p>{t.fastestReply}</p></div>
            <div className="home-proof-pill"><p className="metric-numeral text-[var(--ink)]">GSP+</p><p>{t.euReady}</p></div>
          </div>
          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--ink)]/70 md:flex">
            <span>Scroll</span>
            <span className="h-12 w-px bg-[var(--ink)]/18" />
          </div>
        </div>
      </section>

      <section className="container-editorial py-12">
        <div className="panel-soft p-6 md:p-8">
          <p className="badge-patch mb-5">{t.clarityTitle}</p>
          <p className="max-w-3xl text-base leading-8 text-[#24221f]/72 md:text-lg md:leading-9">
            {t.clarityBlock}
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-3 md:grid-cols-3">
              {processSteps.map(([number, title, body]) => (
                <div key={number} className="rounded-[26px] border border-[rgba(84,98,64,0.12)] bg-white/42 p-5">
                  <p className="metric-numeral text-2xl text-[var(--forest)]">{number}</p>
                  <h3 className="mt-3 font-serif text-2xl text-[var(--ink)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5a5a54]">{body}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[26px] border border-[rgba(84,98,64,0.12)] bg-white/36 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f5b3a]">Proof appears early</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {proofPoints.map((point) => (
                  <span key={point} className="rounded-full border border-[rgba(84,98,64,0.16)] bg-white/48 px-4 py-2 text-sm text-[#4d4944]">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasMarketplaceStats && (
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
      )}

      {isBuyer && (
        <>
          <section className="container-editorial py-20">
            <div className="panel-soft p-6 md:p-10">
              <p className="badge-patch mb-5">{t.sourcingEyebrow}</p>
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <h2 className="text-4xl md:text-5xl">{t.buyerToolsTitle}</h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-[#5a5a54]">{t.buyerToolsBody}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["/compare", t.compare, t.compareBody],
                    ["/landed-cost", t.cost, t.costBody],
                    ["/logistics", t.logistics, t.logisticsBody],
                  ].map(([href, title, body]) => (
                    <Link className="rounded-[28px] border border-[rgba(84,98,64,0.12)] bg-white/50 p-5 transition hover:-translate-y-1 hover:border-[var(--forest)]" href={href} key={href}>
                      <h3 className="font-serif text-2xl">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#6d675f]">{body}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {!isBuyer && (
        <>
          <section className="container-editorial py-20">
            <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="panel-soft p-6 md:p-10">
                <p className="badge-patch mb-5">{sectionText(audit, eyebrowKey, "AI Audit")}</p>
                <h2 className="max-w-2xl text-4xl md:text-6xl">{sectionText(audit, titleKey, "Chosen before shown.")}</h2>
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
                  <Link className="btn-pill btn-pill-outline min-h-[50px] px-8" href="/export-docs">{t.docs}</Link>
                </div>
              </div>

              <div className="panel-soft p-6 md:p-8">
                <p className="badge-patch tier-certified mb-5">Seller Packages</p>
                <h2 className="text-4xl">Support for the work around the work.</h2>
                <p className="mt-4 text-sm leading-7 text-[#5a5a54]">
                  Basic, Growth, and Premium help a manufacturer become easier to understand: identity, photography, catalogue, website, and buyer introductions. The audit remains the readiness map, not the payment door.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    ["Basic", "$299", "3 weeks"],
                    ["Growth", "$799", "6 weeks"],
                    ["Premium", "$1,999", "10 weeks"],
                  ].map(([name, price, delivery]) => (
                    <Link className="flex items-center justify-between rounded-full border border-[rgba(84,98,64,0.12)] bg-white/55 px-5 py-4 transition hover:border-[var(--forest)]" href={`/checkout/marketing?package=${name.toLowerCase()}`} key={name}>
                      <span className="font-semibold">{name}</span>
                      <span className="metric-numeral">{price}</span>
                      <span className="text-sm text-[#6d675f]">{delivery}</span>
                    </Link>
                  ))}
                </div>
                <Link className="btn-pill btn-pill-forest mt-7 w-full min-h-[50px]" href="/marketing-packages">Understand Packages</Link>
              </div>
            </div>
          </section>

          <section className="container-editorial pb-20">
            <div className="panel-soft p-6 md:p-10">
              <p className="badge-patch mb-5">{t.docsEyebrow}</p>
              <h2 className="max-w-2xl text-4xl md:text-5xl">{t.sellerDocsTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#5a5a54]">{t.sellerDocsBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="btn-pill btn-pill-forest min-h-[50px] px-8" href="/export-docs">{t.docs}</Link>
                <Link className="btn-pill btn-pill-outline min-h-[50px] px-8" href="/seller/export-docs">Seller checklist</Link>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="container-editorial py-16">
        <div className="grid gap-8 rounded-[28px] border border-[rgba(44,44,44,0.08)] bg-white/80 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_0.9fr] md:items-center md:p-8">
          <div>
            <p className="badge-patch mb-4">{sectionText(waitlist, eyebrowKey, "Notes")}</p>
            <h2 className="text-3xl">{sectionText(waitlist, titleKey, "When something is ready, we send it.")}</h2>
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
