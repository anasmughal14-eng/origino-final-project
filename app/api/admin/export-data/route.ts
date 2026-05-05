import { ok } from "@/lib/api-response";

export async function POST() {
  return ok({ exportId: `export-${Date.now()}`, status: "queued", downloadUrl: null }, 202);
}
