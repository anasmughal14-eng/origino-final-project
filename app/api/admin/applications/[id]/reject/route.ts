import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA, getApplicationById } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await readJson<{ reason?: string }>(request);
    if (!params.id) return fail("application id is required", 400);
    const application = await getApplicationById(params.id);
    if (!application) return fail("application not found", 404);
    if (!body.reason?.trim()) return fail("rejection reason is required", 400);
    const reviewedAt = new Date().toISOString();
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("applications")
        .update({ status: "rejected", reviewer_notes: body.reason.trim(), reviewed_at: reviewedAt })
        .eq("id", params.id)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({ applicationId: params.id, status: "rejected", reason: body.reason, reviewedAt, application: data });
    }
    return ok({ applicationId: params.id, status: "rejected", reason: body.reason, reviewedAt });
  } catch {
    return fail("Unable to reject application", 500);
  }
}
