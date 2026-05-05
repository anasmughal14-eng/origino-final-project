import { ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  return ok({ maintenanceMode: Boolean(data.enabled), updatedAt: new Date().toISOString() });
}
