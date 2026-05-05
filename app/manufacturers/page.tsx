import ToolPage from "@/app/components/shared/ToolPage";

export default function ManufacturersPage() {
  return <ToolPage title="For Manufacturers" description="A seller entry point for Pakistani manufacturers to complete the audit, prepare documentation, list products, and access marketing services." actions={[{ href: "/register?role=seller&redirect=/seller/onboarding", label: "Start Seller Audit" }, { href: "/marketing-packages", label: "View Packages" }]} items={[{ title: "Audit readiness", body: "The six-step onboarding flow checks company basics, certifications, documents, photos, and export readiness." }, { title: "Marketplace listing", body: "Approved suppliers can manage profiles, products, inquiries, quotes, orders, documents, and performance tools." }]} />;
}
