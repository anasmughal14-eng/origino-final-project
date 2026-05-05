"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/shared/LanguageProvider";

export default function ClusterDetailLabels({ suppliers, categories, exportShare, city }: { suppliers: number; categories: number; exportShare: string; city: string }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border p-5"><p className="metric-numeral text-2xl">{suppliers}</p><p>{t("cluster.verifiedSuppliers")}</p></div>
        <div className="border p-5"><p className="metric-numeral text-2xl">{categories}</p><p>{t("cluster.primaryCategories")}</p></div>
        <div className="border p-5"><p className="metric-numeral text-2xl">{exportShare}</p><p>{t("cluster.exportShare")}</p></div>
      </div>
      <Link className="btn-pill btn-pill-forest mt-8 min-h-[44px]" href={`/marketplace?city=${city}`}>{t("cluster.browseSuppliers")}</Link>
      <h2 className="mt-12 text-3xl">{t("cluster.featuredSuppliers")}</h2>
    </>
  );
}
