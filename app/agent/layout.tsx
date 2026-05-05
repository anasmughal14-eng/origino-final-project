"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  ClipboardList,
  FileSearch,
  LayoutDashboard,
  MessageSquareText,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { href: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agent/clients", label: "Clients", icon: Users },
  { href: "/agent/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/agent/rfq", label: "RFQ", icon: FileSearch },
  { href: "/agent/quotes", label: "Quotes", icon: ReceiptText },
  { href: "/agent/orders", label: "Orders", icon: ClipboardList },
  { href: "/agent/commissions", label: "Commissions", icon: BadgeDollarSign },
  { href: "/agent/settings", label: "Settings", icon: Settings },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="portal-bg min-h-screen pt-28">
      <div className="flex">
        <aside className="portal-sidebar fixed bottom-6 left-4 top-28 hidden w-64 flex-shrink-0 overflow-y-auto p-4 md:block">
          <div className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]">Agent Portal</div>
          <div className="mb-6 flex items-center gap-2 text-[0.6rem] tracking-[0.1em] text-[var(--ink-muted)]"><BriefcaseBusiness size={13} /> Buyer Mandates</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={`portal-nav-link ${active ? "portal-nav-link-active font-medium" : ""}`}>
                  <span aria-hidden="true" className="portal-icon"><item.icon size={16} strokeWidth={1.8} /></span>{item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:ml-72 md:p-8">{children}</main>
      </div>
    </div>
  );
}
