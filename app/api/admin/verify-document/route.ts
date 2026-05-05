import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  if (!data.documentId) return fail("documentId is required", 400);
  return ok({ documentId: data.documentId, status: "verified", verifiedAt: new Date().toISOString() });
}
