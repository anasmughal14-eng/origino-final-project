import ToolPage from "@/app/components/shared/ToolPage";

export default function BuyersPage() {
  return <ToolPage title="For Buyers" description="Source from Pakistan without flying there. Compare verified manufacturers, documents, certifications, response rates, MOQ, lead time, and landed cost before you send one structured inquiry." actions={[{ href: "/marketplace", label: "Browse verified manufacturers" }, { href: "/register?role=buyer&redirect=/buyer/dashboard", label: "Open Buyer Portal" }]} items={[{ title: "Verified sourcing", body: "Use category, city, certification, MOQ, and verification filters to shortlist exporters from Sialkot, Faisalabad, Lahore, Karachi, and Gujranwala." }, { title: "Trade workflow", body: "Track inquiries, quote negotiation, saved suppliers, inspections, and shipment milestones from one portal." }]} />;
}
