import ToolPage from "@/app/components/shared/ToolPage";

export default function ManufacturersPage() {
  return <ToolPage title="For Manufacturers" description="Serious international buyers from Europe, the US, and the Gulf find you through ORIGINO without cold outreach, trade show flights, or unvetted agents." actions={[{ href: "/register?role=seller&redirect=/seller/onboarding", label: "Create Seller Account" }, { href: "/marketing-packages", label: "Choose Support" }]} items={[{ title: "Readiness audit", body: "The 10-minute audit scores brand, digital presence, export history, product readiness, capacity, and compliance." }, { title: "Marketing support", body: "Foundation, Transformation, and Access packages handle identity, photography, catalogue, website, and buyer introductions." }, { title: "Marketplace listing", body: "Public listing still depends on readiness score, documents, OFAC, UN, EU, and HMT sanctions checks, and admin review." }]} />;
}
