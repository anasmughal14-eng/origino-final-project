import AdminQueuePage from "../AdminQueuePage";

export default function AdminApiKeysPage() {
  return (
    <AdminQueuePage
      eyebrow="Enterprise access"
      title="API Keys"
      description="Manage enterprise buyer keys, seller API access, hashed credentials, and rate limit metadata."
      records={[
        { id: "key-1", title: "Hansa buyer API key", subtitle: "Read-only supplier catalog access with 100 requests/hour.", status: "active" },
        { id: "key-2", title: "Crescent stock webhook key", subtitle: "Seller ERP stock sync key awaiting rotation.", status: "open", priority: "urgent" },
        { id: "key-3", title: "Agent reporting key", subtitle: "Commission export integration for agent portal.", status: "paused" },
      ]}
    />
  );
}
