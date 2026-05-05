import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  if (!data.subject || !data.message) return fail("subject and message are required", 400);
  return ok({ queued: true, recipients: data.audience ?? "all", sentAt: null });
}
