import Link from "next/link";
import {
  getAdminMetrics,
  getAdminTasks,
  getApplications,
  getEscrowTransactions,
  getMarketingServiceOrders,
  getOrders,
  getSuppliers,
} from "@/lib/data-service";

type PendingAction = {
  title: string;
  body: string;
  href: string;
  label: string;
  severity: "normal" | "warning" | "breach";
  meta: string;
};

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

function metricHref(key: string) {
  const routes: Record<string, string> = {
    suppliers: "/admin/suppliers",
    products: "/admin/products",
    orders: "/admin/orders",
    quotes: "/admin/quotes",
    applications: "/admin/applications",
    inquiries: "/admin/inquiries",
    revenue: "/admin/orders",
  };
  return routes[key] ?? "/admin/dashboard";
}

function dueLabel(value: string | null) {
  return value ? `Due ${new Date(value).toLocaleDateString()}` : "Due date missing";
}

export default async function AdminDashboardPage() {
  const [metrics, applications, tasks, marketingOrders, escrowTransactions, orders, suppliers] = await Promise.all([
    getAdminMetrics(),
    getApplications(),
    getAdminTasks(),
    getMarketingServiceOrders(),
    getEscrowTransactions(),
    getOrders(),
    getSuppliers(),
  ]);

  const supplierById = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const pendingApplications = applications.filter((application) => application.status !== "approved");
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const urgentTasks = openTasks.filter((task) => task.priority === "urgent" || task.priority === "high");
  const breachedMarketingOrders = marketingOrders.filter((order) => order.sla_status === "breached");
  const atRiskMarketingOrders = marketingOrders.filter((order) => order.sla_status === "at_risk");
  const heldEscrowTotal = escrowTransactions
    .filter((transaction) => transaction.status === "funded" || transaction.status === "disputed" || transaction.status === "pending")
    .reduce((total, transaction) => total + transaction.amount_usd, 0);
  const disputedOrders = orders.filter((order) => order.status === "disputed").length;

  const metricCards = [
    { key: "suppliers", label: "Suppliers", value: metrics.suppliers, href: "/admin/suppliers" },
    { key: "applications", label: "Pending applications", value: pendingApplications.length, href: "/admin/applications" },
    { key: "orders", label: "Orders", value: metrics.orders, href: "/admin/orders" },
    { key: "escrow", label: "Escrow held", value: money(heldEscrowTotal), href: "/admin/escrow", tone: "forest" },
    { key: "sla", label: "SLA breaches", value: breachedMarketingOrders.length, href: "/admin/marketing-orders", tone: "breach" },
    { key: "tasks", label: "Open admin tasks", value: openTasks.length, href: "/admin/tasks" },
    { key: "disputes", label: "Disputed orders", value: disputedOrders, href: "/admin/orders", tone: "warning" },
    { key: "revenue", label: "Platform GMV", value: money(metrics.revenue), href: metricHref("revenue") },
  ];

  const pendingActions: PendingAction[] = [
    ...pendingApplications.slice(0, 2).map((application): PendingAction => ({
      title: `Review ${application.company_name} application`,
      body: `Audit score ${application.audit_score}; status ${application.status}. Check sanctions, documents, and approval path.`,
      href: `/admin/applications/${application.id}`,
      label: "Review application",
      severity: application.status === "rejected" ? "warning" : "normal",
      meta: `${application.city} / ${application.product_category}`,
    })),
    ...breachedMarketingOrders.map((order): PendingAction => {
      const supplier = supplierById.get(order.supplier_id);
      return {
        title: `SLA breach: ${order.tier} package overdue`,
        body: `${supplier?.company_name ?? order.supplier_id} missed the service deadline. Assign owner and record recovery note.`,
        href: "/admin/marketing-orders",
        label: "Review SLA",
        severity: "breach",
        meta: dueLabel(order.sla_due_at),
      };
    }),
    ...atRiskMarketingOrders.map((order): PendingAction => {
      const supplier = supplierById.get(order.supplier_id);
      return {
        title: `At risk: ${order.tier} package deadline`,
        body: `${supplier?.company_name ?? order.supplier_id} needs delivery follow-up before breach.`,
        href: "/admin/marketing-orders",
        label: "Open marketing order",
        severity: "warning",
        meta: dueLabel(order.sla_due_at),
      };
    }),
    ...urgentTasks.slice(0, 3).map((task): PendingAction => ({
      title: task.title,
      body: task.notes ?? "Admin task requires action.",
      href: task.linked_href,
      label: "Review task",
      severity: task.type === "sla_breach" ? "breach" : "warning",
      meta: `${task.type.replaceAll("_", " ")} / ${task.priority}`,
    })),
  ].slice(0, 7);

  const supplyGaps = [
    { label: "Applications waiting", value: pendingApplications.length, href: "/admin/applications" },
    { label: "Sanctions queue", value: tasks.filter((task) => task.type === "sanctions_review" && task.status !== "completed").length, href: "/admin/sanctions" },
    { label: "Document expiry tasks", value: tasks.filter((task) => task.type === "document_expiry" && task.status !== "completed").length, href: "/admin/documents" },
    { label: "At-risk marketing", value: atRiskMarketingOrders.length, href: "/admin/marketing-orders" },
  ];

  return (
    <div>
      <div className="border-b border-[rgba(26,26,24,0.12)] pb-6">
        <p className="badge-patch mb-3">Admin Portal</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl">Operations Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5a5a54] sm:text-base">Application reviews, SLA breaches, marketplace supply, escrow exposure, and order activity.</p>
          </div>
          <Link className="btn-pill btn-pill-outline min-h-[44px] w-full sm:w-auto" href="/admin/activity-log">Open Activity Log</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Link
            className={`dashboard-card p-4 sm:p-5 ${metric.tone === "breach" ? "border-[var(--terracotta)] bg-[var(--terracotta-pale)] text-[var(--terracotta)]" : ""} ${metric.tone === "warning" ? "border-[var(--gold)] bg-[var(--gold-pale)]" : ""} ${metric.tone === "forest" ? "border-[var(--forest)] bg-[var(--forest-pale)]" : ""}`}
            href={metric.href}
            key={metric.key}
          >
            <p className="metric-numeral text-2xl sm:text-3xl">{metric.value}</p>
            <p className="mt-1 text-xs leading-5 text-[#5a5a54] sm:text-sm">{metric.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl">Pending Actions</h2>
              <p className="mt-1 text-sm text-[#5a5a54]">Each row routes to the relevant admin entity for review.</p>
            </div>
            <Link className="btn-pill btn-pill-outline min-h-[44px] w-full sm:w-auto" href="/admin/tasks">View Task Queue</Link>
          </div>
          <div className="space-y-3">
            {pendingActions.map((action, index) => (
              <div
                className={`dashboard-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${action.severity === "breach" ? "border-[var(--terracotta)] bg-[var(--terracotta-pale)] text-[var(--terracotta)]" : ""} ${action.severity === "warning" ? "border-[var(--gold)] bg-[var(--gold-pale)]" : ""}`}
                key={`${action.href}-${action.label}-${action.title}-${action.meta}-${index}`}
              >
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{action.title}</p>
                    {action.severity === "breach" && <span className="badge-patch border-[var(--terracotta)] bg-[var(--terracotta-pale)] text-[var(--terracotta)]">SLA Breach</span>}
                  </div>
                  <p className="mt-1 text-sm">{action.body}</p>
                  <p className="small-caps mt-2 text-xs">{action.meta}</p>
                </div>
                <Link className="btn-pill btn-pill-outline min-h-[44px] w-full shrink-0 sm:w-auto" href={action.href}>{action.label}</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card p-4 sm:p-5">
          <h2 className="text-2xl sm:text-3xl">Operational Queues</h2>
          <p className="mt-1 text-sm text-[#5a5a54]">Fast links for the admin workstreams called out in the build prompt.</p>
          <div className="mt-5 space-y-3">
            {supplyGaps.map((item) => (
              <Link className="dashboard-card flex items-center justify-between p-4" href={item.href} key={item.label}>
                <span>{item.label}</span>
                <span className="metric-numeral text-2xl">{item.value}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
