"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { ExportGuide } from "@/lib/mock-data";

export default function ExportDocsClient({ guides }: { guides: ExportGuide[] }) {
  const [category, setCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(guides.map((guide) => guide.category)))];
  const filtered = useMemo(() => category === "all" ? guides : guides.filter((guide) => guide.category === category), [category, guides]);
  return (
    <div className="page-enter container-editorial pb-16 pt-36">
      <div className="panel-soft p-6 md:p-10">
        <p className="section-kicker">Export Guides</p>
        <h1 className="mt-5 text-[2.8rem] leading-[0.98] md:text-[4.4rem]">Documents before distance.</h1>
        <p className="mt-5 max-w-2xl leading-8 text-[var(--ink-muted)]">Plain guides for the records buyers ask for: Form-E, origin, GSP+, CE, Halal, FDA, and the paperwork that makes Pakistani exports easier to read.</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">{categories.map((item) => <button className="btn-pill btn-pill-outline min-h-[44px]" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{filtered.map((guide) => (
        <article key={guide.slug} className="panel-soft p-6">
          <Link href={`/export-docs/${guide.slug}`}><h2 className="text-2xl">{guide.title}</h2></Link>
          <p className="mt-3 text-sm text-[#5a5a54]">{guide.summary}</p>
          <button className="btn-pill btn-pill-outline mt-4 min-h-[44px]" onClick={() => toast.success("Template coming soon")}>Download Template</button>
        </article>
      ))}</div>
    </div>
  );
}
