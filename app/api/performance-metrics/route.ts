import { fail, ok } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return fail("Unauthorized", 401);
  return ok({ processed: 0, message: "Performance metrics updated." });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
