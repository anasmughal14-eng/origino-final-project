import AdminQueuePage from "../AdminQueuePage";

export default function AdminBuyerSubscriptionsPage() {
  return (
    <AdminQueuePage
      eyebrow="Buyer trust"
      title="Buyer Subscriptions"
      description="Manage verified importer subscriptions, premium buyer status, billing events, and lead-quality upgrades."
      records={[
        { id: "sub-1", title: "Hansa Medical Imports", subtitle: "Verified importer subscription active.", status: "active" },
        { id: "sub-2", title: "Marina Trading LLC", subtitle: "Premium buyer upgrade requested.", status: "open", priority: "urgent" },
        { id: "sub-3", title: "Northstar Home Retail", subtitle: "Billing renewal due this week.", status: "open" },
      ]}
    />
  );
}
