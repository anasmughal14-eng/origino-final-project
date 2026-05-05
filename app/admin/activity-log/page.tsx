import AdminActivityLogClient from "./AdminActivityLogClient";

export type ActivityLogEntry = {
  id: string;
  created_at: string;
  actor: string;
  role: "admin" | "system" | "seller" | "buyer";
  action: string;
  entity_type: "payment" | "sanctions" | "role" | "document" | "api" | "order" | "supplier";
  entity_id: string;
  severity: "info" | "warning" | "critical";
  ip_address: string;
  metadata: Record<string, string>;
  href: string;
};

const activityLogs: ActivityLogEntry[] = [
  {
    id: "log-1007",
    created_at: "2026-05-03T18:42:00.000Z",
    actor: "Admin Ops",
    role: "admin",
    action: "Escrow release authorised after inspection pass",
    entity_type: "payment",
    entity_id: "esc-1",
    severity: "critical",
    ip_address: "203.99.51.18",
    metadata: { amount_usd: "18400", milestone: "quality_check", order_id: "ord-3" },
    href: "/admin/escrow",
  },
  {
    id: "log-1006",
    created_at: "2026-05-03T17:30:00.000Z",
    actor: "Compliance Bot",
    role: "system",
    action: "Sanctions check completed against OFAC, UN, EU, and HMT",
    entity_type: "sanctions",
    entity_id: "app-2",
    severity: "warning",
    ip_address: "system",
    metadata: { result: "possible_match", list_count: "4", requires_admin_review: "true" },
    href: "/admin/sanctions",
  },
  {
    id: "log-1005",
    created_at: "2026-05-03T16:15:00.000Z",
    actor: "Admin Ops",
    role: "admin",
    action: "Supplier verification tier changed to ORIGINO Certified",
    entity_type: "supplier",
    entity_id: "sup-1",
    severity: "info",
    ip_address: "203.99.51.18",
    metadata: { previous_tier: "site_visited", new_tier: "origino_certified" },
    href: "/admin/suppliers/sup-1",
  },
  {
    id: "log-1004",
    created_at: "2026-05-03T15:10:00.000Z",
    actor: "Document Vault",
    role: "system",
    action: "ISO 13485 certificate expiry alert generated",
    entity_type: "document",
    entity_id: "doc-iso-sup-1",
    severity: "warning",
    ip_address: "system",
    metadata: { supplier_id: "sup-1", expires_in_days: "30", document_type: "ISO Certificate" },
    href: "/admin/documents",
  },
  {
    id: "log-1003",
    created_at: "2026-05-03T14:22:00.000Z",
    actor: "API Gateway",
    role: "system",
    action: "Admin supplier list requested",
    entity_type: "api",
    entity_id: "/api/admin/suppliers",
    severity: "info",
    ip_address: "127.0.0.1",
    metadata: { method: "GET", status: "200", success: "true" },
    href: "/admin/suppliers",
  },
];

export default function AdminActivityLogPage() {
  return <AdminActivityLogClient initialLogs={activityLogs} />;
}
