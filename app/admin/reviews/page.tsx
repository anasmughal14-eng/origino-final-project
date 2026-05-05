import AdminQueuePage from "../AdminQueuePage";

export default function AdminReviewsPage() {
  return (
    <AdminQueuePage
      eyebrow="Trust moderation"
      title="Reviews"
      description="Moderate supplier ratings, buyer feedback, published reviews, and abuse flags."
      records={[
        { id: "review-1", title: "Crescent Surgical Works review", subtitle: "Five-star buyer review ready for publish.", status: "open" },
        { id: "review-2", title: "Leather shipment complaint", subtitle: "Buyer feedback flagged for dispute context.", status: "flagged", priority: "urgent" },
        { id: "review-3", title: "Karachi Agro Foods review", subtitle: "Published review with verified order link.", status: "completed" },
      ]}
    />
  );
}
