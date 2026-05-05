import AdminQueuePage from "../../AdminQueuePage";

export default function AdminSiteBuilderPanelPage() {
  return (
    <AdminQueuePage
      eyebrow="Page sections"
      title="Site Builder Panel"
      description="Review page sections, ordering, content edits, preview readiness, and publish controls."
      primaryActionHref="/admin/site-builder"
      primaryActionLabel="Open Builder"
      records={[
        { id: "section-1", title: "Homepage hero", subtitle: "Hero copy and CTA order.", status: "active", href: "/admin/site-builder" },
        { id: "section-2", title: "Featured clusters", subtitle: "City cluster section ordering.", status: "open", href: "/admin/site-builder" },
        { id: "section-3", title: "Export docs CTA", subtitle: "Footer CTA content ready.", status: "active", href: "/admin/site-builder" },
      ]}
    />
  );
}
