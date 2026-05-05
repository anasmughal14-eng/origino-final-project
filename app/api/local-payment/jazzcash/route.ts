import { fail, ok, readJson } from "@/lib/api-response";
import { assertIntegrationEnabled } from "@/lib/integration-status";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const unavailable = assertIntegrationEnabled("JazzCash", "ENABLE_LOCAL_PAYMENTS", [
      "JAZZCASH_MERCHANT_ID",
      "JAZZCASH_PASSWORD",
      "JAZZCASH_INTEGRITY_SALT",
    ]);
    if (unavailable) return unavailable;

    const { orderId, amountPkr, mobileNumber, cnic } = await readJson(req);
    if (!orderId || !amountPkr || !mobileNumber) return fail("Missing required fields", 400);
    const txnRefNo = `T${Date.now()}`;
    const txnDateTime = new Date().toISOString().replace(/[-:T.Z]/g,"").slice(0,14);
    const password = process.env.JAZZCASH_PASSWORD!;
    const salt = process.env.JAZZCASH_INTEGRITY_SALT!;
    const merchantId = process.env.JAZZCASH_MERCHANT_ID!;
    const hashString = `${password}&${amountPkr}&${cnic||""}&${merchantId}&${mobileNumber}&${txnRefNo}&${salt}`;
    const secureHash = crypto.createHash("sha256").update(hashString).digest("hex").toUpperCase();
    return ok({ txnRefNo, txnDateTime, orderId, amountPkr, secureHash, paymentUrl: `https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/?pp_TxnRefNo=${txnRefNo}`, message: "JazzCash payment initiated." }, 201);
  } catch {
    return fail("JazzCash payment initiation failed", 500);
  }
}
