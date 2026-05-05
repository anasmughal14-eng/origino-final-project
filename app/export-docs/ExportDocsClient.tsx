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
    <div className="container-editorial pb-16 pt-36">
      <h1 className="text-5xl">Export Documentation Hub</h1>
      <div className="mt-6 flex flex-wrap gap-2">{categories.map((item) => <button className="btn-pill btn-pill-outline min-h-[44px]" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{filtered.map((guide) => (
        <article key={guide.slug} className="border border-[rgba(26,26,24,0.16)] p-5">
          <Link href={`/export-docs/${guide.slug}`}><h2 className="text-2xl">{guide.title}</h2></Link>
          <p className="mt-3 text-sm text-[#5a5a54]">{guide.summary}</p>
          <button className="btn-pill btn-pill-outline mt-4 min-h-[44px]" onClick={() => toast.success("Template coming soon")}>Download Template</button>
        </article>
      ))}</div>
    </div>
  );
}
