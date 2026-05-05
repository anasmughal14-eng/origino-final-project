import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { supplierId, orderId, buyerId, rating, body, qualityScore, communicationScore, deliveryScore } = await readJson(req);
    if (!supplierId || !orderId || !rating) return fail("Missing required fields", 400);
    if (Number(rating) < 1 || Number(rating) > 5) return fail("Rating must be 1-5", 400);
    return ok({ reviewId: `REV-${Date.now()}`, supplierId, orderId, buyerId, rating, body, qualityScore, communicationScore, deliveryScore, message: "Review submitted. Thank you for your feedback." }, 201);
  } catch {
    return fail("Review submission failed", 500);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const supplierId = searchParams.get("supplierId");
  if (!supplierId) return fail("supplierId required", 400);
  return ok({ reviews: [], total: 0, averageRating: 0 });
}
