import { fail, ok } from "@/lib/api-response";
import { getAdminMetrics } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getAdminMetrics());
  } catch {
    return fail("Unable to load admin metrics", 500);
  }
}
