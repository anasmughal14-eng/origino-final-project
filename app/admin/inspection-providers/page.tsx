import AdminQueuePage from "../AdminQueuePage";

export default function AdminInspectionProvidersPage() {
  return (
    <AdminQueuePage
      eyebrow="Quality partners"
      title="Inspection Providers"
      description="Manage SGS, Bureau Veritas, Intertek, local inspectors, coverage cities, services, and pricing tiers."
      records={[
        { id: "provider-1", title: "SGS Pakistan", subtitle: "Pre-shipment and container loading coverage.", status: "active" },
        { id: "provider-2", title: "Bureau Veritas", subtitle: "Medical instruments AQL coverage pending.", status: "open" },
        { id: "provider-3", title: "Local Sialkot Inspector", subtitle: "Budget PSI partner awaiting document verification.", status: "open", priority: "urgent" },
      ]}
    />
  );
}
