"use client";

import { useEffect, useState } from "react";
import type { Supplier } from "@/types/database";
import VerificationTierBadge from "./VerificationTierBadge";
import { getSupplierOverride } from "./supplierOverrides";

export default function SupplierVerificationBadgeClient({ supplierId, tier }: { supplierId: string; tier: Supplier["verification_tier"] }) {
  const [currentTier, setCurrentTier] = useState(tier);

  useEffect(() => {
    function syncTier() {
      const override = getSupplierOverride(supplierId);
      setCurrentTier(override?.verification_tier ?? tier);
    }
    syncTier();
    window.addEventListener("storage", syncTier);
    window.addEventListener("origino:supplier-overrides", syncTier);
    return () => {
      window.removeEventListener("storage", syncTier);
      window.removeEventListener("origino:supplier-overrides", syncTier);
    };
  }, [supplierId, tier]);

  return <VerificationTierBadge tier={currentTier} />;
}
