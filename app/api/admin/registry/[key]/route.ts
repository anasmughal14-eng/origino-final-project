import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";

const allowedKeys = new Set([
  "commission-config",
  "logistics-partners",
  "government-schemes",
  "export-docs",
  "competitive-intelligence",
]);

function configKey(key: string) {
  return `admin_registry_${key}`;
}

const fallbackRegistryRecords: Record<string, Array<Record<string, unknown>>> = {
  "government-schemes": [
    {
      id: "scheme-tdap-edf",
      name: "TDAP Export Development Fund",
      category: "Marketing support",
      status: "active",
      owner: "Policy Ops",
      summary: "SME export marketing subsidy shown to eligible sellers by category, cluster, and years in business.",
      adminHref: "/seller/government-schemes",
      metrics: ["TDAP", "SME", "Marketing"],
    },
    {
      id: "scheme-sbp-efs",
      name: "SBP Export Finance Scheme",
      category: "Trade finance",
      status: "review",
      owner: "Finance Ops",
      summary: "Concessionary export finance rate and eligibility copy aligned with SBP guidance.",
      adminHref: "/admin/trade-finance",
      metrics: ["SBP", "Finance", "Rate review"],
    },
    {
      id: "scheme-dtre-registration",
      name: "DTRE Registration",
      category: "Duty remission",
      status: "active",
      owner: "Compliance Ops",
      summary: "FBR duty and tax remission scheme linked to export documentation and seller document checklists.",
      publicHref: "/export-docs/dtre-registration",
      adminHref: "/seller/export-docs",
      metrics: ["FBR", "DTRE", "Docs-linked"],
    },
  ],
  "export-docs": [
    {
      id: "guide-form-e-pakistan",
      name: "Form-E Pakistan",
      category: "Bank documentation",
      status: "active",
      owner: "Compliance Ops",
      summary: "Public guide for export remittance and bank processing with issuing authority and template status.",
      publicHref: "/export-docs/form-e-pakistan",
      adminHref: "/seller/export-docs",
      metrics: ["Public", "Seller checklist", "Template"],
    },
    {
      id: "guide-certificate-of-origin",
      name: "Certificate of Origin",
      category: "Core export document",
      status: "active",
      owner: "Compliance Ops",
      summary: "TDAP and Chamber of Commerce origin proof guide linked to GSP+ and landed-cost evidence.",
      publicHref: "/export-docs/certificate-of-origin",
      adminHref: "/seller/export-docs",
      metrics: ["TDAP", "Chamber", "Origin proof"],
    },
    {
      id: "guide-gsp-plus-certificate",
      name: "GSP+ Certificate",
      category: "Preferential tariff",
      status: "active",
      owner: "Policy Ops",
      summary: "EU preferential tariff guide linked to landed cost calculator savings and seller document vault status.",
      publicHref: "/export-docs/gsp-plus-certificate",
      adminHref: "/landed-cost",
      metrics: ["EU", "GSP+", "Calculator-linked"],
    },
  ],
};

function fallbackRecordsFor(key: string) {
  return fallbackRegistryRecords[key] ?? [];
}

export async function GET(_request: Request, { params }: { params: { key: string } }) {
  if (!allowedKeys.has(params.key)) return fail("Unknown admin registry", 404);
  try {
    if (USE_MOCK_DATA) return ok({ key: params.key, records: fallbackRecordsFor(params.key) });
    const { data, error } = await createSupabaseServiceClient()
      .from("site_config")
      .select("value, updated_at")
      .eq("key", configKey(params.key))
      .maybeSingle();
    if (error) return fail(error.message, 500);
    const records = data?.value ? JSON.parse(data.value) : fallbackRecordsFor(params.key);
    return ok({
      key: params.key,
      records,
      updatedAt: data?.updated_at ?? null,
    });
  } catch {
    return fail("Unable to load admin registry", 500);
  }
}

export async function PATCH(request: Request, { params }: { params: { key: string } }) {
  if (!allowedKeys.has(params.key)) return fail("Unknown admin registry", 404);
  try {
    const body = await readJson<{ records?: unknown[]; action?: string; id?: string; note?: string }>(request);
    if (!Array.isArray(body.records)) return fail("records array is required", 400);
    const payload = JSON.stringify(body.records);
    if (!USE_MOCK_DATA) {
      const { error } = await createSupabaseServiceClient()
        .from("site_config")
        .upsert({ key: configKey(params.key), value: payload }, { onConflict: "key" });
      if (error) return fail(error.message, 500);
    }
    return ok({
      key: params.key,
      action: body.action ?? "save",
      id: body.id ?? null,
      note: body.note ?? null,
      saved: true,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return fail("Unable to save admin registry", 500);
  }
}
