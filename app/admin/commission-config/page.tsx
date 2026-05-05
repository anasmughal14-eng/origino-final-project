import AdminRegistryTool from "../AdminRegistryTool";
import { loadAdminRegistryRecords } from "../registry-data";

const commissionRecords = [
  {
    id: "commission-default-supplier",
    name: "Default supplier commission",
    category: "Supplier",
    status: "active" as const,
    owner: "Finance Ops",
    summary: "5% platform commission on confirmed orders below $50K, locked when a quote is accepted and an order is created.",
    adminHref: "/admin/orders",
    metrics: ["5%", "< $50K", "Order-linked"],
  },
  {
    id: "commission-agent-facilitation",
    name: "Agent facilitation commission",
    category: "Agent",
    status: "active" as const,
    owner: "Agent Ops",
    summary: "Separate agent payout for linked buyer relationships and facilitated orders, tracked outside supplier commission.",
    adminHref: "/admin/agents",
    metrics: ["Agent role", "Linked clients", "Separate payout"],
  },
  {
    id: "commission-high-value-override",
    name: "High-value order override",
    category: "Enterprise",
    status: "review" as const,
    owner: "Finance Ops",
    summary: "Reduced commission tier for orders above $50K requiring admin approval and trade finance review before activation.",
    adminHref: "/admin/trade-finance",
    metrics: [">$50K", "Approval required", "Finance-linked"],
  },
];

export default async function AdminCommissionConfigPage() {
  const records = await loadAdminRegistryRecords("commission-config", commissionRecords);

  return (
    <AdminRegistryTool
      eyebrow="Revenue rules"
      title="Commission Config"
      description="Manage supplier, agent, and high-value commission rules that connect quote acceptance, order creation, escrow tracking, and admin finance review."
      registryKey="commission-config"
      records={records}
      addLabel="Add Rule"
      publishLabel="Activate"
      externalHref="/admin/orders"
      externalLabel="Review Orders"
    />
  );
}
