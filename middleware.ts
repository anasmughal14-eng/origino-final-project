import type { Database } from "@/types/database";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ["/seller", "/buyer", "/admin", "/agent"];
const roleByPrefix = {
  "/seller": "seller",
  "/buyer": "buyer",
  "/admin": "admin",
  "/agent": "agent",
} as const;

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return response;

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") return response;

  const publicKey = getPublicSupabaseKey();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publicKey) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    login.searchParams.set("error", "missing_supabase_env");
    return NextResponse.redirect(login);
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    publicKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  const matchedPrefix = Object.keys(roleByPrefix).find((prefix) => pathname.startsWith(prefix)) as keyof typeof roleByPrefix | undefined;
  const expectedRole = matchedPrefix ? roleByPrefix[matchedPrefix] : null;
  if (expectedRole) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
    if (profile?.role !== expectedRole) {
      const login = new URL("/login", request.url);
      login.searchParams.set("redirect", pathname);
      login.searchParams.set("error", "role_required");
      return NextResponse.redirect(login);
    }
  }
  return response;
}

export const config = {
  matcher: ["/seller/:path*", "/buyer/:path*", "/admin/:path*", "/agent/:path*"],
};
