import AdminQueuePage from "../AdminQueuePage";

export default function AdminAnalyticsPage() {
  return (
    <AdminQueuePage
      eyebrow="Platform intelligence"
      title="Analytics"
      description="Review search demand, page views, conversion funnel, PostHog events, and A/B test signals."
      records={[
        { id: "ana-1", title: "Top marketplace searches", subtitle: "Surgical instruments, towels, and leather bags leading buyer demand.", status: "active", priority: "urgent" },
        { id: "ana-2", title: "Homepage CTA experiment", subtitle: "Compare audit-start and marketplace-browse click-through.", status: "active" },
        { id: "ana-3", title: "Supplier profile conversion", subtitle: "Profile view to inquiry conversion by category.", status: "open" },
      ]}
    />
  );
}
