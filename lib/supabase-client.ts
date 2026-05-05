import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export function createSupabaseBrowserClient() {
  const publicKey = getPublicSupabaseKey();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publicKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and a public Supabase key are required for Supabase browser client.");
  }
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    publicKey
  );
}
