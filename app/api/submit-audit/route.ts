import { created, fail, readJson } from "@/lib/api-response";
import { runAudit } from "@/lib/audit-engine";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type InsertResult = {
  data: { id: string } | null;
  error: { message: string } | null;
};

function textValue(data: Record<string, unknown>, keys: string[], fallback: string | null = null) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function numberValue(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }
  return null;
}

function validEmail(value: string | null) {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

function mappedStatus(status: "approved" | "conditional" | "not_ready") {
  if (status === "approved") return "approved";
  if (status === "conditional") return "reviewing";
  return "more_info";
}

function section(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

async function insertApplication(payload: Record<string, unknown>) {
  const supabase = createSupabaseServiceClient();
  return await (supabase
    .from("applications")
    .insert(payload as never)
    .select("id")
    .single() as unknown as Promise<InsertResult>);
}

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    const businessName = textValue(data, ["business_name", "businessName", "companyName", "company"]);
    const fullName = textValue(data, ["fullName", "name", "ownerName"], "Marketing audit lead");
    const email = textValue(data, ["email"]);
    const phone = textValue(data, ["phone"]);
    const city = textValue(data, ["city"]);
    const industry = textValue(data, ["industry", "category", "productCategory"]);
    const yearsInBusiness = numberValue(data, ["years_in_business", "yearsInBusiness", "years"]);
    const websiteUrl = textValue(data, ["website_url", "websiteUrl", "website"]);

    if (!businessName) return fail("business_name is required", 400);
    if (!validEmail(email)) return fail("valid email is required before showing the full audit", 400);
    if (!industry) return fail("industry is required", 400);
    if (yearsInBusiness !== null && yearsInBusiness < 0) return fail("years_in_business must be a positive number", 400);

    const normalizedData: Record<string, unknown> = {
      ...data,
      business_name: businessName,
      companyName: businessName,
      fullName,
      email,
      phone,
      city,
      industry,
      category: industry,
      years_in_business: yearsInBusiness ?? 0,
      website_url: websiteUrl,
    };

    const result = await runAudit(normalizedData);
    const recordId = `audit-${Date.now()}`;
    let applicationId: string | null = null;
    let savedToSupabase = false;
    let profileId = typeof data.profileId === "string" && data.profileId ? data.profileId : null;

    if (!profileId && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false") {
      try {
        const supabase = createSupabaseServerClient();
        const { data: auth } = await supabase.auth.getUser();
        profileId = auth.user?.id ?? null;
      } catch {
        profileId = null;
      }
    }

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false" && profileId) {
      const status = mappedStatus(result.status);
      const formData = {
        ...normalizedData,
        marketingAudit: {
          audit_id: result.audit_id,
          overall_score: result.overall_score,
          marketing_stage: result.marketing_stage,
          category_scores: result.category_scores,
          verdict: result.verdict,
          critical_gaps: result.critical_gaps,
          action_plan: result.action_plan,
          agency_opportunity: result.agency_opportunity,
          aiUsed: result.aiUsed,
        },
      };
      const compactPayload: Record<string, unknown> = {
        profile_id: profileId,
        company_name: businessName,
        city,
        category: industry,
        status,
        audit_score: result.overall_score,
        audit_breakdown: result.category_scores,
        step_completed: 6,
        form_data: formData,
        reviewer_id: null,
        reviewer_notes: `${result.verdict}\n\n${result.score_interpretation}`,
        reviewed_at: null,
      };
      const brandIdentity = section(normalizedData, "brand_identity");
      const socialMedia = section(normalizedData, "social_media");
      const primaryPlatform = typeof socialMedia.primary_platform === "string" ? socialMedia.primary_platform : "none";
      const richPayload: Record<string, unknown> = {
        profile_id: profileId,
        full_name: fullName,
        email,
        phone,
        company: businessName,
        city,
        province: textValue(data, ["province"]),
        product_category: industry,
        years_in_business: yearsInBusiness ?? 0,
        product_description: textValue(data, ["additional_notes", "notes"], `Marketing readiness audit for ${industry}`),
        certifications: null,
        has_exported: false,
        export_countries: null,
        has_logo: brandIdentity.professional_logo === "yes",
        has_website: Boolean(websiteUrl),
        has_social: primaryPlatform !== "none",
        has_photography: false,
        has_packaging: false,
        target_markets: null,
        production_capacity: null,
        hs_code: null,
        status,
        audit_score: result.overall_score,
        audit_breakdown: result.category_scores,
        audit_ai_feedback: `${result.verdict}\n\n${result.score_interpretation}`,
        reviewer_id: null,
        reviewer_notes: `${result.verdict}\n\n${result.score_interpretation}`,
        admin_notes: null,
        marketing_package_purchased: null,
        sanctions_check_passed: false,
        sanctions_checked_at: null,
        reviewed_at: null,
        form_data: formData,
      };
      const compactResult = await insertApplication(compactPayload);
      if (compactResult.error) {
        const richResult = await insertApplication(richPayload);
        if (richResult.error) return fail(richResult.error.message || compactResult.error.message, 500);
        applicationId = richResult.data?.id ?? null;
      } else {
        applicationId = compactResult.data?.id ?? null;
      }
      savedToSupabase = Boolean(applicationId);
    }

    return created({
      ...result,
      recordId: applicationId ?? recordId,
      applicationId,
      savedToSupabase,
      requiresAccount: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false" && !profileId,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to submit audit", 500);
  }
}
