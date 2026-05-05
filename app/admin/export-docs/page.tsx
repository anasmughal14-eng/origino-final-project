import AdminRegistryTool from "../AdminRegistryTool";
import { loadAdminRegistryRecords } from "../registry-data";

const guideRecords = [
  {
    id: "guide-form-e-pakistan",
    name: "Form-E Pakistan",
    category: "Bank documentation",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "Public guide for export remittance and bank processing with issuing authority, common mistakes, and template status.",
    publicHref: "/export-docs/form-e-pakistan",
    adminHref: "/seller/export-docs",
    metrics: ["Public", "Seller checklist", "Template"],
  },
  {
    id: "guide-ce-marking-pakistan",
    name: "CE Marking Pakistan",
    category: "EU compliance",
    status: "review" as const,
    owner: "Compliance Ops",
    summary: "EU compliance guide for surgical instruments and electronics; video/tutorial section needs final review.",
    publicHref: "/export-docs/ce-marking-pakistan",
    metrics: ["EU", "Sialkot", "Review"],
  },
  {
    id: "guide-gsp-plus-certificate",
    name: "GSP+ Certificate",
    category: "Preferential tariff",
    status: "active" as const,
    owner: "Policy Ops",
    summary: "EU preferential tariff guide linked to landed cost calculator savings and seller document vault status.",
    publicHref: "/export-docs/gsp-plus-certificate",
    adminHref: "/landed-cost",
    metrics: ["EU", "GSP+", "Calculator-linked"],
  },
  {
    id: "guide-phytosanitary-certificate",
    name: "Phytosanitary Certificate",
    category: "Food & Agriculture",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "Agriculture and food export certificate guide for Karachi agro suppliers and Middle East buyers.",
    publicHref: "/export-docs/phytosanitary-certificate",
    metrics: ["Food", "Karachi", "Authority link"],
  },
  {
    id: "guide-certificate-of-origin",
    name: "Certificate of Origin",
    category: "Core export document",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "TDAP and Chamber of Commerce origin proof guide linked to GSP+ and buyer landed-cost evidence.",
    publicHref: "/export-docs/certificate-of-origin",
    adminHref: "/seller/export-docs",
    metrics: ["TDAP", "Chamber", "Origin proof"],
  },
  {
    id: "guide-dtre-registration",
    name: "DTRE Registration",
    category: "Tax relief",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "FBR duty remission guide connected to government schemes and seller document vault readiness.",
    publicHref: "/export-docs/dtre-registration",
    adminHref: "/admin/government-schemes",
    metrics: ["FBR", "Duty remission", "Scheme-linked"],
  },
  {
    id: "guide-hs-code-lookup",
    name: "HS Code Lookup",
    category: "Classification",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "HS classification guide used by landed cost, product detail specs, Form-E, and quote/order documents.",
    publicHref: "/export-docs/hs-code-lookup",
    adminHref: "/landed-cost",
    metrics: ["HS", "Calculator", "Quote-linked"],
  },
  {
    id: "guide-halal-certification",
    name: "Halal Certification",
    category: "Food compliance",
    status: "active" as const,
    owner: "Compliance Ops",
    summary: "Food and agriculture guide for Middle East and Malaysia buyers, connected to Karachi agro listings.",
    publicHref: "/export-docs/halal-certification",
    adminHref: "/admin/suppliers",
    metrics: ["Food", "GCC", "Malaysia"],
  },
  {
    id: "guide-fda-registration",
    name: "FDA Registration",
    category: "USA compliance",
    status: "review" as const,
    owner: "Compliance Ops",
    summary: "FDA guide for food, pharma, and medical exporters; kept in review for product-specific warning copy.",
    publicHref: "/export-docs/fda-registration",
    adminHref: "/admin/tasks",
    metrics: ["USA", "FDA", "Review"],
  },
];

export default async function AdminExportDocsPage() {
  const records = await loadAdminRegistryRecords("export-docs", guideRecords);

  return (
    <AdminRegistryTool
      eyebrow="Documentation CMS"
      title="Export Documentation"
      description="Manage public export guides, Urdu variants, template availability, issuing authority links, and seller checklist connections."
      registryKey="export-docs"
      records={records}
      addLabel="Add Guide"
      publishLabel="Publish"
      externalHref="/export-docs"
      externalLabel="View Public Hub"
    />
  );
}
