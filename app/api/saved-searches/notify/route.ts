import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const unauthorized = assertCronRequest(req);
  if (unauthorized) return unauthorized;
  return ok({ alertsSent: 0, message: "Saved search alerts processed." });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
