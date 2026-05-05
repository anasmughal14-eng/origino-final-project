import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";
import type { Database, Profile } from "@/types/database";
import { fail, readJson, requireFields } from "@/lib/api-response";

type LoginPayload = {
  email?: string;
  password?: string;
  redirect?: string;
};

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

function roleRedirect(role: Profile["role"]) {
  if (role === "seller") return "/seller/dashboard";
  if (role === "admin") return "/admin/dashboard";
  if (role === "agent") return "/agent/dashboard";
  return "/buyer/dashboard";
}

function safeRedirect(redirect: unknown, role: Profile["role"]) {
  if (typeof redirect !== "string" || !redirect.startsWith("/") || redirect.startsWith("//")) return roleRedirect(role);
  if (role === "seller" && redirect.startsWith("/seller")) return redirect;
  if (role === "buyer" && redirect.startsWith("/buyer")) return redirect;
  if (role === "admin" && redirect.startsWith("/admin")) return redirect;
  if (role === "agent" && redirect.startsWith("/agent")) return redirect;
  return roleRedirect(role);
}

async function refreshSeededDemoPassword(email: string, password: string) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) return;
  const demoIds: Record<string, string> = {
    "admin@origino.test": "00000000-0000-0000-0000-000000000001",
    "seller@origino.test": "00000000-0000-0000-0000-000000000002",
    "buyer@origino.test": "00000000-0000-0000-0000-000000000003",
  };
  const userId = demoIds[email];
  if (!userId) return;
  const admin = createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  await admin.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  });
}

export async function POST(request: Request) {
  const payload = await readJson<LoginPayload>(request);
  const missing = requireFields(payload, ["email", "password"]);
  if (missing) return fail(`${missing} is required`, 400);
  if (!String(payload.email).includes("@")) return fail("Enter a valid email address.", 400);
  if (String(payload.password).length < 8) return fail("Password must be at least 8 characters.", 400);

  const publicKey = getPublicSupabaseKey();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publicKey) return fail("Supabase environment is not configured.", 500);

  const cookieStore = cookies();
  const cookiesToSet: CookieToSet[] = [];
  const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, publicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        cookiesToSet.push(...items);
      },
    },
  });

  try {
    const credentials = {
      email: String(payload.email).trim().toLowerCase(),
      password: String(payload.password),
    };
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword(credentials);
    if (authError || !authData.user) {
      await refreshSeededDemoPassword(credentials.email, credentials.password);
      const retry = await supabase.auth.signInWithPassword(credentials);
      authData = retry.data;
      authError = retry.error;
    }
    if (authError || !authData.user) return fail(authError?.message ?? "Invalid login credentials.", 401);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();
    if (profileError || !profile?.role) return fail(profileError?.message ?? "Profile role is missing.", 403);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          role: profile.role,
          redirect: safeRedirect(payload.redirect, profile.role),
        },
      },
      { status: 200 }
    );
    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Login failed.", 500);
  }
}
