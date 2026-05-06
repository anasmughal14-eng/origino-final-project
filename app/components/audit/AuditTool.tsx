"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Severity = "P0" | "P1" | "P2";

type AuditResult = {
  audit_id: string;
  business_name: string;
  audit_date: string;
  overall_score: number;
  marketing_mature: boolean;
  marketing_stage: "Invisible" | "Awareness-Only" | "Traffic-Without-Conversions" | "Conversion-Functional" | "Marketing-Led";
  category_scores: Record<string, number>;
  verdict: string;
  score_interpretation: string;
  critical_gaps: Array<{
    category: string;
    issue: string;
    impact: string;
    severity: Severity;
    fix_estimate: string;
  }>;
  action_plan: {
    p0_revenue_blocking: string[];
    p1_growth_blocking: string[];
    p2_optimization: string[];
  };
  competitive_benchmark: {
    average_pakistani_sme: number;
    your_score: number;
    marketing_led_competitors: number;
    percentile: string;
  };
  estimated_timeline: {
    to_70_functional: string;
    to_80_competitive: string;
    to_90_marketing_led: string;
  };
  agency_opportunity: {
    triggered: boolean;
    score_threshold_met: boolean;
    recommended_tier: string;
    pitch_angle: string;
    urgency_hook: string;
    projected_roi_statement: string;
  };
  aiUsed: boolean;
  savedToSupabase?: boolean;
  requiresAccount?: boolean;
};

type SectionKey =
  | "brand_identity"
  | "website_quality"
  | "social_media"
  | "content_marketing"
  | "lead_generation"
  | "paid_advertising"
  | "competitor_awareness";

type FormState = {
  business_name: string;
  fullName: string;
  email: string;
  phone: string;
  industry: string;
  years_in_business: string;
  website_url: string;
  website_platform: string;
  city: string;
  brand_identity: Record<string, string>;
  website_quality: Record<string, string>;
  social_media: Record<string, string>;
  content_marketing: Record<string, string>;
  lead_generation: Record<string, string>;
  paid_advertising: Record<string, string>;
  competitor_awareness: Record<string, string>;
  additional_notes: string;
};

const industries = [
  "Textiles & Apparel",
  "Surgical & Medical Instruments",
  "Sporting Goods",
  "Leather Goods",
  "Engineering & Light Manufacturing",
  "Food & Agriculture",
  "Chemicals & Pharmaceuticals",
  "Furniture & Handicrafts",
  "IT Services & Software",
  "Other",
];

const categoryLabels: Record<string, string> = {
  brand_identity: "Brand Identity",
  website_digital_home: "Website & Digital Home",
  content_marketing: "Content Marketing",
  social_media: "Social Media",
  lead_generation: "Lead Generation",
  paid_advertising: "Paid Advertising",
};

const categoryMax: Record<string, number> = {
  brand_identity: 15,
  website_digital_home: 20,
  content_marketing: 15,
  social_media: 20,
  lead_generation: 15,
  paid_advertising: 15,
};

