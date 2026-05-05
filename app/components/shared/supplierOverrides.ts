import type { Supplier } from "@/types/database";

const STORAGE_KEY = "origino_supplier_overrides";

export type SupplierOverride = {
  id: string;
  slug: string;
  verification_tier?: Supplier["verification_tier"];
  is_active?: boolean;
  updated_at: string;
};

type SupplierOverrideMap = Record<string, SupplierOverride>;

export function readSupplierOverrides(): SupplierOverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as SupplierOverrideMap : {};
  } catch {
    return {};
  }
}

export function writeSupplierOverride(supplier: Supplier, update: Partial<Supplier>) {
  if (typeof window === "undefined") return;
  const current = readSupplierOverrides();
  const persistedUpdate: Partial<Pick<Supplier, "verification_tier" | "is_active">> = {};
  if (update.verification_tier) persistedUpdate.verification_tier = update.verification_tier;
  if (update.is_active !== undefined) persistedUpdate.is_active = update.is_active;
  current[supplier.id] = {
    ...current[supplier.id],
    id: supplier.id,
    slug: supplier.slug,
    ...persistedUpdate,
    updated_at: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("origino:supplier-overrides"));
}

export function applySupplierOverrides<T extends Pick<Supplier, "id" | "slug" | "verification_tier" | "is_active">>(suppliers: T[]): T[] {
  const overrides = readSupplierOverrides();
  return suppliers.map((supplier) => {
    const override = overrides[supplier.id];
    if (!override) return supplier;
    return {
      ...supplier,
      ...(override.verification_tier ? { verification_tier: override.verification_tier } : {}),
      ...(override.is_active !== undefined ? { is_active: override.is_active } : {}),
    };
  });
}

export function getSupplierOverride(id: string) {
  return readSupplierOverrides()[id] ?? null;
}
