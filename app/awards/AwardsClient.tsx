"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/app/components/shared/LanguageProvider";
import type { Award, Supplier } from "@/types/database";

export default function AwardsClient({ awards, suppliers }: { awards: Award[]; suppliers: Supplier[] }) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState("all");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => awards.filter((award) => (period === "all" || award.period.startsWith(period)) && (category === "all" || award.category === category)), [awards, category, period]);
  return (
    <div className="container-editorial pt-28 pb-16">
      <h1 className="text-5xl">{t("awards.title")}</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <select className="input-editorial min-h-[44px] max-w-[180px]" value={period} onChange={(event) => setPeriod(event.target.value)}><option value="all">{t("awards.allQuarters")}</option><option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option></select>
        <select className="input-editorial min-h-[44px] max-w-[220px]" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">{t("awards.allCategories")}</option>{Array.from(new Set(awards.map((award) => award.category))).map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {filtered.length === 0 && <div className="mt-8 border p-6 text-[#5a5a54]">{t("awards.empty")}</div>}
      <div className="mt-8 space-y-4">{filtered.map((award) => {
        const supplier = suppliers.find((item) => item.id === award.supplier_id);
        return <div className="flex flex-wrap items-center justify-between gap-4 border p-5" key={award.id}><div><p className="badge-patch">{t("awards.rank")} {award.rank}</p><h2 className="mt-3 text-2xl">{award.category}</h2>{supplier ? <Link className="text-[#2d4a3e] underline" href={`/suppliers/${supplier.slug}`}>{supplier.company_name}</Link> : <span className="text-[#5a5a54]">{t("awards.unavailable")}</span>}</div><p className="metric-numeral text-3xl">{award.score}</p></div>;
      })}</div>
    </div>
  );
}
