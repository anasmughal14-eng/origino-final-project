import ToolPage from "@/app/components/shared/ToolPage";

export default function TermsPage() {
  return <ToolPage eyebrow="Legal" title="Terms of Service" description="Terms page covering seller agreement acceptance, buyer sourcing workflows, commissions, escrow, inspections, and acceptable platform use." items={[{ title: "Seller obligations", body: "Sellers must keep profiles accurate, report confirmed orders, and maintain document validity." }, { title: "Buyer obligations", body: "Buyers must submit accurate inquiries, honor accepted quotes, and use inspection/escrow flows responsibly." }]} />;
}
