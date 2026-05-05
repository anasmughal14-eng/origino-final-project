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
  return Boolean(value);
}

export function calculateAuditScore(data: AuditInput) {
  const breakdown: AuditBreakdown = {
    brand: truthy(data.hasLogo) ? 23 : 10,
    digital: truthy(data.website) || truthy(data.hasWebsite) ? 22 : 8,
    export: truthy(data.hasExported) ? 18 : 7,
    product: truthy(data.hsCode) || truthy(data.certifications) ? 14 : 8,
    operations: truthy(data.capacity) || truthy(data.productionCapacity) ? 9 : 4,
    compliance: truthy(data.ntn) || truthy(data.fbrNtn) ? 5 : 1,
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
  const company = text(data.companyName ?? data.company, "this supplier");
  const weakest = Object.entries(breakdown).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "documentation";
  return `${company} is a ${city}-based ${category} manufacturer. The strongest next move is improving ${weakest} evidence before high-value buyer outreach: add buyer-facing documentation, export proof, certifications, and product photography tied to the target market.`;
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
