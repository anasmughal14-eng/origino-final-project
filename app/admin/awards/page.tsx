import AdminQueuePage from "../AdminQueuePage";

export default function AdminAwardsPage() {
  return (
    <AdminQueuePage
      eyebrow="Quarterly recognition"
      title="Awards Admin"
      description="Calculate, review, and manually grant quarterly supplier awards before public leaderboard publication."
      primaryActionHref="/awards"
      primaryActionLabel="View Public Awards"
      records={[
        { id: "award-1", title: "Most Responsive", subtitle: "Crescent Surgical Works leads response-rate scoring.", status: "open" },
        { id: "award-2", title: "Sustainability Champion", subtitle: "Review solar and water-recycling badge evidence.", status: "active" },
        { id: "award-3", title: "Best New Entrant", subtitle: "Gujranwala Tools shortlisted for manual review.", status: "open" },
      ]}
    />
  );
}
