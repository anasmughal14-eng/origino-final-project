import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  if (!data.applicationId && !data.supplierId) return fail("applicationId or supplierId is required", 400);
  if (!data.reason) return fail("reason is required", 400);
  return ok({ status: "rejected", ...data });
}
