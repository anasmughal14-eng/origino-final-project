import AdminQueuePage from "../AdminQueuePage";

export default function AdminReferralsPage() {
  return (
    <AdminQueuePage
      eyebrow="Growth loop"
      title="Referrals"
      description="Track referral codes, seller conversions, rewards, agent referrals, and payout status."
      records={[
        { id: "ref-1", title: "Agent referral converted", subtitle: "$30 reward pending payout approval.", status: "open", priority: "urgent" },
        { id: "ref-2", title: "Buyer referral signup", subtitle: "Awaiting first inquiry conversion.", status: "active" },
        { id: "ref-3", title: "April rewards batch", subtitle: "Completed payout batch.", status: "completed" },
      ]}
    />
  );
}
