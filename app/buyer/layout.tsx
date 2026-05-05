"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Calculator,
  ClipboardList,
  Factory,
  FileSearch,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  ReceiptText,
  Scale,
  Search,
  SearchCheck,
  Settings,
  ShieldAlert,
  Star,
  Truck,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/company-profile", label: "Company Profile", icon: BadgeCheck },
  { href: "/buyer/marketplace", label: "Marketplace", icon: Factory },
  { href: "/buyer/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/buyer/rfq", label: "RFQ", icon: FileSearch },
  { href: "/buyer/rfq/new", label: "New RFQ", icon: Search },
  { href: "/buyer/quotes", label: "Quotes", icon: ReceiptText },
  { href: "/buyer/orders", label: "Orders", icon: Truck },
  { href: "/buyer/saved", label: "Saved", icon: Bookmark },
  { href: "/buyer/saved-searches", label: "Saved Searches", icon: SearchCheck },
  { href: "/buyer/compare", label: "Compare", icon: Scale },
  { href: "/buyer/landed-cost", label: "Landed Cost", icon: Calculator },
  { href: "/buyer/inspections", label: "Inspections", icon: ClipboardList },
  { href: "/buyer/reviews", label: "Reviews", icon: Star },
  { href: "/buyer/disputes", label: "Disputes", icon: ShieldAlert },
  { href: "/buyer/notifications", label: "Notifications", icon: Bell },
  { href: "/buyer/subscription", label: "Subscription", icon: WalletCards },
  { href: "/buyer/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/buyer/settings", label: "Settings", icon: Settings },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="portal-bg min-h-screen pt-28">
      <div className="flex">
        <aside className="portal-sidebar fixed bottom-6 left-4 top-28 hidden w-64 flex-shrink-0 overflow-y-auto p-4 md:block">
          <div className="mb-6 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]">Buyer Portal</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`portal-nav-link ${active ? "portal-nav-link-active font-medium" : ""}`}>
                  <span aria-hidden="true" className="portal-icon"><item.icon size={16} strokeWidth={1.8} /></span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-[rgba(44,44,44,0.08)] pt-8">
            <Link href="/" className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)]">Back to Site</Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:ml-72 md:p-8">{children}</main>
      </div>
    </div>
  );
}
