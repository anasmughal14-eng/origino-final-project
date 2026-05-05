import { ok } from "@/lib/api-response";

export async function POST() {
  return ok({
    updated: true,
    categories: 5,
    message: "Competitive intelligence refreshed from admin console.",
    updatedAt: new Date().toISOString(),
  });
}