const initialForm: FormState = {
  business_name: "",
  fullName: "",
  email: "",
  phone: "",
  industry: "",
  years_in_business: "",
  website_url: "",
  website_platform: "none",
  city: "",
  brand_identity: {
    professional_logo: "no",
    brand_guidelines: "no",
    clear_value_proposition: "unclear",
    target_audience_defined: "vague",
    differentiation_from_competitors: "unclear",
  },
  website_quality: {
    mobile_friendly: "dont_know",
    load_speed: "dont_know",
    clear_ctas: "no",
    lead_capture_forms: "none",
    google_analytics_4: "no",
    meta_pixel: "dont_know",
    ssl_https: "dont_know",
    seo_basic: "none",
    last_updated: "over_1yr",
  },
  social_media: {
    primary_platform: "none",
    posting_frequency: "rarely",
    engagement_rate_estimate: "none",
    paid_ads_running: "none",
    community_management: "rarely",
    bio_optimized: "just_description",
  },
  content_marketing: {
    blog_active: "no",
    last_blog_post: "never",
    video_content: "never",
    testimonials_count: "none",
    case_studies: "no",
    content_calendar: "no",
  },
  lead_generation: {
    email_capture: "none",
    crm_used: "none",
    sales_funnel_defined: "no",
    retargeting_ads: "no",
    landing_pages: "no",
    lead_magnet: "none",
    automated_followup: "none",
    sales_response_time: "longer",
  },
  paid_advertising: {
    meta_ads_active: "no",
    google_ads_active: "no",
    conversion_tracking_verified: "dont_know",
    ab_testing: "no",
    known_roas_or_cpa: "no",
    monthly_budget_usd: "none",
    lookalike_audiences: "no",
    remarketing_active: "no",
  },
  competitor_awareness: {
    knows_top_3_competitors: "no",
    monitors_competitor_ads: "no",
  },
  additional_notes: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function scoreTone(score: number) {
  if (score < 50) return "border-[var(--terracotta)] text-[var(--terracotta)]";
  if (score < 70) return "border-[var(--gold)] text-[var(--gold)]";
  if (score < 85) return "border-[var(--forest-light)] text-[var(--forest)]";
  return "border-[var(--forest)] text-[var(--forest)]";
}

function severityTone(severity: Severity) {
  if (severity === "P0") return "border-[var(--terracotta)] text-[var(--terracotta)]";
  if (severity === "P1") return "border-[var(--gold)] text-[var(--gold)]";
  return "border-[rgba(84,98,64,0.28)] text-[var(--forest)]";
}

export default function AuditTool({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const progress = useMemo(() => Math.round((step / 6) * 100), [step]);
  const stepTitle = ["Business", "Brand", "Website", "Content", "Conversion", "Report"][step - 1];

  function updateRoot<K extends keyof FormState>(field: K, value: FormState[K]) {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateSection(sectionName: SectionKey, field: string, value: string) {
    setError("");
    setForm((current) => ({
      ...current,
      [sectionName]: {
        ...current[sectionName],
        [field]: value,
      },
    }));
  }

  function validateCore() {
    if (!form.business_name.trim()) return "Business name is required.";
    if (!isValidEmail(form.email)) return "A valid email is required before showing the full report.";
    if (!form.industry) return "Industry is required.";
    if (form.years_in_business && Number.isNaN(Number(form.years_in_business))) return "Years in business must be a number.";
    return "";
  }

  function next() {
    const message = step === 1 ? validateCore() : "";
    if (message) return setError(message);
    setStep((current) => Math.min(6, current + 1));
  }

  async function submit() {
    const message = validateCore();
    if (message) return setError(message);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          years_in_business: Number(form.years_in_business || 0),
        }),
      });
      const json = (await response.json()) as { success: boolean; data?: AuditResult; error?: string };
      if (!response.ok || !json.success || !json.data) {
        setError(json.error ?? "Audit processing failed.");
        return;
      }
      setResult(json.data);
      toast.success("Marketing audit generated");
    } catch {
      setError("Audit processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={compact ? "" : "page-enter pt-28"}>
      <section className={compact ? "" : "container-editorial pb-16"}>
        {!compact && (
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="section-kicker">AI marketing audit</p>
              <h1 className="mt-5 max-w-3xl text-[2.7rem] leading-[1.02] md:text-[4.2rem]">Know why buyers are not converting.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">
                Pakistani manufacturers often make well. Marketing is usually the gap. This audit shows what is missing before visibility, inquiries, and paid growth can work.
              </p>
            </div>
            <div className="panel-soft p-6 md:p-8">
              <h2 className="text-3xl">What it measures</h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="rounded-full border border-[rgba(84,98,64,0.14)] px-4 py-3">Brand clarity and positioning</div>
                <div className="rounded-full border border-[rgba(84,98,64,0.14)] px-4 py-3">Website, tracking, and lead capture</div>
                <div className="rounded-full border border-[rgba(84,98,64,0.14)] px-4 py-3">Content, social, paid ads, and follow-up</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[0.68fr_0.32fr]">
          <div className="panel-soft p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="small-caps text-sm text-[var(--ink-muted)]">Step {step} of 6</p>
                <h2 className="mt-1 text-[2rem] leading-[1.05] md:text-[2.65rem]">{stepTitle}</h2>
              </div>
              <span className="metric-numeral text-2xl">{progress}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(84,98,64,0.12)]">
              <div className="h-full rounded-full bg-[var(--forest)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-8">
              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input-editorial" placeholder="Business name" value={form.business_name} onChange={(event) => updateRoot("business_name", event.target.value)} />
                  <input className="input-editorial" placeholder="Contact name" value={form.fullName} onChange={(event) => updateRoot("fullName", event.target.value)} />
                  <input className="input-editorial" placeholder="Email for report" value={form.email} onChange={(event) => updateRoot("email", event.target.value)} />
                  <input className="input-editorial" placeholder="Phone / WhatsApp" value={form.phone} onChange={(event) => updateRoot("phone", event.target.value)} />
                  <select className="input-editorial" value={form.industry} onChange={(event) => updateRoot("industry", event.target.value)}>
                    <option value="">Industry</option>
                    {industries.map((industry) => <option key={industry}>{industry}</option>)}
                  </select>
                  <input className="input-editorial" placeholder="Years in business" inputMode="numeric" value={form.years_in_business} onChange={(event) => updateRoot("years_in_business", event.target.value)} />
                  <input className="input-editorial" placeholder="Website URL, if any" value={form.website_url} onChange={(event) => updateRoot("website_url", event.target.value)} />
                  <select className="input-editorial" value={form.website_platform} onChange={(event) => updateRoot("website_platform", event.target.value)}>
                    <option value="none">No website</option>
                    <option value="wordpress">WordPress</option>
                    <option value="shopify">Shopify</option>
                    <option value="custom">Custom</option>
                    <option value="wix">Wix</option>
                  </select>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Professional logo" value={form.brand_identity.professional_logo} options={["yes", "no"]} onChange={(value) => updateSection("brand_identity", "professional_logo", value)} />
                  <SelectField label="Brand guidelines" value={form.brand_identity.brand_guidelines} options={["yes", "no"]} onChange={(value) => updateSection("brand_identity", "brand_guidelines", value)} />
                  <SelectField label="Value proposition" value={form.brand_identity.clear_value_proposition} options={["10_words_or_less", "unclear", "none"]} onChange={(value) => updateSection("brand_identity", "clear_value_proposition", value)} />
                  <SelectField label="Target audience" value={form.brand_identity.target_audience_defined} options={["demographics_psychographics", "vague", "none"]} onChange={(value) => updateSection("brand_identity", "target_audience_defined", value)} />
                  <SelectField label="Competitor difference" value={form.brand_identity.differentiation_from_competitors} options={["clear", "unclear", "none"]} onChange={(value) => updateSection("brand_identity", "differentiation_from_competitors", value)} />
                  <SelectField label="City" value={form.city} options={["", "Sialkot", "Faisalabad", "Lahore", "Karachi", "Gujranwala", "Other"]} onChange={(value) => updateRoot("city", value)} />
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Mobile friendly" value={form.website_quality.mobile_friendly} options={["yes", "no", "dont_know"]} onChange={(value) => updateSection("website_quality", "mobile_friendly", value)} />
                  <SelectField label="Load speed" value={form.website_quality.load_speed} options={["under_3s", "3-5s", "over_5s", "dont_know"]} onChange={(value) => updateSection("website_quality", "load_speed", value)} />
                  <SelectField label="Clear CTAs" value={form.website_quality.clear_ctas} options={["yes", "no"]} onChange={(value) => updateSection("website_quality", "clear_ctas", value)} />
                  <SelectField label="Lead capture" value={form.website_quality.lead_capture_forms} options={["email", "whatsapp", "quote", "none"]} onChange={(value) => updateSection("website_quality", "lead_capture_forms", value)} />
                  <SelectField label="Google Analytics 4" value={form.website_quality.google_analytics_4} options={["yes", "no"]} onChange={(value) => updateSection("website_quality", "google_analytics_4", value)} />
                  <SelectField label="Meta Pixel" value={form.website_quality.meta_pixel} options={["yes", "no", "dont_know"]} onChange={(value) => updateSection("website_quality", "meta_pixel", value)} />
                  <SelectField label="SSL / HTTPS" value={form.website_quality.ssl_https} options={["yes", "no", "dont_know"]} onChange={(value) => updateSection("website_quality", "ssl_https", value)} />
                  <SelectField label="Basic SEO" value={form.website_quality.seo_basic} options={["titles_meta_schema", "none"]} onChange={(value) => updateSection("website_quality", "seo_basic", value)} />
                  <SelectField label="Last updated" value={form.website_quality.last_updated} options={["within_6mo", "1yr", "over_1yr", "never"]} onChange={(value) => updateSection("website_quality", "last_updated", value)} />
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Primary platform" value={form.social_media.primary_platform} options={["facebook", "instagram", "tiktok", "linkedin", "youtube", "none"]} onChange={(value) => updateSection("social_media", "primary_platform", value)} />
                  <SelectField label="Posting frequency" value={form.social_media.posting_frequency} options={["daily", "3x_week", "weekly", "monthly", "rarely", "never"]} onChange={(value) => updateSection("social_media", "posting_frequency", value)} />
                  <SelectField label="Engagement" value={form.social_media.engagement_rate_estimate} options={["over_5pct", "2-5pct", "under_2pct", "none"]} onChange={(value) => updateSection("social_media", "engagement_rate_estimate", value)} />
                  <SelectField label="Community replies" value={form.social_media.community_management} options={["replies_within_4hrs", "sometimes", "rarely", "never"]} onChange={(value) => updateSection("social_media", "community_management", value)} />
                  <SelectField label="Bio/link" value={form.social_media.bio_optimized} options={["cta_link", "just_description", "none"]} onChange={(value) => updateSection("social_media", "bio_optimized", value)} />
                  <SelectField label="Blog active" value={form.content_marketing.blog_active} options={["yes", "no"]} onChange={(value) => updateSection("content_marketing", "blog_active", value)} />
                  <SelectField label="Last blog post" value={form.content_marketing.last_blog_post} options={["within_3mo", "6mo", "1yr", "over_1yr", "never"]} onChange={(value) => updateSection("content_marketing", "last_blog_post", value)} />
                  <SelectField label="Video content" value={form.content_marketing.video_content} options={["regular", "sometimes", "never"]} onChange={(value) => updateSection("content_marketing", "video_content", value)} />
                  <SelectField label="Testimonials" value={form.content_marketing.testimonials_count} options={["10+", "5-9", "1-4", "none"]} onChange={(value) => updateSection("content_marketing", "testimonials_count", value)} />
                  <SelectField label="Case studies" value={form.content_marketing.case_studies} options={["yes", "no"]} onChange={(value) => updateSection("content_marketing", "case_studies", value)} />
                  <SelectField label="Content calendar" value={form.content_marketing.content_calendar} options={["yes", "no"]} onChange={(value) => updateSection("content_marketing", "content_calendar", value)} />
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Email capture" value={form.lead_generation.email_capture} options={["popup", "form", "quiz", "none"]} onChange={(value) => updateSection("lead_generation", "email_capture", value)} />
                  <SelectField label="CRM used" value={form.lead_generation.crm_used} options={["hubspot", "zoho", "salesforce", "excel", "none"]} onChange={(value) => updateSection("lead_generation", "crm_used", value)} />
                  <SelectField label="Sales funnel" value={form.lead_generation.sales_funnel_defined} options={["yes", "no"]} onChange={(value) => updateSection("lead_generation", "sales_funnel_defined", value)} />
                  <SelectField label="Retargeting ads" value={form.lead_generation.retargeting_ads} options={["yes", "no"]} onChange={(value) => updateSection("lead_generation", "retargeting_ads", value)} />
                  <SelectField label="Landing pages" value={form.lead_generation.landing_pages} options={["yes", "no"]} onChange={(value) => updateSection("lead_generation", "landing_pages", value)} />
                  <SelectField label="Lead magnet" value={form.lead_generation.lead_magnet} options={["ebook", "calculator", "audit", "discount", "none"]} onChange={(value) => updateSection("lead_generation", "lead_magnet", value)} />
                  <SelectField label="Automated follow-up" value={form.lead_generation.automated_followup} options={["email", "sms", "whatsapp", "none"]} onChange={(value) => updateSection("lead_generation", "automated_followup", value)} />
                  <SelectField label="Sales response time" value={form.lead_generation.sales_response_time} options={["under_2hrs", "same_day", "next_day", "longer"]} onChange={(value) => updateSection("lead_generation", "sales_response_time", value)} />
                  <SelectField label="Meta ads active" value={form.paid_advertising.meta_ads_active} options={["yes", "no"]} onChange={(value) => updateSection("paid_advertising", "meta_ads_active", value)} />
                  <SelectField label="Google ads active" value={form.paid_advertising.google_ads_active} options={["yes", "no"]} onChange={(value) => updateSection("paid_advertising", "google_ads_active", value)} />
                  <SelectField label="Conversion tracking" value={form.paid_advertising.conversion_tracking_verified} options={["yes", "no", "dont_know"]} onChange={(value) => updateSection("paid_advertising", "conversion_tracking_verified", value)} />
                  <SelectField label="A/B testing" value={form.paid_advertising.ab_testing} options={["yes", "no"]} onChange={(value) => updateSection("paid_advertising", "ab_testing", value)} />
                  <SelectField label="ROAS / CPA known" value={form.paid_advertising.known_roas_or_cpa} options={["yes", "no"]} onChange={(value) => updateSection("paid_advertising", "known_roas_or_cpa", value)} />
                  <input className="input-editorial" placeholder="Monthly ad budget USD, or none" value={form.paid_advertising.monthly_budget_usd} onChange={(event) => updateSection("paid_advertising", "monthly_budget_usd", event.target.value)} />
                  <SelectField label="Lookalike audiences" value={form.paid_advertising.lookalike_audiences} options={["yes", "no"]} onChange={(value) => updateSection("paid_advertising", "lookalike_audiences", value)} />
                  <SelectField label="Remarketing active" value={form.paid_advertising.remarketing_active} options={["yes", "no"]} onChange={(value) => updateSection("paid_advertising", "remarketing_active", value)} />
                  <SelectField label="Knows top 3 competitors" value={form.competitor_awareness.knows_top_3_competitors} options={["yes", "no"]} onChange={(value) => updateSection("competitor_awareness", "knows_top_3_competitors", value)} />
                  <SelectField label="Monitors competitor ads" value={form.competitor_awareness.monitors_competitor_ads} options={["yes", "no"]} onChange={(value) => updateSection("competitor_awareness", "monitors_competitor_ads", value)} />
                  <textarea className="input-editorial min-h-[120px] rounded-[28px] md:col-span-2" placeholder="Additional notes" value={form.additional_notes} onChange={(event) => updateRoot("additional_notes", event.target.value)} />
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <p className="max-w-2xl leading-7 text-[var(--ink-muted)]">
                    Generate a strict marketing-readiness report for {form.business_name || "this business"}. The report scores execution, not product quality, and shows what ORIGINO can repair.
                  </p>
                  {result && <AuditReport result={result} />}
                </div>
              )}
            </div>

            {error && <p className="mt-5 rounded-[22px] border border-[var(--terracotta)] bg-[rgba(201,133,103,0.10)] p-3 text-sm text-[var(--terracotta)]">{error}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => { setError(""); setStep((current) => Math.max(1, current - 1)); }}>Back</button>
              {step < 6 ? (
                <button className="btn-pill btn-pill-forest" type="button" onClick={next}>Next</button>
              ) : (
                <button className="btn-pill btn-pill-forest" type="button" disabled={loading} onClick={submit}>{loading ? "Auditing..." : result ? "Run Again" : "Run Marketing Audit"}</button>
              )}
            </div>
          </div>

          <aside className="panel-soft h-max p-6">
            <h2 className="text-3xl">Score map</h2>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["0-35", "Invisible"],
                ["36-49", "Awareness-only"],
                ["50-64", "Traffic without conversion"],
                ["65-84", "Conversion functional"],
                ["85-100", "Marketing-led"],
              ].map(([range, label]) => (
                <div className="flex justify-between border-b border-[rgba(84,98,64,0.12)] pb-2" key={range}>
                  <span>{label}</span>
                  <strong className="metric-numeral">{range}</strong>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-[24px] border border-[rgba(84,98,64,0.12)] p-4 text-sm leading-6 text-[var(--ink-muted)]">
              If a field is unknown, the audit scores it harshly. No evidence means no credit.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="small-caps mb-2 block text-xs text-[var(--ink-muted)]">{label}</span>
      <select className="input-editorial" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option ? option.replaceAll("_", " ") : "Select"}</option>)}
      </select>
    </label>
  );
}

