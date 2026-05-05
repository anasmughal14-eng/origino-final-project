import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { supplierId, buyerId, requestedDate, platform } = await readJson(req);
    if (!supplierId || !buyerId || !requestedDate) return fail("Missing required fields", 400);
    const meetingId = `VT-${Date.now()}`;
    return ok({ tourId: meetingId, supplierId, buyerId, platform: platform || "zoom", scheduledDate: requestedDate, meetingUrl: `https://zoom.us/j/${Math.floor(Math.random()*1000000000)}`, message: "Virtual factory tour scheduled. Both parties have been notified." }, 201);
  } catch {
    return fail("Scheduling failed", 500);
  }
}
