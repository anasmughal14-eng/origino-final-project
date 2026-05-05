"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
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
const mobilePrimaryLinks = navLinks.filter((link) => !link.children);
const mobileResourceLinks = navLinks.find((link) => link.children)?.children ?? [];

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
      <div className={`${mobileOpen ? "mobile-nav-glass block px-5 py-4" : "glass flex h-[68px] items-center justify-between px-5"} relative mx-auto w-full max-w-[1280px] rounded-[18px] md:flex md:h-[68px] md:items-center md:justify-between md:px-8 md:py-0`}>
        <nav className="hidden max-w-[42%] items-center gap-1 md:flex">
          {leftNavLinks.map((link) => link.children ? (
            <div className="relative" key={link.labelKey} ref={menuRef} onMouseEnter={() => setDropdown(true)}>
              <button className="nav-link flex min-h-[44px] items-center gap-1 rounded-full px-3 text-[#6b6560] hover:bg-white/45 hover:opacity-100" onClick={() => setDropdown((value) => !value)}>
                {t(link.labelKey)} <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="absolute top-full mt-2 min-w-[250px] rounded-2xl border border-white/45 bg-[rgba(255,250,242,0.62)] p-2 shadow-[0_18px_56px_rgba(64,52,38,0.11)] backdrop-blur-2xl" onMouseLeave={() => setDropdown(false)}>
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
        <Link href="/" className="absolute left-1/2 hidden -translate-x-1/2 text-3xl font-medium tracking-wide text-[#24221f] md:block" style={{ fontFamily: "'Playfair Display', serif" }}>ORIGINO</Link>
        {!mobileOpen && (
          <Link href="/" className="text-3xl font-medium tracking-wide text-[#24221f] md:hidden" style={{ fontFamily: "'Playfair Display', serif" }}>
            ORIGINO
          </Link>
        )}
        <div className="hidden max-w-[42%] items-center justify-end gap-1 md:flex">
          {rightNavLinks.map((link) => link.children ? (
            <div className="relative" key={link.labelKey} ref={menuRef} onMouseEnter={() => setDropdown(true)}>
              <button className="nav-link flex min-h-[44px] items-center gap-1 rounded-full px-3 text-[#6b6560] hover:bg-white/45 hover:opacity-100" onClick={() => setDropdown((value) => !value)}>
                {t(link.labelKey)} <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="absolute right-0 top-full mt-2 min-w-[250px] rounded-2xl border border-white/45 bg-[rgba(255,250,242,0.62)] p-2 shadow-[0_18px_56px_rgba(64,52,38,0.11)] backdrop-blur-2xl" onMouseLeave={() => setDropdown(false)}>
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
          <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/45 bg-white/25 px-4 text-xs font-semibold backdrop-blur-xl" onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
          <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/45 bg-white/25 px-4 text-xs font-semibold backdrop-blur-xl" onClick={() => setLang("ur")} aria-pressed={lang === "ur"}>{t("lang.urdu")}</button>
          <Link className="btn-pill btn-pill-forest min-h-[44px] min-w-[94px] whitespace-nowrap px-5 py-2 text-xs" href="/login">{t("nav.signIn")}</Link>
        </div>
        {!mobileOpen && (
          <button className="ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#6b6560] md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button>
        )}
        {mobileOpen && (
          <div className="md:hidden">
            <div className="flex items-center justify-between border-b border-[rgba(36,34,31,0.12)] pb-4">
              <button className="flex min-h-[44px] min-w-[44px] items-center justify-start text-[#6b6560]" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={21} /></button>
              <Link href="/" className="text-3xl font-medium tracking-wide text-[#24221f]" style={{ fontFamily: "'Playfair Display', serif" }} onClick={() => setMobileOpen(false)}>
                ORIGINO
              </Link>
              <div className="flex min-w-[88px] items-center justify-end gap-2">
                <Link href="/marketplace" className="flex min-h-[44px] min-w-[34px] items-center justify-center text-[#6b6560]" aria-label="Search marketplace" onClick={() => setMobileOpen(false)}>
                  <Search size={19} />
                </Link>
                <Link href="/marketing-packages" className="flex min-h-[44px] min-w-[34px] items-center justify-center text-[#6b6560]" aria-label="Marketing packages" onClick={() => setMobileOpen(false)}>
                  <ShoppingBag size={18} />
                </Link>
              </div>
            </div>
            <nav className="mt-4 grid gap-1">
              {mobilePrimaryLinks.map((link) => (
                <Link className="nav-link min-h-[44px] rounded-xl px-3 py-2 text-[#4d4944] hover:bg-white/35" key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {mobileResourceLinks.map((link) => (
                <Link className="rounded-full border border-[rgba(36,34,31,0.12)] bg-white/25 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#5d564f]" key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px] bg-white/20" onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
              <button className="btn-pill btn-pill-outline min-h-[44px] bg-white/20" onClick={() => setLang("ur")} aria-pressed={lang === "ur"}>{t("lang.urdu")}</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
