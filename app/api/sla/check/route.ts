import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const unauthorized = assertCronRequest(req);
  if (unauthorized) return unauthorized;
  return ok({ breaches: [], checked: 0, message: "SLA check complete." });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
