export type AuditInput = Record<string, unknown>;

export type MarketingStage =
  | "Invisible"
  | "Awareness-Only"
  | "Traffic-Without-Conversions"
  | "Conversion-Functional"
  | "Marketing-Led";

export type MarketingCategoryScores = {
  brand_identity: number;
  website_digital_home: number;
  content_marketing: number;
  social_media: number;
  lead_generation: number;
  paid_advertising: number;
};

export type CriticalGap = {
  category: string;
  issue: string;
  impact: string;
  severity: "P0" | "P1" | "P2";
  fix_estimate: string;
};

export type AuditResult = {
  audit_id: string;
  business_name: string;
  audit_date: string;
  overall_score: number;
  marketing_mature: boolean;
  marketing_stage: MarketingStage;
  category_scores: MarketingCategoryScores;
  verdict: string;
  score_interpretation: string;
  critical_gaps: CriticalGap[];
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

  // Compatibility fields used by older portal/application code.
  score: number;
  breakdown: MarketingCategoryScores;
  status: "approved" | "conditional" | "not_ready";
  tier: string;
  feedback: string;
  decision: {
    label: string;
    summary: string;
    nextAction: string;
  };
  recommendations: string[];
};

const CATEGORY_MAX: MarketingCategoryScores = {
  brand_identity: 15,
  website_digital_home: 20,
  content_marketing: 15,
  social_media: 20,
  lead_generation: 15,
  paid_advertising: 15,
};

const AUDIT_SYSTEM_PROMPT = `You are MarketingAudit AI - a ruthless, professional marketing readiness auditor for Pakistani businesses. You evaluate whether a business can actually attract, convert, and retain customers through modern digital marketing.

AUDIT PHILOSOPHY:
- Score based on MARKETING EXECUTION, not business potential.
- A good product with zero marketing scores poorly. Be honest.
- 90+ means they have a working marketing engine; below 90 means gaps an agency can fix.
- Pakistani market context: Most SMEs rely on word-of-mouth; digital maturity is typically 2-5 years behind global standards.

SCORING RUBRIC (0-100, strict and unforgiving):
1. Brand Identity & Positioning (15 pts): clear value proposition in 10 words or less, professional logo, consistent brand colors/fonts/voice, defined audience, differentiation from top 3 competitors.
2. Website & Digital Home (20 pts): modern mobile site, load speed under 3 seconds, clear CTAs above fold, lead capture forms, GA4, Meta Pixel, SEO, SSL, updated within 6 months.
3. Content Marketing (15 pts): active blog/resources, video, testimonials, case studies, content calendar, objection-handling content.
4. Social Media Presence (20 pts): 3x/week posting, engagement above 2%, right platform strategy, paid advertising knowledge, 4-hour replies, conversion bio, UGC/social proof.
5. Lead Generation & Conversion (15 pts): email capture, CRM, funnel stages, retargeting, landing pages, lead magnet, automated follow-up, sales response under 2 hours.
6. Paid Advertising & Performance (15 pts): Meta/Google ads, conversion tracking, monthly A/B testing, ROAS/CPA targets, budget, lookalikes, remarketing.

OUTPUT RULES:
- Return ONLY valid JSON. No markdown.
- If data is missing for a category, score 0-3. Never assume.
- Gaps must be specific and actionable.
- Action items prioritized: P0 revenue-blocking, P1 growth-blocking, P2 optimization.
- Include agency_opportunity when score < 90.
- Include estimated_timeline for reaching 70, 80, and 90.
- marketing_stage must be one of: Invisible, Awareness-Only, Traffic-Without-Conversions, Conversion-Functional, Marketing-Led.

Required JSON keys: audit_id, business_name, audit_date, overall_score, marketing_mature, marketing_stage, category_scores, verdict, score_interpretation, critical_gaps, action_plan, competitive_benchmark, estimated_timeline, agency_opportunity.`;

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function section(data: AuditInput, key: string) {
  return record(data[key]);
}

