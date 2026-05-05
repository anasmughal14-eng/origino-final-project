import AdminQueuePage from "../AdminQueuePage";

export default function AdminCommunityPage() {
  return (
    <AdminQueuePage
      eyebrow="Moderation"
      title="Community Moderation"
      description="Moderate posts, comments, expert badges, pinned discussions, and user bans."
      primaryActionHref="/community"
      primaryActionLabel="View Community"
      records={[
        { id: "post-1", title: "EU documentation checklist thread", subtitle: "Pinned post requested by export advisor.", status: "open" },
        { id: "post-2", title: "Supplier success story comment", subtitle: "Comment flagged for admin moderation.", status: "open", priority: "urgent" },
        { id: "post-3", title: "Webinar announcement", subtitle: "Publish after speaker confirmation.", status: "active" },
      ]}
    />
  );
}
