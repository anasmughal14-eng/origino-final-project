"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileText,
  FolderCheck,
  LayoutDashboard,
  MessageSquareText,
  PackagePlus,
  ReceiptText,
  RefreshCw,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Video,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/onboarding", label: "Onboarding", icon: ClipboardCheck },
  { href: "/seller/profile", label: "My Profile", icon: Factory },
  { href: "/seller/documents", label: "Documents", icon: FolderCheck },
  { href: "/seller/products", label: "Products", icon: Boxes },
  { href: "/seller/products/new", label: "New Product", icon: PackagePlus },
  { href: "/seller/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/seller/quotes", label: "Quotes", icon: ReceiptText },
  { href: "/seller/orders", label: "Orders", icon: ClipboardList },
  { href: "/seller/orders/report", label: "Report Order", icon: FileText },
  { href: "/seller/samples", label: "Samples", icon: Star },
  { href: "/seller/performance", label: "Performance", icon: BarChart3 },
  { href: "/seller/marketing", label: "Marketing", icon: Sparkles },
  { href: "/seller/export-docs", label: "Export Docs", icon: BookOpen },
  { href: "/seller/government-schemes", label: "Gov Schemes", icon: WalletCards },
  { href: "/seller/trade-finance", label: "Trade Finance", icon: CircleDollarSign },
  { href: "/seller/disputes", label: "Disputes", icon: ShieldAlert },
  { href: "/seller/notifications", label: "Notifications", icon: Bell },
  { href: "/seller/virtual-tours", label: "Virtual Tours", icon: Video },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/response-templates", label: "Templates", icon: FileText },
  { href: "/seller/erp-sync", label: "ERP Sync", icon: RefreshCw },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="portal-bg min-h-screen pt-28">
      <div className="flex">
        <aside className="portal-sidebar fixed bottom-6 left-4 top-28 hidden w-64 flex-shrink-0 overflow-y-auto p-4 md:block">
          <div className="mb-6 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]">Seller Portal</div>
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
            <Link href="/" className="text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">Back to Site</Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:ml-72 md:p-8">{children}</main>
      </div>
    </div>
  );
}
