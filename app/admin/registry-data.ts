import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { RegistryRecord } from "./AdminRegistryTool";

function configKey(key: string) {
  return `admin_registry_${key}`;
}

export async function loadAdminRegistryRecords(key: string, fallback: RegistryRecord[]) {
  if (USE_MOCK_DATA) return fallback;
  const { data, error } = await createSupabaseServiceClient()
    .from("site_config")
    .select("value")
    .eq("key", configKey(key))
    .maybeSingle();
  if (error || !data?.value) return fallback;
  try {
    const parsed = JSON.parse(data.value) as RegistryRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}
