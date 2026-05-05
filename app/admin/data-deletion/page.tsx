import AdminQueuePage from "../AdminQueuePage";

export default function AdminDataDeletionPage() {
  return (
    <AdminQueuePage
      eyebrow="Privacy operations"
      title="Data Deletion"
      description="Process data deletion requests with 30-day completion SLA, identity verification, and audit trail."
      records={[
        { id: "del-1", title: "Buyer account deletion", subtitle: "Identity check complete; export archive pending.", status: "open", priority: "urgent" },
        { id: "del-2", title: "Seller data export request", subtitle: "Provide profile, order, and inquiry records.", status: "active" },
        { id: "del-3", title: "Completed deletion batch", subtitle: "April deletion requests closed.", status: "completed" },
      ]}
    />
  );
}
