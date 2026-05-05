export type AuditInput = Record<string, unknown>;

export type AuditBreakdown = {
  brand: number;
  digital: number;
  export: number;
  product: number;
  operations: number;
  compliance: number;
};

export type AuditResult = {
  score: number;
  breakdown: AuditBreakdown;
  status: "approved" | "conditional" | "not_ready";
  tier: "self_declared" | "document_verified" | "site_visited" | "origino_certified";
  feedback: string;
  aiUsed: boolean;
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function truthy(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return Boolean(normalized) && normalized !== "false" && normalized !== "no";
  }
  return Boolean(value);
}

export function calculateAuditScore(data: AuditInput) {
  const certifications = Array.isArray(data.certifications)
    ? data.certifications.filter(Boolean)
    : typeof data.certifications === "string" && data.certifications.trim()
      ? data.certifications.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  const exportCountries = Array.isArray(data.exportCountries)
    ? data.exportCountries.filter(Boolean)
    : typeof data.exportCountries === "string" && data.exportCountries.trim()
      ? data.exportCountries.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  const hasWebsite = truthy(data.website) || truthy(data.hasWebsite);
  const hasSocial = truthy(data.instagram) || truthy(data.linkedin) || truthy(data.hasSocial);
  const breakdown: AuditBreakdown = {
    brand: (truthy(data.hasLogo) ? 8 : 0) + (truthy(data.hasBrandConsistency) ? 7 : 0) + (truthy(data.hasPackaging) ? 10 : 0),
    digital: (hasWebsite ? 10 : 0) + (truthy(data.hasEnglishCatalog) ? 5 : 0) + (hasSocial ? 10 : 0),
    export: (truthy(data.hasExported) ? 10 : 0) + (exportCountries.length >= 2 ? 5 : 0) + (truthy(data.hasBuyerRelationships) ? 5 : 0),
    product: (truthy(data.hasPhotography) ? 8 : 0) + (truthy(data.hsCode) ? 4 : 0) + (certifications.length > 0 ? 3 : 0),
    operations: (truthy(data.capacity) || truthy(data.productionCapacity) ? 5 : 0) + (truthy(data.leadTime) || truthy(data.leadTimes) ? 5 : 0),
    compliance: (truthy(data.ntn) || truthy(data.fbrNtn) ? 3 : 0) + (truthy(data.hasExportDocs) || truthy(data.hasDocuments) ? 2 : 0),
  };
  const score = Object.values(breakdown).reduce((total, item) => total + item, 0);
  return { score, breakdown };
}

export function statusFromScore(score: number): AuditResult["status"] {
  if (score >= 80) return "approved";
  if (score >= 60) return "conditional";
  return "not_ready";
}

export function tierFromScore(score: number): AuditResult["tier"] {
  if (score >= 90) return "origino_certified";
  if (score >= 75) return "site_visited";
  if (score >= 60) return "document_verified";
  return "self_declared";
}

function fallbackFeedback(data: AuditInput, breakdown: AuditBreakdown) {
  const city = text(data.city, "Pakistan");
  const category = text(data.category, "export");
  const targetMarket = text(data.targetMarkets ?? data.targetMarket, "international");
  const company = text(data.companyName ?? data.company, "this supplier");
  const weakest = Object.entries(breakdown).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "documentation";
  const advice: Record<string, string> = {
    brand: `For ${targetMarket} buyers, ${company} needs a clearer brand pack: logo, consistent stationery, and export packaging that can be sent with quotes.`,
    digital: `As a ${city}-based ${category} manufacturer, ${company} needs a buyer-facing website or English catalog before procurement teams can shortlist it.`,
    export: `${company} should document previous export shipments, buyer references, and target-country experience so ORIGINO can judge real export readiness.`,
    product: `${category} buyers need product photography, HS code clarity, and relevant certificates before they request samples or quotes from ${city}.`,
    operations: `${company} should publish monthly capacity and lead times. Buyers will not compare the offer seriously without production-slot confidence.`,
    compliance: `${company} should add NTN/registration and export documents such as Form-E, Certificate of Origin, and category-specific certifications.`,
  };
  return `${company} is a ${city}-based ${category} manufacturer targeting ${targetMarket} buyers. Weakest area: ${weakest}. ${advice[weakest] ?? advice.compliance}`;
}

function extractOpenAIText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const record = payload as Record<string, unknown>;
  if (typeof record.output_text === "string") return record.output_text;
  const output = Array.isArray(record.output) ? record.output : [];
  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const content = (item as Record<string, unknown>).content;
      return Array.isArray(content) ? content : [];
    })
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const value = (item as Record<string, unknown>).text;
      return typeof value === "string" ? value : "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

export async function generateAuditFeedback(data: AuditInput, breakdown: AuditBreakdown) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_AUDIT_MODEL;
  if (!apiKey || !model) return { feedback: fallbackFeedback(data, breakdown), aiUsed: false };

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: "You write concise, specific export-readiness feedback for Pakistani SME manufacturers. Mention the supplied city, product category, and target market when present. Do not invent certifications or buyer names.",
          },
          {
            role: "user",
            content: JSON.stringify({ auditInput: data, breakdown }),
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI audit failed with ${response.status}`);
    const payload = (await response.json()) as unknown;
    const feedback = extractOpenAIText(payload);
    return { feedback: feedback || fallbackFeedback(data, breakdown), aiUsed: Boolean(feedback) };
  } catch {
    return { feedback: fallbackFeedback(data, breakdown), aiUsed: false };
  }
}

export async function runAudit(data: AuditInput): Promise<AuditResult> {
  const { score, breakdown } = calculateAuditScore(data);
  const { feedback, aiUsed } = await generateAuditFeedback(data, breakdown);
  return {
    score,
    breakdown,
    status: statusFromScore(score),
    tier: tierFromScore(score),
    feedback,
    aiUsed,
  };
}
