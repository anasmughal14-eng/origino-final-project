import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

const statuses = new Set(["pending", "paid", "in_progress", "delivered", "active", "expired", "cancelled", "breached"]);
const slaStatuses = new Set(["on_track", "at_risk", "breached", "delivered"]);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) return fail("marketing order id is required", 400);
    const body = await readJson<Record<string, unknown>>(request);
    if (Object.keys(body).length === 0) return fail("update payload is required", 400);

    const update: Database["public"]["Tables"]["marketing_service_orders"]["Update"] = {};
    if (typeof body.status === "string") {
      if (!statuses.has(body.status)) return fail("invalid status", 400);
      update.status = body.status as Database["public"]["Tables"]["marketing_service_orders"]["Row"]["status"];
    }
    if (typeof body.sla_status === "string") {
      if (!slaStatuses.has(body.sla_status)) return fail("invalid sla_status", 400);
      update.sla_status = body.sla_status as Database["public"]["Tables"]["marketing_service_orders"]["Row"]["sla_status"];
    }
    if (body.assigned_to === null || typeof body.assigned_to === "string") update.assigned_to = body.assigned_to;
    if (body.delay_notes === null || typeof body.delay_notes === "string") update.delay_notes = body.delay_notes;
    if (typeof body.sla_due_at === "string") update.sla_due_at = body.sla_due_at;
    if (!Object.keys(update).length) return fail("No supported marketing order fields provided", 400);

    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("marketing_service_orders")
        .update(update)
        .eq("id", params.id)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok(data);
    }

    return ok({ id: params.id, ...update, updatedAt: new Date().toISOString() });
  } catch {
    return fail("Unable to update marketing order", 500);
  }
}
