import { fail, ok } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { listRuntimeEscrows } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("escrow_transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return fail(error.message, 500);
      return ok({ transactions: data ?? [], total: data?.length ?? 0 });
    }
    const transactions = listRuntimeEscrows();
    return ok({ transactions, total: transactions.length });
  } catch {
    return fail("Unable to load escrow transactions", 500);
  }
}
