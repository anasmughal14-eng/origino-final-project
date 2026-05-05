import AdminQueuePage from "../AdminQueuePage";

export default function AdminInspectionsPage() {
  return (
    <AdminQueuePage
      eyebrow="AQL reports"
      title="Inspections"
      description="Administer PSI, DUPRO, container loading, AQL reports, photos, pass/fail outcomes, and provider follow-up."
      records={[
        { id: "insp-1", title: "ORD-2026-006 PSI", subtitle: "Inspection evidence mismatch; escrow linked.", status: "open", priority: "urgent", href: "/admin/escrow" },
        { id: "insp-2", title: "Textile DUPRO booking", subtitle: "Provider confirmation due today.", status: "active" },
        { id: "insp-3", title: "Food shipment container loading", subtitle: "Report uploaded and passed.", status: "completed" },
      ]}
    />
  );
}
