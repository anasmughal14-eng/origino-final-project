"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "@/app/components/shared/LanguageProvider";

const navLinks = [
  { href: "/marketplace", labelKey: "nav.marketplace" },
  { href: "/clusters", labelKey: "nav.clusters" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/audit", labelKey: "nav.audit" },
  { href: "/marketing-packages", labelKey: "nav.packages" },
  {
    labelKey: "nav.resources",
    children: [
      { href: "/export-docs", labelKey: "nav.exportGuides" },
      { href: "/landed-cost", labelKey: "nav.costCalculator" },
      { href: "/logistics", labelKey: "nav.logistics" },
      { href: "/community", labelKey: "nav.community" },
      { href: "/blog", labelKey: "nav.journal" },
      { href: "/resources", labelKey: "nav.resources" },
    ],
  },
  { href: "/awards", labelKey: "nav.awards" },
];

const leftNavLinks = navLinks.slice(0, 4);
const rightNavLinks = navLinks.slice(4);

export default function Navigation() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setDropdown(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const linkClass = (href: string) => `nav-link min-h-[44px] inline-flex items-center ${pathname === href || pathname.startsWith(`${href}/`) ? "font-bold underline underline-offset-4" : ""}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="glass relative mx-auto flex h-[68px] w-full max-w-[1280px] items-center justify-between rounded-[18px] px-5 md:px-8">
        <nav className="hidden max-w-[42%] items-center gap-1 md:flex">
          {leftNavLinks.map((link) => link.children ? (
            <div className="relative" key={link.labelKey} ref={menuRef} onMouseEnter={() => setDropdown(true)}>
              <button className="nav-link flex min-h-[44px] items-center gap-1 rounded-full px-3 text-[#6b6560] hover:bg-white/45 hover:opacity-100" onClick={() => setDropdown((value) => !value)}>
                {t(link.labelKey)} <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="absolute top-full mt-2 min-w-[250px] rounded-2xl border border-[rgba(44,44,44,0.08)] bg-[#fefdfb] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.12)]" onMouseLeave={() => setDropdown(false)}>
                  {link.children.map((child) => (
                    <Link
                      className={`${linkClass(child.href)} flex w-full rounded-xl px-3 py-2 text-[#6b6560] hover:bg-[#f4f2ed]`}
                      key={child.href}
                      href={child.href}
                      onClick={() => setDropdown(false)}
                    >
                      {t(child.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : <Link className={`${linkClass(link.href)} rounded-full px-3 text-[#6b6560] hover:bg-white/45 hover:opacity-100`} key={link.href} href={link.href}>{t(link.labelKey)}</Link>)}
        </nav>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-3xl font-medium tracking-wide text-[#24221f]" style={{ fontFamily: "'Playfair Display', serif" }}>ORIGINO</Link>
        <div className="hidden max-w-[42%] items-center justify-end gap-1 md:flex">
          {rightNavLinks.map((link) => link.children ? (
            <div className="relative" key={link.labelKey} ref={menuRef} onMouseEnter={() => setDropdown(true)}>
              <button className="nav-link flex min-h-[44px] items-center gap-1 rounded-full px-3 text-[#6b6560] hover:bg-white/45 hover:opacity-100" onClick={() => setDropdown((value) => !value)}>
                {t(link.labelKey)} <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="absolute right-0 top-full mt-2 min-w-[250px] rounded-2xl border border-[rgba(44,44,44,0.08)] bg-[#fefdfb] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.12)]" onMouseLeave={() => setDropdown(false)}>
                  {link.children.map((child) => (
                    <Link
                      className={`${linkClass(child.href)} flex w-full rounded-xl px-3 py-2 text-[#6b6560] hover:bg-[#f4f2ed]`}
                      key={child.href}
                      href={child.href}
                      onClick={() => setDropdown(false)}
                    >
                      {t(child.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : <Link className={`${linkClass(link.href)} rounded-full px-3 text-[#6b6560] hover:bg-white/45 hover:opacity-100`} key={link.href} href={link.href}>{t(link.labelKey)}</Link>)}
          <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[rgba(36,34,31,0.24)] bg-white/20 px-4 text-xs font-semibold" onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
          <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[rgba(36,34,31,0.24)] bg-white/20 px-4 text-xs font-semibold" onClick={() => setLang("ur")} aria-pressed={lang === "ur"}>{t("lang.urdu")}</button>
          <Link className="btn-pill btn-pill-forest min-h-[44px] min-w-[94px] whitespace-nowrap px-5 py-2 text-xs" href="/login">{t("nav.signIn")}</Link>
        </div>
        <button className="ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#6b6560] md:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Open menu">{mobileOpen ? <X /> : <Menu />}</button>
      </div>
      {mobileOpen && (
        <div className="mx-auto mt-2 w-[calc(100%-24px)] max-w-md rounded-2xl border border-[rgba(44,44,44,0.08)] bg-[#fefdfb] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.12)] md:hidden">
          <div className="flex flex-col">
            {navLinks.flatMap((link) => link.children ?? [link]).map((link) => <Link className="nav-link min-h-[44px] rounded-xl px-4 py-3 text-[#6b6560] hover:bg-[#f4f2ed]" key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{t(link.labelKey)}</Link>)}
            <button className="btn-pill btn-pill-outline mt-2 min-h-[44px]" onClick={() => setLang(lang === "en" ? "ur" : "en")}>{lang === "en" ? t("lang.urdu") : "EN"}</button>
          </div>
        </div>
      )}
    </header>
  );
}
