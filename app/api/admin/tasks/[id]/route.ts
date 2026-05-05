import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) return fail("task id is required", 400);

    const body = await readJson<Record<string, unknown>>(request);
    if (!Object.keys(body).length) return fail("update payload is required", 400);

    if (!USE_MOCK_DATA) {
      const allowed: Database["public"]["Tables"]["admin_tasks"]["Update"] = {};
      if (typeof body.status === "string") allowed.status = body.status as Database["public"]["Tables"]["admin_tasks"]["Row"]["status"];
      if (body.assigned_to === null || typeof body.assigned_to === "string") allowed.assigned_to = body.assigned_to;
      if (body.notes === null || typeof body.notes === "string") allowed.notes = body.notes;
      if (typeof body.priority === "string") allowed.priority = body.priority as Database["public"]["Tables"]["admin_tasks"]["Row"]["priority"];
      if (typeof body.due_at === "string") allowed.due_at = body.due_at;
      if (!Object.keys(allowed).length) return fail("No supported task fields provided", 400);
      const { data, error } = await createSupabaseServiceClient()
        .from("admin_tasks")
        .update(allowed)
        .eq("id", params.id)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok(data);
    }

    return ok({
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return fail("Unable to update task", 500);
  }
}
