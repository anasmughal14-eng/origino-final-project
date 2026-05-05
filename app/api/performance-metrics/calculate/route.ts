import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const unauthorized = assertCronRequest(req);
  if (unauthorized) return unauthorized;
  return ok({ processed: 0, message: "Performance metrics calculated." });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
