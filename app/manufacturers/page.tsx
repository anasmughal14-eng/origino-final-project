import ToolPage from "@/app/components/shared/ToolPage";

export default function ManufacturersPage() {
  return <ToolPage title="For Manufacturers" description="A seller entry point for Pakistani manufacturers who make well, but need clearer presentation, documentation, and buyer visibility around the work." actions={[{ href: "/register?role=seller&redirect=/seller/onboarding", label: "Create Seller Account" }, { href: "/marketing-packages", label: "Choose Support" }]} items={[{ title: "Readiness audit", body: "The audit shows where the manufacturer stands across brand, digital presence, export history, product readiness, operations, and compliance." }, { title: "Marketing support", body: "Basic, Growth, and Premium packages help with the work around the product: identity, photography, catalogue, website, and buyer introductions." }, { title: "Marketplace listing", body: "Public listing still depends on readiness score, documents, sanctions checks, and admin review." }]} />;
}
