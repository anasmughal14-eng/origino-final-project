import { fail, ok, readJson } from "@/lib/api-response";

export async function GET() {
  return ok({ savedSearches: [], total: 0 });
}

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    if (!data.name) return fail("name is required", 400);
    return ok({ savedSearchId: `saved-${Date.now()}`, alertsEnabled: true, ...data }, 201);
  } catch {
    return fail("Unable to save search", 500);
  }
}
