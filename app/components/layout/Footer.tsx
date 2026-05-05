"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/shared/LanguageProvider";

type FooterLink = { href: string; labelKey?: string; label?: string };
type FooterSection = { headingKey: string; links: FooterLink[] };

const footerSections: FooterSection[] = [
  {
    headingKey: "nav.marketplace",
    links: [
      { href: "/marketplace", labelKey: "footer.browseSuppliers" },
      { href: "/marketing-packages", labelKey: "footer.marketingPackages" },
      { href: "/logistics", labelKey: "footer.logisticsPartners" },
      { href: "/status", labelKey: "footer.platformStatus" },
    ],
  },
  {
    headingKey: "nav.clusters",
    links: [
      { href: "/clusters/sialkot", label: "Sialkot" },
      { href: "/clusters/faisalabad", label: "Faisalabad" },
      { href: "/clusters/lahore", label: "Lahore" },
      { href: "/clusters/karachi", label: "Karachi" },
      { href: "/clusters/gujranwala", label: "Gujranwala" },
    ],
  },
  {
    headingKey: "nav.resources",
    links: [
      { href: "/export-docs", labelKey: "footer.exportDocumentation" },
      { href: "/landed-cost", labelKey: "footer.landedCost" },
      { href: "/community", labelKey: "footer.tradeCommunity" },
      { href: "/blog", labelKey: "nav.journal" },
      { href: "/resources", labelKey: "footer.resourceLibrary" },
      { href: "/awards", labelKey: "awards.title" },
    ],
  },
  {
    headingKey: "footer.company",
    links: [
      { href: "/about", labelKey: "footer.ourStory" },
      { href: "/manufacturers", labelKey: "footer.manufacturers" },
      { href: "/buyers", labelKey: "footer.buyers" },
      { href: "/agents", labelKey: "footer.agents" },
      { href: "/legal/privacy", labelKey: "footer.privacy" },
      { href: "/legal/terms", labelKey: "footer.terms" },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-[rgba(44,44,44,0.08)] bg-[var(--cream)] text-[var(--ink)]">
      <div className="container-editorial">
        <div className="border-b border-[rgba(44,44,44,0.08)] pb-12 pt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
            <div>
              <div className="mb-6">
                <div style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold tracking-tight text-[var(--ink)]">ORIGINO</div>
                <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-[var(--ink-muted)]">{t("footer.tagline")}</div>
              </div>
              <p className="max-w-[280px] text-sm leading-relaxed text-[var(--ink-muted)]">{t("footer.body")}</p>
              <div className="mt-8">
                <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-[var(--ink-muted)]">{t("footer.certification")}</div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c] bg-[var(--warm-white)] px-4 py-2 shadow-sm">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#c9a84c] text-[8px] font-bold text-[#c9a84c]">*</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-[#c9a84c]">{t("footer.certified")}</span>
                </div>
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-4">
              {footerSections.map((section) => (
                <div key={section.headingKey}>
                  <h4 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">{t(section.headingKey)}</h4>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={`${section.headingKey}-${link.href}`}>
                        <Link href={link.href} className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--forest)]">{link.labelKey ? t(link.labelKey) : link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-xs text-[var(--ink-muted)]">{t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[var(--ink-muted)]">{t("footer.marketplaceLine")}</span>
            <div className="h-3 w-px bg-[rgba(44,44,44,0.16)]" />
            <span className="text-xs text-[var(--ink-muted)]">EN / {t("lang.urdu")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