function textValue(source: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function yes(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return ["yes", "true", "1", "email", "whatsapp", "quote", "both", "meta", "google", "daily", "3x_week", "over_5pct", "2-5pct", "cta_link", "regular", "sometimes", "10+", "5-9", "1-4", "popup", "form", "quiz", "hubspot", "zoho", "salesforce", "excel", "ebook", "calculator", "audit", "discount", "under_2hrs", "same_day", "under_3s", "3-5s", "within_6mo", "titles_meta_schema", "demographics_psychographics", "clear", "10_words_or_less", "wordpress", "shopify", "custom", "wix"].includes(normalized);
}

function strongYes(value: unknown) {
  if (typeof value !== "string") return yes(value);
  const normalized = value.trim().toLowerCase();
  return ["yes", "true", "daily", "3x_week", "over_5pct", "2-5pct", "both", "meta", "google", "regular", "10+", "5-9", "popup", "form", "quiz", "hubspot", "zoho", "salesforce", "under_2hrs", "under_3s", "within_6mo", "titles_meta_schema", "demographics_psychographics", "clear", "10_words_or_less"].includes(normalized);
}

function absent(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "" || normalized === "no" || normalized === "none" || normalized === "never" || normalized === "dont_know";
  }
  return false;
}

function clamp(value: unknown, min: number, max: number) {
  const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
  if (!Number.isFinite(numberValue)) return min;
  return Math.max(min, Math.min(max, Math.round(numberValue)));
}

