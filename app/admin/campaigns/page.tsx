import AdminQueuePage from "../AdminQueuePage";

export default function AdminCampaignsPage() {
  return (
    <AdminQueuePage
      eyebrow="Seasonal sourcing"
      title="Campaigns"
      description="Manage seasonal sourcing pages, sponsored categories, campaign landing pages, and buyer newsletters."
      records={[
        { id: "camp-1", title: "EU surgical sourcing sprint", subtitle: "Campaign page content and supplier lineup.", status: "active", href: "/campaigns/eu-surgical-sourcing" },
        { id: "camp-2", title: "GCC hotel textiles", subtitle: "Buyer newsletter segment pending copy review.", status: "open" },
        { id: "camp-3", title: "Ramadan food exports", subtitle: "Archived seasonal campaign.", status: "completed" },
      ]}
    />
  );
}
