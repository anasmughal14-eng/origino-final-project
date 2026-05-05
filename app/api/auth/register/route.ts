import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";
import type { Database, Profile } from "@/types/database";
import { fail, readJson, requireFields } from "@/lib/api-response";

type RegisterPayload = {
  role?: "buyer" | "seller";
  name?: string;
  email?: string;
  password?: string;
  company?: string;
  city?: string;
  category?: string;
  redirect?: string;
  packageInterest?: string;
};

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

function fallbackRedirect(role: RegisterPayload["role"]) {
  return role === "seller" ? "/seller/onboarding" : "/buyer/dashboard";
}

function safeRedirect(redirect: unknown, role: RegisterPayload["role"], packageInterest = "") {
  const fallback = fallbackRedirect(role);
  if (typeof redirect !== "string" || !redirect.startsWith("/") || redirect.startsWith("//")) return fallback;
  if (role === "seller" && packageInterest && redirect.startsWith("/checkout/marketing")) return redirect;
  if (role === "seller") return "/seller/onboarding";
  if (role === "buyer" && redirect.startsWith("/buyer")) return redirect;
  return fallback;
}

export async function POST(request: Request) {
  const payload = await readJson<RegisterPayload>(request);
  const missing = requireFields(payload, ["role", "name", "email", "password", "company"]);
  if (missing) return fail(`${missing} is required`, 400);
  if (payload.role !== "buyer" && payload.role !== "seller") return fail("role must be buyer or seller", 400);
  if (!String(payload.email).includes("@")) return fail("Enter a valid email address.", 400);
  if (String(payload.password).length < 8) return fail("Password must be at least 8 characters.", 400);
  if (payload.role === "seller" && (!payload.city || !payload.category)) return fail("city and category are required for sellers", 400);

  const publicKey = getPublicSupabaseKey();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !publicKey || !serviceKey) return fail("Supabase environment is not configured.", 500);

  const email = String(payload.email).trim().toLowerCase();
  const fullName = String(payload.name).trim();
  const role = payload.role;
  const packageInterest = typeof payload.packageInterest === "string" ? payload.packageInterest.replace(/[^a-z0-9_-]/gi, "").toLowerCase() : "";

  const admin = createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password: String(payload.password),
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
        company: String(payload.company).trim(),
        package_interest: role === "seller" ? packageInterest || null : null,
      },
    });
    if (createError || !createdUser.user) return fail(createError?.message ?? "Registration failed.", 400);

    const { error: profileError } = await admin.from("profiles").upsert({
      id: createdUser.user.id,
      email,
      full_name: fullName,
      role: role as Profile["role"],
      phone: null,
      country: role === "buyer" ? "Pakistan" : null,
      avatar_url: null,
      whatsapp: null,
      preferred_language: "en",
      two_fa_enabled: false,
    });
    if (profileError) return fail(profileError.message, 500);

    if (role === "buyer") {
      await admin.from("buyer_companies").insert({
        buyer_id: createdUser.user.id,
        company_name: String(payload.company).trim(),
        country: "Pakistan",
        industry: "General trade",
        annual_import_usd: null,
        vat_number: null,
        duns_number: null,
        verified: false,
      });
    }

    if (role === "seller") {
      await admin.from("applications").insert({
        profile_id: createdUser.user.id,
        full_name: fullName,
        email,
        phone: null,
        company_name: String(payload.company).trim(),
        city: String(payload.city),
        province: null,
        product_category: String(payload.category),
        years_in_business: null,
        product_description: null,
        certifications: null,
        has_exported: false,
        export_countries: null,
        has_logo: false,
        has_website: false,
        has_social: false,
        has_photography: false,
        has_packaging: false,
        target_markets: null,
        production_capacity: null,
        hs_code: null,
        status: "pending",
        audit_score: null,
        audit_breakdown: null,
        audit_ai_feedback: null,
        reviewer_id: null,
        reviewer_notes: null,
        admin_notes: packageInterest ? `Package interest noted before audit: ${packageInterest}. Purchase remains locked until audit decision.` : null,
        marketing_package_purchased: null,
        sanctions_check_passed: false,
        sanctions_checked_at: null,
        reviewed_at: null,
      });
    }

    const cookieStore = cookies();
    const cookiesToSet: CookieToSet[] = [];
    const supabase = createServerClient<Database>(supabaseUrl, publicKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(items) {
          cookiesToSet.push(...items);
        },
      },
    });
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: String(payload.password),
    });
    if (signInError || !sessionData.user) return fail(signInError?.message ?? "Account created but sign-in failed.", 500);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          role,
          redirect: safeRedirect(payload.redirect, role, packageInterest),
        },
      },
      { status: 201 }
    );
    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Registration failed.", 500);
  }
}
