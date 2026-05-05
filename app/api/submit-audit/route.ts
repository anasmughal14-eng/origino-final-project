import { created, fail, readJson } from "@/lib/api-response";
import { runAudit } from "@/lib/audit-engine";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function textValue(data: Record<string, unknown>, keys: string[], fallback: string | null = null) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function listTextValue(data: Record<string, unknown>, keys: string[], fallback: string | null = null) {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) {
      const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
      if (items.length) return items.join(", ");
    }
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

function boolValue(data: Record<string, unknown>, keys: string[]) {
  return keys.some((key) => Boolean(data[key]));
}

function numberValue(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    if (!data.companyName && !data.company) return fail("companyName is required", 400);
    if (!data.city) return fail("city is required", 400);
    if (!data.category) return fail("category is required", 400);

    const result = await runAudit(data);
    const recordId = `audit-${Date.now()}`;
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
      const supabase = createSupabaseServiceClient();
      const { error } = await supabase.from("applications").insert({
        profile_id: profileId,
        full_name: textValue(data, ["fullName", "name", "ownerName"]),
        email: textValue(data, ["email"]),
        phone: textValue(data, ["phone"]),
        company_name: String(data.companyName ?? data.company),
        city: textValue(data, ["city"]),
        province: textValue(data, ["province"]),
        product_category: textValue(data, ["category", "productCategory"]),
        years_in_business: numberValue(data, ["yearsInBusiness", "years"]),
        product_description: textValue(data, ["productDescription", "description"]),
        certifications: listTextValue(data, ["certifications"]),
        has_exported: boolValue(data, ["hasExported"]),
        export_countries: listTextValue(data, ["exportCountries"]),
        has_logo: boolValue(data, ["hasLogo"]),
        has_website: boolValue(data, ["website", "hasWebsite"]),
        has_social: boolValue(data, ["hasSocial", "instagram", "linkedin"]),
        has_photography: boolValue(data, ["hasPhotography"]),
        has_packaging: boolValue(data, ["hasPackaging"]),
        target_markets: listTextValue(data, ["targetMarkets", "targetMarket"]),
        production_capacity: textValue(data, ["capacity", "productionCapacity"]),
        hs_code: textValue(data, ["hsCode"]),
        status: result.status === "not_ready" ? "more_info" : result.status === "conditional" ? "reviewing" : "approved",
        audit_score: result.score,
        audit_breakdown: result.breakdown,
        audit_ai_feedback: result.feedback,
        reviewer_id: null,
        reviewer_notes: result.feedback,
        admin_notes: null,
        marketing_package_purchased: null,
        sanctions_check_passed: false,
        sanctions_checked_at: null,
        reviewed_at: null,
      });
      if (error) return fail(error.message, 500);
    }

    return created({
      ...result,
      recordId,
    });
  } catch {
    return fail("Unable to submit audit", 500);
  }
}
