import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return fail("Unauthorized", 401);
  return ok({ notifications: [], unread: 0 });
}

export async function PATCH(req: NextRequest) {
  try {
    const { notificationId } = await readJson(req);
    if (!notificationId) return fail("notificationId required", 400);
    return ok({ notificationId, read: true });
  } catch {
    return fail("Notification update failed", 500);
  }
}
