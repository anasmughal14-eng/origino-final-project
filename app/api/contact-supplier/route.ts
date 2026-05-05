import { created, fail, ok, readJson, requireFields } from "@/lib/api-response";
import { addRuntimeInquiry, listRuntimeInquiries } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { USE_MOCK_DATA } from "@/lib/data-service";
import type { Inquiry } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

type InquiryReply = { id: string; author: "buyer" | "seller"; body: string; created_at: string };
type InquiryStatus = "unread" | "read" | "replied" | "quoted";

export async function GET() {
  try {
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return fail(error.message, 500);
      return ok(data);
    }
    return ok(listRuntimeInquiries());
  } catch {
    return fail("Unable to load inquiries", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["supplierId", "name", "company", "email", "message"]);
    if (missing) return fail(`${missing} is required`, 400);
    if (body.quantity !== undefined && Number.isNaN(Number(body.quantity))) return fail("quantity must be a number", 400);
    const quantity = Number(body.quantity ?? 0);
    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      let buyerId = body.buyerId ? String(body.buyerId) : "";
      if (!buyerId) {
        const { data: buyer, error: buyerError } = await db.from("profiles").select("id").eq("role", "buyer").limit(1).maybeSingle();
        if (buyerError) return fail(buyerError.message, 500);
        buyerId = buyer?.id ?? "";
      }
      if (!buyerId) return fail("buyerId is required", 400);

      let productId = body.productId ? String(body.productId) : "";
      if (productId) {
        const { data: product } = await db.from("products").select("id").eq("id", productId).maybeSingle();
        productId = product?.id ?? "";
      }
      if (!productId) {
        const { data: product, error: productError } = await db
          .from("products")
          .select("id")
          .eq("supplier_id", String(body.supplierId))
          .limit(1)
          .maybeSingle();
        if (productError) return fail(productError.message, 500);
        productId = product?.id ?? "";
      }
      if (!productId) return fail("productId is required", 400);

      const { data, error } = await db
        .from("inquiries")
        .insert({
          supplier_id: String(body.supplierId),
          buyer_id: buyerId,
          buyer_name: String(body.name),
          buyer_company: String(body.company),
          subject: String(body.subject ?? "Buyer inquiry"),
          message: String(body.message),
          quantity,
          product_id: productId,
          status: "unread",
          intent_score: quantity > 500 ? 88 : 72,
          replies: [],
        })
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return created({ inquiryId: data.id, inquiry: data, status: "sent", intentScore: data.intent_score });
    }
    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      supplier_id: String(body.supplierId),
      buyer_id: String(body.buyerId ?? "buyer-1"),
      buyer_name: String(body.name),
      buyer_company: String(body.company),
      subject: String(body.subject ?? "Buyer inquiry"),
      message: String(body.message),
      quantity,
      product_id: String(body.productId ?? "prod-1"),
      status: "unread",
      intent_score: quantity > 500 ? 88 : 72,
      created_at: new Date().toISOString(),
      replies: [],
    };
    addRuntimeInquiry(inquiry);
    return created({ inquiryId: inquiry.id, inquiry, status: "sent", intentScore: inquiry.intent_score });
  } catch {
    return fail("Unable to contact supplier", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (!body.inquiryId) return fail("inquiryId is required", 400);
    const inquiryId = String(body.inquiryId);
    const replyBody = typeof body.replyBody === "string" ? body.replyBody.trim() : "";
    const replyAuthor = body.replyAuthor === "buyer" ? "buyer" : "seller";
    const requestedStatus = typeof body.status === "string" ? body.status : "";
    if (requestedStatus && !["unread", "read", "replied", "quoted"].includes(requestedStatus)) {
      return fail("Invalid inquiry status", 400);
    }
    if (body.replyBody !== undefined && !replyBody) return fail("replyBody is required", 400);

    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      const { data: existing, error: loadError } = await db
        .from("inquiries")
        .select("*")
        .eq("id", inquiryId)
        .maybeSingle();
      if (loadError) return fail(loadError.message, 500);
      if (!existing) return fail("Inquiry not found", 404);

      const replies: InquiryReply[] = replyBody
        ? [
          ...existing.replies as InquiryReply[],
          {
            id: `rep-${Date.now()}`,
            author: replyAuthor,
            body: replyBody,
            created_at: new Date().toISOString(),
          },
        ]
        : existing.replies;
      const status: InquiryStatus = replyBody ? "replied" : (requestedStatus || existing.status) as InquiryStatus;

      const { data, error } = await db
        .from("inquiries")
        .update({ replies, status })
        .eq("id", inquiryId)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({ inquiry: data, status: data.status });
    }

    const inquiry = listRuntimeInquiries().find((item) => item.id === inquiryId);
    if (!inquiry) return ok({ inquiryId, status: requestedStatus || (replyBody ? "replied" : "read") });
    const nextInquiry: Inquiry = {
      ...inquiry,
      status: (replyBody ? "replied" : requestedStatus || inquiry.status) as Inquiry["status"],
      replies: replyBody
        ? [...inquiry.replies, { id: `rep-${Date.now()}`, author: replyAuthor, body: replyBody, created_at: new Date().toISOString() }]
        : inquiry.replies,
    };
    addRuntimeInquiry(nextInquiry);
    return ok({ inquiry: nextInquiry, status: nextInquiry.status });
  } catch {
    return fail("Unable to update inquiry", 500);
  }
}
