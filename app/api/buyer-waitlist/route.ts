import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const category = typeof body.category === "string" ? body.category : "All categories";
    const city = typeof body.city === "string" ? body.city : "All cities";

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Enter a valid business email." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const { error } = await (supabase as any).from("buyer_waitlist").insert({
      email,
      category,
      city,
      source: "marketplace_zero_state",
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message || "Supabase insert failed." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Supabase insert failed." }, { status: 500 });
  }
}
