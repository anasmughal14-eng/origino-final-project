import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required when NEXT_PUBLIC_USE_MOCK_DATA=false`);
  return value;
}

function requiredPublicSupabaseKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!value) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required when NEXT_PUBLIC_USE_MOCK_DATA=false");
  return value;
}

export function createSupabaseAnonClient() {
  return createClient<Database>(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredPublicSupabaseKey()
  );
}

export function createSupabaseServiceClient() {
  return createClient<Database>(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