function auditId() {
  return `MA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function stageFromScore(score: number): MarketingStage {
  if (score <= 35) return "Invisible";
  if (score <= 49) return "Awareness-Only";
  if (score <= 64) return "Traffic-Without-Conversions";
  if (score <= 84) return "Conversion-Functional";
  return "Marketing-Led";
}

function tierFromScore(score: number) {
  if (score <= 35) return "Emergency Marketing Intervention";
  if (score <= 49) return "Zero-to-Marketing Foundation";
  if (score <= 64) return "Conversion Engine Package";
  if (score <= 74) return "Growth Accelerator";
  if (score <= 84) return "Market Domination Package";
  if (score <= 89) return "Premium Partnership";
  return "Advanced Retainer / Advisory";
}

function pitchFromScore(score: number) {
  if (score <= 35) return "Your competitors are stealing customers who cannot find you.";
  if (score <= 49) return "You exist, but the current system is not built to convert.";
  if (score <= 64) return "Traffic is wasted without capture. The leaks need repair.";
  if (score <= 74) return "The system works. Now it needs profitable acquisition.";
  if (score <= 84) return "You are close. The next work is becoming hard to ignore.";
  if (score <= 89) return "Fine-tuning can move this into market leadership.";
  return "Maintain performance and expand the engine carefully.";
}

function timelineFromScore(score: number) {
  if (score <= 35) {
    return {
      to_70_functional: "12-16 weeks",
      to_80_competitive: "16-24 weeks",
      to_90_marketing_led: "24+ weeks",
    };
  }
  if (score <= 49) {
    return {
      to_70_functional: "8-12 weeks",
      to_80_competitive: "12-18 weeks",
      to_90_marketing_led: "18-24 weeks",
    };
  }
  if (score <= 64) {
    return {
      to_70_functional: "4-6 weeks",
      to_80_competitive: "6-10 weeks",
      to_90_marketing_led: "12-18 weeks",
    };
  }
  if (score <= 74) {
    return {
      to_70_functional: "Already close",
      to_80_competitive: "3-5 weeks",
      to_90_marketing_led: "4-8 weeks",
    };
  }
  if (score <= 84) {
    return {
      to_70_functional: "Already functional",
      to_80_competitive: "Already competitive",
      to_90_marketing_led: "4-6 weeks",
    };
  }
  return {
    to_70_functional: "Already functional",
    to_80_competitive: "Already competitive",
    to_90_marketing_led: score >= 90 ? "Already marketing-led" : "2-4 weeks",
  };
}

function percentile(score: number) {
  if (score >= 90) return "Top 5% of Pakistani SME marketing execution.";
  if (score >= 75) return "Ahead of most Pakistani SMEs, but not yet marketing-led.";
  if (score >= 60) return "Above average, with conversion gaps still limiting growth.";
  if (score >= 48) return "Near the average Pakistani SME baseline.";
  return "Below the average Pakistani SME digital maturity baseline.";
}

function statusFromScore(score: number): AuditResult["status"] {
  if (score >= 80) return "approved";
  if (score >= 60) return "conditional";
  return "not_ready";
}

function buildDecision(score: number, tier: string) {
  if (score >= 90) {
    return {
      label: "Marketing-led",
      summary: "The business has a functioning marketing engine. ORIGINO support should focus on expansion and refinement.",
      nextAction: "Maintain and scale",
    };
  }
  if (score >= 65) {
    return {
      label: "Ready for growth support",
      summary: `The foundation exists. ${tier} should improve conversion, paid acquisition, and reporting discipline.`,
      nextAction: "Review service support",
    };
  }
  return {
    label: "Marketing repair needed",
    summary: `The business is not yet converting attention reliably. ${tier} should repair visibility, capture, and follow-up first.`,
    nextAction: "Start the repair plan",
  };
}

function scoreBrand(brand: Record<string, unknown>) {
  let score = 0;
  if (yes(brand.professional_logo)) score += 3;
  if (yes(brand.brand_guidelines)) score += 3;
  if (strongYes(brand.clear_value_proposition)) score += 3;
  if (strongYes(brand.target_audience_defined)) score += 3;
  if (strongYes(brand.differentiation_from_competitors)) score += 3;
  return clamp(score, 0, CATEGORY_MAX.brand_identity);
}

function scoreWebsite(root: AuditInput, website: Record<string, unknown>) {
  let score = 0;
  if (textValue(root, ["website_url", "websiteUrl", "website"])) score += 1;
  if (strongYes(root.website_platform) && textValue(root, ["website_platform"]) !== "none") score += 1;
  if (strongYes(website.mobile_friendly)) score += 3;
  if (String(website.load_speed ?? "").toLowerCase() === "under_3s") score += 3;
  else if (String(website.load_speed ?? "").toLowerCase() === "3-5s") score += 1;
  if (yes(website.clear_ctas)) score += 2;
  if (yes(website.lead_capture_forms)) score += 2;
  if (yes(website.google_analytics_4)) score += 2;
  if (yes(website.meta_pixel)) score += 2;
  if (yes(website.ssl_https)) score += 2;
  if (yes(website.seo_basic)) score += 2;
  if (String(website.last_updated ?? "").toLowerCase() === "within_6mo") score += 2;
  else if (String(website.last_updated ?? "").toLowerCase() === "1yr") score += 1;
  return clamp(score, 0, CATEGORY_MAX.website_digital_home);
}

function scoreContent(content: Record<string, unknown>) {
  let score = 0;
  if (yes(content.blog_active)) score += 2;
  if (String(content.last_blog_post ?? "").toLowerCase() === "within_3mo") score += 3;
  else if (String(content.last_blog_post ?? "").toLowerCase() === "6mo") score += 1;
  if (String(content.video_content ?? "").toLowerCase() === "regular") score += 3;
  else if (String(content.video_content ?? "").toLowerCase() === "sometimes") score += 1;
  if (["10+", "5-9"].includes(String(content.testimonials_count ?? "").toLowerCase())) score += 3;
  else if (String(content.testimonials_count ?? "").toLowerCase() === "1-4") score += 1;
  if (yes(content.case_studies)) score += 2;
  if (yes(content.content_calendar)) score += 2;
  return clamp(score, 0, CATEGORY_MAX.content_marketing);
}

function scoreSocial(social: Record<string, unknown>) {
  let score = 0;
  if (!absent(social.primary_platform)) score += 2;
  if (String(social.posting_frequency ?? "").toLowerCase() === "daily") score += 4;
  else if (String(social.posting_frequency ?? "").toLowerCase() === "3x_week") score += 3;
  else if (String(social.posting_frequency ?? "").toLowerCase() === "weekly") score += 1;
  if (String(social.engagement_rate_estimate ?? "").toLowerCase() === "over_5pct") score += 4;
  else if (String(social.engagement_rate_estimate ?? "").toLowerCase() === "2-5pct") score += 3;
  if (yes(social.paid_ads_running)) score += 3;
  if (String(social.community_management ?? "").toLowerCase() === "replies_within_4hrs") score += 4;
  else if (String(social.community_management ?? "").toLowerCase() === "sometimes") score += 1;
  if (String(social.bio_optimized ?? "").toLowerCase() === "cta_link") score += 3;
  return clamp(score, 0, CATEGORY_MAX.social_media);
}

function scoreLeadGen(lead: Record<string, unknown>) {
  let score = 0;
  if (yes(lead.email_capture)) score += 2;
  if (yes(lead.crm_used)) score += 2;
  if (yes(lead.sales_funnel_defined)) score += 2;
  if (yes(lead.retargeting_ads)) score += 2;
  if (yes(lead.landing_pages)) score += 2;
  if (yes(lead.lead_magnet)) score += 2;
  if (yes(lead.automated_followup)) score += 2;
  if (String(lead.sales_response_time ?? "").toLowerCase() === "under_2hrs") score += 1;
  return clamp(score, 0, CATEGORY_MAX.lead_generation);
}

function scorePaidAds(paid: Record<string, unknown>) {
  let score = 0;
  if (yes(paid.meta_ads_active)) score += 2;
  if (yes(paid.google_ads_active)) score += 2;
  if (yes(paid.conversion_tracking_verified)) score += 2;
  if (yes(paid.ab_testing)) score += 2;
  if (yes(paid.known_roas_or_cpa)) score += 2;
  if (!absent(paid.monthly_budget_usd) && String(paid.monthly_budget_usd).toLowerCase() !== "none") score += 2;
  if (yes(paid.lookalike_audiences)) score += 1;
  if (yes(paid.remarketing_active)) score += 2;
  return clamp(score, 0, CATEGORY_MAX.paid_advertising);
}

function buildCriticalGaps(data: AuditInput, scores: MarketingCategoryScores): CriticalGap[] {
  const brand = section(data, "brand_identity");
  const website = section(data, "website_quality");
  const content = section(data, "content_marketing");
  const social = section(data, "social_media");
  const lead = section(data, "lead_generation");
  const paid = section(data, "paid_advertising");
  const gaps: CriticalGap[] = [];

  if (!yes(website.clear_ctas)) gaps.push({ category: "Website", issue: "No clear conversion CTA above the fold.", impact: "Visitors arrive but do not know what action to take, reducing inquiry volume.", severity: "P0", fix_estimate: "2-3 days" });
  if (!yes(website.lead_capture_forms)) gaps.push({ category: "Website", issue: "No lead capture form, quote request, email capture, or WhatsApp capture.", impact: "Paid and organic traffic cannot become owned leads.", severity: "P0", fix_estimate: "2-4 days" });
  if (!yes(lead.automated_followup)) gaps.push({ category: "Lead generation", issue: "No automated follow-up sequence after inquiry or form submission.", impact: "Warm leads cool down before sales can close them.", severity: "P0", fix_estimate: "1 week" });
  if (!yes(paid.conversion_tracking_verified) && (yes(paid.meta_ads_active) || yes(paid.google_ads_active))) gaps.push({ category: "Paid advertising", issue: "Ads are running without verified conversion tracking.", impact: "Budget is being spent without knowing which leads or sales came from campaigns.", severity: "P0", fix_estimate: "1-2 days" });

  if (!yes(brand.professional_logo)) gaps.push({ category: "Brand identity", issue: "Professional logo evidence is missing.", impact: "Procurement teams see less stability before the first conversation.", severity: "P1", fix_estimate: "1 week" });
  if (!strongYes(brand.clear_value_proposition)) gaps.push({ category: "Brand positioning", issue: "Value proposition is unclear or too long.", impact: "Buyers cannot quickly understand why this business should be shortlisted.", severity: "P1", fix_estimate: "2-3 days" });
  if (!yes(website.google_analytics_4)) gaps.push({ category: "Analytics", issue: "Google Analytics 4 is not installed or not confirmed.", impact: "The business cannot learn what channels bring serious visitors.", severity: "P1", fix_estimate: "1 day" });
  if (!yes(website.meta_pixel)) gaps.push({ category: "Retargeting", issue: "No Meta Pixel confirmed.", impact: "Website visitors cannot be retargeted after leaving.", severity: "P1", fix_estimate: "1 day" });
  if (!yes(content.case_studies)) gaps.push({ category: "Content", issue: "No case studies with before/after proof.", impact: "Claims stay abstract and do not help sales justify price.", severity: "P1", fix_estimate: "2-3 weeks" });
  if (!yes(lead.crm_used)) gaps.push({ category: "Sales process", issue: "No CRM or structured lead tracker in use.", impact: "Inquiries can be lost, duplicated, or followed up late.", severity: "P1", fix_estimate: "2-4 days" });

  if (scores.social_media < 10) gaps.push({ category: "Social media", issue: "Social activity is inconsistent or not conversion-led.", impact: "Audience attention is not turning into repeatable demand.", severity: "P2", fix_estimate: "2-4 weeks" });
  if (!yes(paid.ab_testing)) gaps.push({ category: "Paid advertising", issue: "No monthly A/B testing of creatives, audiences, or landing pages.", impact: "Campaigns may plateau without learning what converts.", severity: "P2", fix_estimate: "Monthly process" });

  return gaps.slice(0, 8);
}

function buildActionPlan(gaps: CriticalGap[]) {
  const bySeverity = (severity: CriticalGap["severity"]) => gaps.filter((gap) => gap.severity === severity).map((gap) => gap.issue);
  return {
    p0_revenue_blocking: bySeverity("P0").slice(0, 4),
    p1_growth_blocking: bySeverity("P1").slice(0, 4),
    p2_optimization: bySeverity("P2").slice(0, 4),
  };
}

function recommendationFromGap(gap: CriticalGap) {
  return `${gap.category}: ${gap.issue}`;
}

function buildFallbackResult(data: AuditInput): AuditResult {
  const businessName = textValue(data, ["business_name", "businessName", "companyName", "company"], "This business");
  const scores: MarketingCategoryScores = {
    brand_identity: scoreBrand(section(data, "brand_identity")),
    website_digital_home: scoreWebsite(data, section(data, "website_quality")),
    content_marketing: scoreContent(section(data, "content_marketing")),
    social_media: scoreSocial(section(data, "social_media")),
    lead_generation: scoreLeadGen(section(data, "lead_generation")),
    paid_advertising: scorePaidAds(section(data, "paid_advertising")),
  };
  const score = clamp(Object.values(scores).reduce((total, item) => total + item, 0), 0, 100);
  const stage = stageFromScore(score);
  const tier = tierFromScore(score);
  const gaps = buildCriticalGaps(data, scores);
  const verdict = score >= 90
    ? `${businessName} has a working marketing engine.`
    : `${businessName} may have a good product, but the current marketing system is not strong enough yet.`;
  const scoreInterpretation = `${score}/100 means the business is at the ${stage} stage. The score reflects execution, not product quality.`;
  const actionPlan = buildActionPlan(gaps);
  const decision = buildDecision(score, tier);
  const timeline = timelineFromScore(score);
  const agencyTriggered = score < 90;

  return {
    audit_id: auditId(),
    business_name: businessName,
    audit_date: today(),
    overall_score: score,
    marketing_mature: score >= 90,
    marketing_stage: stage,
    category_scores: scores,
    verdict,
    score_interpretation: scoreInterpretation,
    critical_gaps: gaps,
    action_plan: actionPlan,
    competitive_benchmark: {
      average_pakistani_sme: 48,
      your_score: score,
      marketing_led_competitors: 85,
      percentile: percentile(score),
    },
    estimated_timeline: timeline,
    agency_opportunity: {
      triggered: agencyTriggered,
      score_threshold_met: agencyTriggered,
      recommended_tier: tier,
      pitch_angle: pitchFromScore(score),
      urgency_hook: "Pakistani manufacturers often make well, but buyers only respond when the work is visible, documented, and easy to trust.",
      projected_roi_statement: "Fixing P0 gaps typically increases qualified lead capture within 30-60 days.",
    },
    aiUsed: false,
    score,
    breakdown: scores,
    status: statusFromScore(score),
    tier,
    feedback: `${verdict} ${scoreInterpretation}`,
    decision,
    recommendations: gaps.slice(0, 5).map(recommendationFromGap),
  };
}

function normalizeScores(value: unknown, fallback: MarketingCategoryScores): MarketingCategoryScores {
  const source = record(value);
  const scoreValue = (key: keyof MarketingCategoryScores, max: number) => key in source ? clamp(source[key], 0, max) : fallback[key];
  return {
    brand_identity: scoreValue("brand_identity", 15),
    website_digital_home: scoreValue("website_digital_home", 20),
    content_marketing: scoreValue("content_marketing", 15),
    social_media: scoreValue("social_media", 20),
    lead_generation: scoreValue("lead_generation", 15),
    paid_advertising: scoreValue("paid_advertising", 15),
  };
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
  return items.length ? items : fallback;
}

function normalizeCriticalGaps(value: unknown, fallback: CriticalGap[]): CriticalGap[] {
  if (!Array.isArray(value)) return fallback;
  const gaps = value.map((item) => {
    const gap = record(item);
    const severity = textValue(gap, ["severity"], "P1");
    return {
      category: textValue(gap, ["category"], "Marketing"),
      issue: textValue(gap, ["issue"], "Marketing execution gap"),
      impact: textValue(gap, ["impact"], "Qualified leads are harder to capture and convert."),
      severity: severity === "P0" || severity === "P2" ? severity : "P1",
      fix_estimate: textValue(gap, ["fix_estimate"], "1-2 weeks"),
    } satisfies CriticalGap;
  }).filter((gap) => gap.issue);
  return gaps.length ? gaps.slice(0, 8) : fallback;
}

function normalizeGeminiResult(payload: unknown, fallback: AuditResult): AuditResult {
  const source = record(payload);
  const scores = normalizeScores(source.category_scores, fallback.category_scores);
  const score = "overall_score" in source ? clamp(source.overall_score, 0, 100) : fallback.overall_score;
  const stageValue = textValue(source, ["marketing_stage"], fallback.marketing_stage);
  const stage: MarketingStage = ["Invisible", "Awareness-Only", "Traffic-Without-Conversions", "Conversion-Functional", "Marketing-Led"].includes(stageValue)
    ? stageValue as MarketingStage
    : stageFromScore(score);
  const tier = tierFromScore(score);
  const gaps = normalizeCriticalGaps(source.critical_gaps, fallback.critical_gaps);
  const action = record(source.action_plan);
  const benchmark = record(source.competitive_benchmark);
  const timeline = record(source.estimated_timeline);
  const opportunity = record(source.agency_opportunity);
  const verdict = textValue(source, ["verdict"], fallback.verdict);
  const interpretation = textValue(source, ["score_interpretation"], fallback.score_interpretation);
  const decision = buildDecision(score, tier);

  return {
    audit_id: textValue(source, ["audit_id"], fallback.audit_id),
    business_name: textValue(source, ["business_name"], fallback.business_name),
    audit_date: textValue(source, ["audit_date"], fallback.audit_date),
    overall_score: score,
    marketing_mature: typeof source.marketing_mature === "boolean" ? source.marketing_mature : score >= 90,
    marketing_stage: stage,
    category_scores: scores,
    verdict,
    score_interpretation: interpretation,
    critical_gaps: gaps,
    action_plan: {
      p0_revenue_blocking: normalizeStringArray(action.p0_revenue_blocking, fallback.action_plan.p0_revenue_blocking),
      p1_growth_blocking: normalizeStringArray(action.p1_growth_blocking, fallback.action_plan.p1_growth_blocking),
      p2_optimization: normalizeStringArray(action.p2_optimization, fallback.action_plan.p2_optimization),
    },
    competitive_benchmark: {
      average_pakistani_sme: "average_pakistani_sme" in benchmark ? clamp(benchmark.average_pakistani_sme, 0, 100) : 48,
      your_score: "your_score" in benchmark ? clamp(benchmark.your_score, 0, 100) : score,
      marketing_led_competitors: "marketing_led_competitors" in benchmark ? clamp(benchmark.marketing_led_competitors, 0, 100) : 85,
      percentile: textValue(benchmark, ["percentile"], fallback.competitive_benchmark.percentile),
    },
    estimated_timeline: {
      to_70_functional: textValue(timeline, ["to_70_functional"], fallback.estimated_timeline.to_70_functional),
      to_80_competitive: textValue(timeline, ["to_80_competitive"], fallback.estimated_timeline.to_80_competitive),
      to_90_marketing_led: textValue(timeline, ["to_90_marketing_led"], fallback.estimated_timeline.to_90_marketing_led),
    },
    agency_opportunity: {
      triggered: typeof opportunity.triggered === "boolean" ? opportunity.triggered : score < 90,
      score_threshold_met: typeof opportunity.score_threshold_met === "boolean" ? opportunity.score_threshold_met : score < 90,
      recommended_tier: textValue(opportunity, ["recommended_tier"], tier),
      pitch_angle: textValue(opportunity, ["pitch_angle"], pitchFromScore(score)),
      urgency_hook: textValue(opportunity, ["urgency_hook"], fallback.agency_opportunity.urgency_hook),
      projected_roi_statement: textValue(opportunity, ["projected_roi_statement"], fallback.agency_opportunity.projected_roi_statement),
    },
    aiUsed: true,
    score,
    breakdown: scores,
    status: statusFromScore(score),
    tier,
    feedback: `${verdict} ${interpretation}`,
    decision,
    recommendations: gaps.slice(0, 5).map(recommendationFromGap),
  };
}

function extractGeminiText(payload: unknown) {
  const root = record(payload);
  const candidates = Array.isArray(root.candidates) ? root.candidates : [];
  const firstCandidate = record(candidates[0]);
  const content = record(firstCandidate.content);
  const parts = Array.isArray(content.parts) ? content.parts : [];
  return parts.map((part) => textValue(record(part), ["text"])).filter(Boolean).join("\n").trim();
}

async function runGeminiAudit(data: AuditInput, fallback: AuditResult) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: AUDIT_SYSTEM_PROMPT },
            { text: `AUDIT THIS BUSINESS. Use this data. If a field is empty, unknown, or no, treat as absent and score accordingly.\n${JSON.stringify(data)}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini audit failed with ${response.status}`);
  const payload = await response.json() as unknown;
  const text = extractGeminiText(payload);
  if (!text) throw new Error("Gemini returned an empty audit response");
  return normalizeGeminiResult(JSON.parse(text) as unknown, fallback);
}

export function calculateAuditScore(data: AuditInput) {
  const result = buildFallbackResult(data);
  return { score: result.overall_score, breakdown: result.category_scores };
}

export async function runAudit(data: AuditInput): Promise<AuditResult> {
  const fallback = buildFallbackResult(data);
  try {
    return await runGeminiAudit(data, fallback);
  } catch {
    return fallback;
  }
}
