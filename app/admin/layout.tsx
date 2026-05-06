"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BookOpen,
  Boxes,
  Building2,
  Factory,
  FileCheck2,
  Handshake,
  Landmark,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  PanelTop,
  SearchCheck,
  ShieldAlert,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Command Centre", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileCheck2 },
  { href: "/admin/suppliers", label: "Suppliers", icon: Factory },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/agents", label: "Agents", icon: Handshake },
  { href: "/admin/orders", label: "Orders", icon: Boxes },
  { href: "/admin/escrow", label: "Escrow", icon: Landmark },
  { href: "/admin/marketing-orders", label: "Marketing", icon: Megaphone },
  { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { href: "/admin/sanctions", label: "Sanctions", icon: ShieldAlert },
  { href: "/admin/export-docs", label: "Export Docs", icon: BookOpen },
  { href: "/admin/government-schemes", label: "Gov Schemes", icon: Building2 },
  { href: "/admin/logistics-partners", label: "Logistics", icon: Truck },
  { href: "/admin/commission-config", label: "Commission", icon: BadgeDollarSign },
  { href: "/admin/competitive-intelligence", label: "Market Intel", icon: SearchCheck },
  { href: "/admin/site-builder", label: "Site Builder", icon: PanelTop },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="portal-bg min-h-screen pt-24 md:pt-28">
      <aside className="portal-sidebar fixed bottom-6 left-4 top-28 hidden w-64 flex-shrink-0 overflow-y-auto p-4 md:block">
        <div className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]">Admin</div>
        <div className="mb-6 text-[0.6rem] tracking-[0.1em] text-[var(--ink-muted)]">Restricted Access</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`portal-nav-link ${active ? "portal-nav-link-active font-medium" : ""}`}
              >
                <span className="portal-icon"><item.icon size={16} strokeWidth={1.8} /></span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 md:ml-72">
        <div className="px-4 pb-4 md:hidden">
          <div className="portal-mobile-nav">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Admin</span>
              <span className="text-[0.62rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Restricted</span>
            </div>
            <nav className="portal-mobile-nav-scroll" aria-label="Admin sections">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`portal-mobile-nav-link ${active ? "portal-mobile-nav-link-active font-medium" : ""}`}
                  >
                    <item.icon size={15} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        <main className="min-w-0 p-4 pt-0 md:p-8">{children}</main>
      </div>
    </div>
  );
}
