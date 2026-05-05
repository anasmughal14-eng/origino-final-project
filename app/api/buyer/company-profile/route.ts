import { fail, ok, readJson, requireFields } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["company", "country", "industry"]);
    if (missing) return fail(`${missing} is required`, 400);

    const website = typeof body.website === "string" ? body.website : "";
    if (website && !/^https?:\/\/.+\..+/.test(website)) {
      return fail("website must start with http:// or https://", 400);
    }

    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      let buyerId = typeof body.buyerId === "string" ? body.buyerId : "";
      if (!buyerId) {
        const { data: buyer, error: buyerError } = await db
          .from("profiles")
          .select("id")
          .eq("role", "buyer")
          .limit(1)
          .maybeSingle();
        if (buyerError) return fail(buyerError.message, 500);
        buyerId = buyer?.id ?? "";
      }
      if (!buyerId) return fail("buyerId is required", 400);

      const record = {
        buyer_id: buyerId,
        company_name: String(body.company),
        country: String(body.country),
        industry: String(body.industry),
        annual_import_usd: typeof body.annualImport === "string" ? body.annualImport : null,
        vat_number: typeof body.vat === "string" ? body.vat : null,
        duns_number: typeof body.duns === "string" ? body.duns : null,
        verified: Boolean(body.verified ?? false),
      };

      const { data: existing, error: existingError } = await db
        .from("buyer_companies")
        .select("id")
        .eq("buyer_id", buyerId)
        .limit(1)
        .maybeSingle();
      if (existingError) return fail(existingError.message, 500);

      const query = existing
        ? db.from("buyer_companies").update(record).eq("id", existing.id)
        : db.from("buyer_companies").insert(record);
      const { data, error } = await query.select("*").single();
      if (error) return fail(error.message, 500);
      return ok({ profileId: data.id, status: data.verified ? "verified" : "pending", profile: data, savedAt: new Date().toISOString() });
    }

    return ok({
      profileId: "buyer-company-mock",
      status: "verified",
      savedAt: new Date().toISOString(),
      ...body,
    });
  } catch {
    return fail("Unable to save buyer company profile", 500);
  }
}
