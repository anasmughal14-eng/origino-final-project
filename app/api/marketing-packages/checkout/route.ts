import { fail, ok, readJson } from "@/lib/api-response";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseServiceClient } from "@/lib/supabase";

const packages = {
  basic: { priceUsd: 299, deliveryDays: 21 },
  growth: { priceUsd: 799, deliveryDays: 42 },
  premium: { priceUsd: 1999, deliveryDays: 70 },
} as const;

const paymentMethods = new Set(["stripe", "bank_transfer", "jazzcash", "easypaisa"]);

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const packageKey = typeof body.packageKey === "string" ? body.packageKey : "";
    const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod : "";
    if (!(packageKey in packages)) return fail("valid packageKey is required", 400);
    if (!paymentMethods.has(paymentMethod)) return fail("valid paymentMethod is required", 400);

    const supabase = createSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return fail("Please sign in before checkout.", 401);

    const adminSupabase = createSupabaseServiceClient();
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id, role, email, full_name")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (profileError) return fail(profileError.message, 500);
    if (profile?.role !== "seller") return fail("Marketing packages are available for seller accounts only.", 403);

    const reference = `ORIGINO-${packageKey.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const selectedPackage = packages[packageKey as keyof typeof packages];
    const { data: application } = await supabase
      .from("applications")
      .select("id, admin_notes")
      .eq("profile_id", auth.user.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (application?.id) {
      const existingNotes = application.admin_notes ? `${application.admin_notes}\n` : "";
      const { error: applicationUpdateError } = await adminSupabase
        .from("applications")
        .update({
          marketing_package_purchased: packageKey as "basic" | "growth" | "premium",
          admin_notes: `${existingNotes}Checkout reserved: ${packageKey} via ${paymentMethod}. Reference ${reference}. Listing remains audit-gated.`,
        })
        .eq("id", application.id);
      if (applicationUpdateError) return fail(applicationUpdateError.message, 500);
    }

    const { data: supplier, error: supplierError } = await adminSupabase
      .from("suppliers")
      .select("id")
      .eq("profile_id", auth.user.id)
      .maybeSingle();
    if (supplierError) return fail(supplierError.message, 500);

    if (supplier?.id) {
      const paidAt = paymentMethod === "bank_transfer" ? null : null;
      const slaDueAt = new Date(Date.now() + selectedPackage.deliveryDays * 24 * 60 * 60 * 1000).toISOString();
      const { data: marketingOrder, error: marketingOrderError } = await adminSupabase
        .from("marketing_service_orders")
        .insert({
        supplier_id: supplier.id,
        tier: packageKey as "basic" | "growth" | "premium",
        price_usd: selectedPackage.priceUsd,
        status: "pending",
        payment_method: paymentMethod as "stripe" | "jazzcash" | "easypaisa" | "bank_transfer",
        local_payment_reference: reference,
        paid_at: paidAt,
        sla_due_at: slaDueAt,
        sla_status: "on_track",
        assigned_to: null,
        delay_notes:
          paymentMethod === "bank_transfer"
            ? "Awaiting manual bank transfer confirmation."
            : "Provider route reserved; activate live checkout after merchant approval.",
        starts_at: null,
        expires_at: null,
        })
        .select("id")
        .single();
      if (marketingOrderError) return fail(marketingOrderError.message, 500);

      const { error: taskError } = await adminSupabase.from("admin_tasks").insert({
        title: `Confirm ${packageKey} marketing package payment`,
        type: "manual_follow_up",
        priority: paymentMethod === "bank_transfer" ? "high" : "medium",
        status: "open",
        assigned_to: null,
        linked_entity_type: "marketing_order",
        linked_entity_id: marketingOrder.id,
        linked_href: "/admin/marketing-orders",
        due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: `Seller reserved ${packageKey} package via ${paymentMethod}. Reference ${reference}.`,
      });
      if (taskError) return fail(taskError.message, 500);
    }

    if (paymentMethod === "stripe") {
      return ok({
        orderId: reference,
        method: paymentMethod,
        status: "provider_pending",
        reference,
        message: "Stripe checkout is ready in the flow, but live provider keys are parked until approval is complete.",
      });
    }

    if (paymentMethod === "jazzcash" || paymentMethod === "easypaisa") {
      return ok({
        orderId: reference,
        method: paymentMethod,
        status: "provider_pending",
        reference,
        message: `${paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} checkout is reserved. Live wallet submission will activate after merchant approval.`,
      });
    }

    return ok({
      orderId: reference,
      method: paymentMethod,
      status: "pending_manual_confirmation",
      reference,
      message: "Bank transfer reference created. ORIGINO admin can confirm payment and start the marketing order.",
    }, 201);
  } catch {
    return fail("Unable to prepare marketing checkout", 500);
  }
}
