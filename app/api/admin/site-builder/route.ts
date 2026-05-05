import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ sections?: unknown[] }>(request);
    if (!Array.isArray(body.sections)) return fail("sections array is required", 400);
    return ok({ saved: true, count: body.sections.length });
  } catch {
    return fail("Unable to save site sections", 500);
  }
}
