import { fail, ok, readJson } from "@/lib/api-response";
import { assertIntegrationEnabled } from "@/lib/integration-status";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const unavailable = assertIntegrationEnabled("EasyPaisa", "ENABLE_LOCAL_PAYMENTS", [
      "EASYPAISA_STORE_ID",
      "EASYPAISA_HASH_KEY",
    ]);
    if (unavailable) return unavailable;

    const { orderId, amountPkr, mobileNumber } = await readJson(req);
    if (!orderId || !amountPkr || !mobileNumber) return fail("Missing required fields", 400);
    const ordRef = `EP${Date.now()}`;
    return ok({ ordRef, orderId, amountPkr, paymentUrl: `https://easypay.easypaisa.com.pk/easypay/?orderId=${ordRef}`, message: "EasyPaisa payment initiated." }, 201);
  } catch {
    return fail("EasyPaisa payment initiation failed", 500);
  }
}