function AuditReport({ result }: { result: AuditResult }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        <div className={`flex h-40 w-40 items-center justify-center rounded-full border-[12px] bg-[rgba(255,250,242,0.72)] ${scoreTone(result.overall_score)}`}>
          <div className="text-center">
            <p className="metric-numeral text-5xl">{result.overall_score}</p>
            <p className="small-caps text-xs">{result.marketing_stage}</p>
          </div>
        </div>
        <div>
          <p className="small-caps text-xs text-[var(--ink-muted)]">{result.audit_id} · {result.audit_date}</p>
          <h3 className="mt-2 text-3xl">{result.verdict}</h3>
          <p className="mt-3 leading-7 text-[var(--ink-muted)]">{result.score_interpretation}</p>
          <p className="mt-3 rounded-[24px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.6)] p-4 leading-7">
            {result.competitive_benchmark.percentile}
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.58)] p-5">
        <p className="small-caps text-xs text-[var(--ink-muted)]">Category breakdown</p>
        <div className="mt-4 space-y-4">
          {Object.entries(result.category_scores).map(([key, value]) => {
            const max = categoryMax[key] ?? 20;
            const width = `${Math.round((value / max) * 100)}%`;
            return (
              <div key={key}>
                <div className="flex justify-between gap-4 text-sm">
                  <span>{categoryLabels[key] ?? key}</span>
                  <strong className="metric-numeral">{value}/{max}</strong>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[rgba(84,98,64,0.12)]">
                  <div className="h-full rounded-full bg-[var(--forest)]" style={{ width }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {result.critical_gaps.length > 0 && (
        <div className="rounded-[28px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.58)] p-5">
          <p className="small-caps text-xs text-[var(--ink-muted)]">Critical gaps</p>
          <div className="mt-4 space-y-3">
            {result.critical_gaps.map((gap) => (
              <div className="rounded-[24px] border border-[rgba(84,98,64,0.12)] p-4" key={`${gap.category}-${gap.issue}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge-patch ${severityTone(gap.severity)}`}>{gap.severity}</span>
                  <strong>{gap.category}</strong>
                  <span className="small-caps text-xs text-[var(--ink-muted)]">{gap.fix_estimate}</span>
                </div>
                <p className="mt-3 font-medium">{gap.issue}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{gap.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ActionColumn title="P0 revenue blocking" items={result.action_plan.p0_revenue_blocking} />
        <ActionColumn title="P1 growth blocking" items={result.action_plan.p1_growth_blocking} />
        <ActionColumn title="P2 optimization" items={result.action_plan.p2_optimization} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricBox label="To 70" value={result.estimated_timeline.to_70_functional} />
        <MetricBox label="To 80" value={result.estimated_timeline.to_80_competitive} />
        <MetricBox label="To 90" value={result.estimated_timeline.to_90_marketing_led} />
      </div>

      {result.agency_opportunity.triggered && (
        <div className="rounded-[30px] border border-[rgba(84,98,64,0.18)] bg-[rgba(84,98,64,0.08)] p-5">
          <p className="small-caps text-xs text-[var(--ink-muted)]">Recommended support</p>
          <h3 className="mt-2 text-3xl">{result.agency_opportunity.recommended_tier}</h3>
          <p className="mt-3 leading-7">{result.agency_opportunity.pitch_angle}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{result.agency_opportunity.projected_roi_statement}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="btn-pill btn-pill-forest" href="/marketing-packages">See support packages</Link>
            <Link className="btn-pill btn-pill-outline" href="/checkout/marketing?package=growth">Start Growth checkout</Link>
          </div>
        </div>
      )}

      <p className="small-caps text-xs text-[var(--ink-muted)]">
        {result.aiUsed ? "Gemini audit generated." : "Rule-based fallback used. Add GEMINI_API_KEY for live Gemini scoring."}
        {result.savedToSupabase ? " Saved to Supabase." : result.requiresAccount ? " Sign in to save this audit to your seller account." : ""}
      </p>
    </div>
  );
}

function ActionColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[26px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.58)] p-4">
      <p className="small-caps text-xs text-[var(--ink-muted)]">{title}</p>
      <div className="mt-3 space-y-2">
        {(items.length ? items : ["No urgent item in this category."]).map((item) => (
          <p className="text-sm leading-6" key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[26px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.58)] p-4">
      <p className="small-caps text-xs text-[var(--ink-muted)]">{label}</p>
      <p className="mt-2 metric-numeral text-xl">{value}</p>
    </div>
  );
}
