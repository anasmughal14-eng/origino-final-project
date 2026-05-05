import { fail, ok } from "@/lib/api-response";
import { USE_MOCK_DATA, getApplicationById } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";

function hasSanctionsClearance(application: unknown) {
  if (!application || typeof application !== "object") return false;
  if ("sanctions_check_passed" in application) {
    return Boolean((application as { sanctions_check_passed?: boolean }).sanctions_check_passed);
  }
  if ("form_data" in application) {
    const formData = (application as { form_data?: unknown }).form_data;
    if (formData && typeof formData === "object" && "sanctions_check_passed" in formData) {
      return Boolean((formData as { sanctions_check_passed?: boolean }).sanctions_check_passed);
    }
  }
  return true;
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) return fail("application id is required", 400);
    const application = await getApplicationById(params.id);
    if (!application) return fail("application not found", 404);
    if (!hasSanctionsClearance(application)) return fail("sanctions clearance is required before approval", 403);
    const reviewedAt = new Date().toISOString();
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("applications")
        .update({ status: "approved", reviewed_at: reviewedAt, reviewer_notes: "Approved by admin review." })
        .eq("id", params.id)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({ applicationId: params.id, status: "approved", stamped: true, reviewedAt, application: data });
    }
    return ok({ applicationId: params.id, status: "approved", stamped: true, reviewedAt });
  } catch {
    return fail("Unable to approve application", 500);
  }
}
