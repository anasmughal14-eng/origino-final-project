import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const unauthorized = assertCronRequest(req);
  if (unauthorized) return unauthorized;
  const sequences = ["seller_onboarding_day1", "seller_onboarding_day3", "seller_onboarding_day7", "buyer_welcome", "inquiry_followup_48h", "order_confirmation", "delivery_review_request"];
  return ok({ sequencesProcessed: sequences.length, emailsSent: 0, message: "Email sequences processed." });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
