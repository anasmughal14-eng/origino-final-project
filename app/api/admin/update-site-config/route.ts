import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  if (!data.key) return fail("key is required", 400);
  return ok({ saved: true, key: data.key, updatedAt: new Date().toISOString() });
}
