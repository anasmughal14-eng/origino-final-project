import HomePageClient from "@/app/HomePageClient";
import { getClusters, getPageSections, getProducts, getSuppliers } from "@/lib/data-service";

export default async function HomePage() {
  const [suppliers, products, clusters, pageSections] = await Promise.all([
    getSuppliers(),
    getProducts(),
    getClusters(),
    getPageSections("home"),
  ]);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ORIGINO",
    url: appUrl,
    description: "Pakistan's first curated B2B export marketplace for verified manufacturers.",
    areaServed: ["Pakistan", "European Union", "United Kingdom", "United States", "GCC"],
    knowsAbout: ["Pakistan exports", "Supplier verification", "Export documentation", "B2B sourcing"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePageClient suppliers={suppliers} products={products} clusters={clusters} pageSections={pageSections} />
    </>
  );
}
