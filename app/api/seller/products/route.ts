import { fail, ok, readJson, requireFields } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Database, Product } from "@/types/database";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isUuid(value: unknown) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function fallbackSupplierId() {
  const { data, error } = await createSupabaseServiceClient()
    .from("suppliers")
    .select("id")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.id ?? "";
}

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["name", "category"]);
    if (missing) return fail(`${missing} is required`, 400);

    const minPrice = Number(body.minPrice ?? body.price_usd_min ?? 0);
    const maxPrice = Number(body.maxPrice ?? body.price_usd_max ?? 0);
    const moq = Number(body.moq ?? 1);
    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) return fail("prices must be numeric", 400);
    if (Number.isNaN(moq) || moq < 1) return fail("moq must be a positive number", 400);

    if (USE_MOCK_DATA) {
      const product: Partial<Product> = {
        id: `prod-local-${Date.now()}`,
        supplier_id: String(body.supplierId ?? "sup-1"),
        name: String(body.name),
        slug: slugify(String(body.name)),
        category: String(body.category),
        price_usd_min: minPrice,
        price_usd_max: maxPrice,
        moq,
        is_active: body.active === undefined ? true : Boolean(body.active),
      };
      return ok({ product, status: "saved" }, 201);
    }

    const requestedSupplierId = String(body.supplierId ?? "");
    const supplierId = isUuid(requestedSupplierId) ? requestedSupplierId : await fallbackSupplierId();
    if (!supplierId) return fail("supplierId is required", 400);

    const { data, error } = await createSupabaseServiceClient()
      .from("products")
      .insert({
        supplier_id: supplierId,
        name: String(body.name),
        name_ur: null,
        slug: `${slugify(String(body.name))}-${Date.now()}`,
        description: String(body.description ?? ""),
        description_ur: null,
        category: String(body.category),
        hs_code: null,
        origin_story: null,
        images: [],
        price_usd_min: minPrice,
        price_usd_max: maxPrice,
        moq,
        moq_unit: String(body.moqUnit ?? "pieces"),
        lead_time_days: String(body.leadTimeDays ?? "21-35 days"),
        sample_available: Boolean(body.sampleAvailable ?? true),
        sample_price_usd: null,
        certifications: [],
        specifications: {},
        is_active: body.active === undefined ? true : Boolean(body.active),
      })
      .select("*")
      .single();
    if (error) return fail(error.message, 500);
    return ok({ product: data, status: "saved" }, 201);
  } catch {
    return fail("Unable to save product", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (!body.productId) return fail("productId is required", 400);

    const update: Database["public"]["Tables"]["products"]["Update"] = {};
    if (body.name !== undefined) update.name = String(body.name);
    if (body.category !== undefined) update.category = String(body.category);
    if (body.minPrice !== undefined || body.price_usd_min !== undefined) {
      const value = Number(body.minPrice ?? body.price_usd_min);
      if (Number.isNaN(value)) return fail("minimum price must be numeric", 400);
      update.price_usd_min = value;
    }
    if (body.maxPrice !== undefined || body.price_usd_max !== undefined) {
      const value = Number(body.maxPrice ?? body.price_usd_max);
      if (Number.isNaN(value)) return fail("maximum price must be numeric", 400);
      update.price_usd_max = value;
    }
    if (body.moq !== undefined) {
      const value = Number(body.moq);
      if (Number.isNaN(value) || value < 1) return fail("moq must be a positive number", 400);
      update.moq = value;
    }
    if (body.active !== undefined) update.is_active = Boolean(body.active);

    if (USE_MOCK_DATA) return ok({ productId: String(body.productId), updates: update, status: "saved" });

    const { data, error } = await createSupabaseServiceClient()
      .from("products")
      .update(update)
      .eq("id", String(body.productId))
      .select("*")
      .single();
    if (error) return fail(error.message, 500);
    return ok({ product: data, status: "saved" });
  } catch {
    return fail("Unable to update product", 500);
  }
}
