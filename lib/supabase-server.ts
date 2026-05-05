import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export function createSupabaseServerClient() {
  const publicKey = getPublicSupabaseKey();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publicKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and a public Supabase key are required for Supabase server client.");
  }
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    publicKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
