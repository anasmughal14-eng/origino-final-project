import AdminRegistryTool from "../AdminRegistryTool";
import { loadAdminRegistryRecords } from "../registry-data";

const schemeRecords = [
  {
    id: "scheme-tdap-edf",
    name: "TDAP Export Development Fund",
    category: "Marketing support",
    status: "active" as const,
    owner: "Policy Ops",
    summary: "SME export marketing subsidy shown to eligible sellers by category, cluster, and years in business.",
    adminHref: "/seller/government-schemes",
    metrics: ["TDAP", "SME", "Marketing"],
  },
  {
    id: "scheme-sbp-efs",
    name: "SBP Export Finance Scheme",
    category: "Trade finance",
    status: "review" as const,
    owner: "Finance Ops",
    summary: "Concessionary export finance rate and eligibility copy must stay aligned with current SBP guidance.",
    adminHref: "/admin/trade-finance",
    metrics: ["SBP", "Finance", "Rate review"],
  },
  {
    id: "scheme-dtre-registration",
    name: "DTRE Registration",
    category: "Duty remission",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "FBR duty and tax remission scheme linked to export documentation guides and seller document checklists.",
    publicHref: "/export-docs/dtre-registration",
    adminHref: "/seller/export-docs",
    metrics: ["FBR", "DTRE", "Docs-linked"],
  },
  {
    id: "scheme-smeda-support",
    name: "SMEDA SME Support Program",
    category: "Business development",
    status: "active" as const,
    owner: "Policy Ops",
    summary: "Business development grant and training program surfaced to SME exporters in seller eligibility cards.",
    adminHref: "/seller/government-schemes",
    metrics: ["SMEDA", "SME", "Training"],
  },
  {
    id: "scheme-tdap-buyer-seller",
    name: "TDAP Buyer-Seller Meets",
    category: "Matchmaking",
    status: "active" as const,
    owner: "Seller Success",
    summary: "Matchmaking event program linked to supplier recruitment, agent referrals, and buyer introduction workflows.",
    adminHref: "/admin/agents",
    metrics: ["TDAP", "Events", "Buyer intros"],
  },
  {
    id: "scheme-pm-export-facilitation",
    name: "PM Export Facilitation Scheme",
    category: "Export support",
    status: "review" as const,
    owner: "Policy Ops",
    summary: "Policy record kept in review so copy, deadlines, and eligibility can be confirmed before seller publication.",
    adminHref: "/admin/tasks",
    metrics: ["Policy review", "Deadline check"],
  },
  {
    id: "scheme-tuf",
    name: "Technology Upgradation Fund",
    category: "Textile machinery",
    status: "active" as const,
    owner: "Policy Ops",
    summary: "Textile machinery support shown to Faisalabad sellers when category and capital-expansion signals match.",
    adminHref: "/admin/suppliers",
    metrics: ["Textiles", "Machinery", "Faisalabad"],
  },
  {
    id: "scheme-export-refund",
    name: "Export Refund Scheme",
    category: "Tax refund",
    status: "active" as const,
    owner: "Finance Ops",
    summary: "Sales tax refund guidance connected to FBR invoice generation and export documentation workflows.",
    publicHref: "/export-docs/form-e-pakistan",
    adminHref: "/admin/export-docs",
    metrics: ["FBR", "Refund", "Invoice-linked"],
  },
  {
    id: "scheme-ltff",
    name: "Long Term Financing Facility",
    category: "Plant financing",
    status: "review" as const,
    owner: "Finance Ops",
    summary: "SBP plant and machinery financing record reviewed with trade-finance eligibility and repayment controls.",
    adminHref: "/admin/trade-finance",
    metrics: ["SBP", "LTFF", "Machinery"],
  },
];

export default async function AdminGovernmentSchemesPage() {
  const records = await loadAdminRegistryRecords("government-schemes", schemeRecords);

  return (
    <AdminRegistryTool
      eyebrow="Public programs"
      title="Government Schemes"
      description="Manage TDAP, SMEDA, SBP, DTRE, TUF, LTFF, and TERF records that feed seller eligibility cards and documentation guidance."
      registryKey="government-schemes"
      records={records}
      addLabel="Add Scheme"
      publishLabel="Publish"
      externalHref="/seller/government-schemes"
      externalLabel="Seller View"
    />
  );
}
