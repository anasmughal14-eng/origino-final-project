import { fail, ok, readJson } from "@/lib/api-response";
import { getSuppliers, USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

const verificationTiers = new Set([
  "unverified",
  "self_declared",
  "document_verified",
  "site_visited",
  "origino_certified",
]);

export async function GET() {
  try {
    return ok(await getSuppliers());
  } catch {
    return fail("Unable to load admin suppliers", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return fail("supplier id is required", 400);

    const update: Database["public"]["Tables"]["suppliers"]["Update"] = {};
    if (typeof body.verification_tier === "string") {
      if (!verificationTiers.has(body.verification_tier)) return fail("invalid verification_tier", 400);
      update.verification_tier = body.verification_tier as Database["public"]["Tables"]["suppliers"]["Row"]["verification_tier"];
    }
    if (typeof body.is_active === "boolean") update.is_active = body.is_active;
    if (!Object.keys(update).length && !body.admin_note) return fail("update payload is required", 400);

    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("suppliers")
        .update(update)
        .eq("id", id)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok(data);
    }

    return ok({ id, ...update, admin_note: body.admin_note, updatedAt: new Date().toISOString() });
  } catch {
    return fail("Unable to update supplier", 500);
  }
}
