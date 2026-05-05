"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/shared/LanguageProvider";

type ClusterCard = {
  slug: string;
  name: string;
  tagline: string;
  value: string;
  categories: string[];
  img: string;
};

export default function ClustersClient({ clusters }: { clusters: ClusterCard[] }) {
  const { t } = useLanguage();
  return (
    <div className="page-enter pt-24">
      <section className="container-editorial py-10">
        <div className="overflow-hidden rounded-[32px] bg-[#fefdfb] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.06)] md:p-10">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-[#8b9a6d]" />
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-[#4f5b3a]">{t("clusters.eyebrow")}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif" }} className="mb-4 max-w-3xl text-5xl font-bold text-[#1a1a18] md:text-7xl">{t("clusters.title")}</h1>
          <p className="max-w-xl text-lg text-[#5a5a54]">{t("clusters.description")}</p>
        </div>
      </section>
      <section className="pb-16">
        <div className="container-editorial space-y-4">
          {clusters.map((cluster, index) => (
            <Link key={cluster.slug} href={`/clusters/${cluster.slug}`} className="group grid gap-5 overflow-hidden rounded-[28px] border border-[rgba(44,44,44,0.08)] bg-[#fefdfb] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.035)] transition hover:-translate-y-1 hover:shadow-[0_22px_80px_rgba(0,0,0,0.08)] md:grid-cols-[72px_220px_1fr_auto_44px] md:items-center">
              <div className="text-right" style={{ fontFamily: "'Courier Prime',monospace" }}>
                <span className="text-sm text-[#8a8a82]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="h-40 overflow-hidden rounded-[22px] md:h-28" style={{ backgroundImage: `url('${cluster.img}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%) contrast(1.05)" }} />
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',serif" }} className="text-2xl font-bold text-[#1a1a18] transition-colors group-hover:text-[#2d4a3e]">{cluster.name}</h2>
                <p className="mb-2 text-xs uppercase tracking-wide text-[#8a8a82]">{cluster.tagline}</p>
                <div className="flex flex-wrap gap-2">{cluster.categories.map((category) => <span key={category} className="badge-patch border-[rgba(26,26,24,0.2)] text-[0.6rem] text-[#5a5a54]">{category}</span>)}</div>
              </div>
              <div className="text-right">
                <div style={{ fontFamily: "'Courier Prime',monospace" }} className="text-2xl font-bold text-[#1a1a18]">{cluster.value}</div>
                <div className="text-xs uppercase tracking-wider text-[#8a8a82]">{t("clusters.annualExports")}</div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(44,44,44,0.16)] text-[#8a8a82] transition-colors group-hover:border-[#4f5b3a] group-hover:text-[#4f5b3a]">-&gt;</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
