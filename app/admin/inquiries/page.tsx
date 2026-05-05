import AdminQueuePage from "../AdminQueuePage";

export default function AdminInquiriesPage() {
  return (
    <AdminQueuePage
      eyebrow="Buyer-seller messages"
      title="Inquiries"
      description="Monitor inquiry SLA, spam detection, buyer intent scoring, and supplier response behavior."
      records={[
        { id: "inq-1", title: "CE forceps program", subtitle: "High-intent buyer, seller response within SLA.", status: "active" },
        { id: "inq-2", title: "Hotel towel tender", subtitle: "Supplier reply pending after 36 hours.", status: "open", priority: "urgent" },
        { id: "inq-3", title: "DIN spanner samples", subtitle: "Duplicate inquiry pattern flagged for review.", status: "flagged" },
      ]}
    />
  );
}
