import AdminQueuePage from "../AdminQueuePage";

export default function AdminDisputesPage() {
  return (
    <AdminQueuePage
      eyebrow="Mediation"
      title="Disputes"
      description="Review escrow disputes, buyer evidence, seller responses, arbitration decisions, and refund workflow."
      records={[
        { id: "disp-1", title: "Inspection evidence mismatch", subtitle: "Escrow frozen for ORD-2026-006.", status: "open", priority: "urgent", href: "/admin/escrow" },
        { id: "disp-2", title: "Packing list clarification", subtitle: "Buyer requested mediation before final release.", status: "active", href: "/admin/orders" },
        { id: "disp-3", title: "Resolved freight delay", subtitle: "Closed after buyer delivery confirmation.", status: "completed" },
      ]}
    />
  );
}
