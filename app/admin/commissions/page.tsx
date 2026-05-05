import AdminQueuePage from "../AdminQueuePage";

export default function AdminCommissionsPage() {
  return (
    <AdminQueuePage
      eyebrow="Commission tracking"
      title="Commissions"
      description="Track supplier commissions, agent commissions, invoice status, buyer confirmation, and payout readiness."
      records={[
        { id: "com-1", title: "ORD-2026-003 commission", subtitle: "$920 pending buyer confirmation.", status: "open", priority: "urgent" },
        { id: "com-2", title: "Agent referral payout", subtitle: "$300 payable to linked agent after invoice.", status: "active" },
        { id: "com-3", title: "March paid commission batch", subtitle: "$21,400 marked paid.", status: "completed" },
      ]}
    />
  );
}
