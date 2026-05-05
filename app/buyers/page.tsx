import ToolPage from "@/app/components/shared/ToolPage";

export default function BuyersPage() {
  return <ToolPage title="For Buyers" description="Buyer tools for finding verified Pakistani suppliers, comparing options, managing inquiries, quotes, orders, inspections, and landed-cost planning." actions={[{ href: "/marketplace", label: "Browse Marketplace" }, { href: "/register?role=buyer&redirect=/buyer/dashboard", label: "Open Buyer Portal" }]} items={[{ title: "Verified sourcing", body: "Use category, city, certification, MOQ, and verification filters to shortlist exporters." }, { title: "Trade workflow", body: "Track inquiries, quote negotiation, saved suppliers, inspections, and shipment milestones from one portal." }]} />;
}
