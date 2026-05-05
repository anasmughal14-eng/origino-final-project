import ToolPage from "@/app/components/shared/ToolPage";

export default function RefundPage() {
  return <ToolPage eyebrow="Legal" title="Refund Policy" description="Refund and milestone coverage for Basic, Growth, Premium, local payments, Stripe checkout, and escrow-related service orders." items={[{ title: "Marketing services", body: "Growth and Premium can be milestone-based once real payment persistence is connected." }, { title: "Escrow flows", body: "Trade escrow release and disputes are managed through the admin escrow route." }]} />;
}
