import MarketplaceClient from "./MarketplaceClient";
import { getMarketplaceStats, getSuppliers } from "@/lib/data-service";
import type { Metadata } from "next";

type MarketplacePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const marketplaceDescription =
  "Browse verified Pakistani manufacturers in surgical instruments, textiles, sporting goods, leather goods and more. Every supplier is audit scored and sanctions screened against OFAC, UN, EU and HMT lists. ORIGINO, Pakistan's curated B2B export marketplace.";

export const metadata: Metadata = {
  title: "Pakistani Manufacturers & Suppliers | Verified B2B Export Marketplace | ORIGINO",
  description: marketplaceDescription,
  alternates: {
    canonical: "https://origino.store/marketplace",
  },
  openGraph: {
    title: "Pakistani Manufacturers & Suppliers | Verified B2B Export Marketplace | ORIGINO",
    description: marketplaceDescription,
    url: "https://origino.store/marketplace",
    type: "website",
    siteName: "ORIGINO",
  },
};

export default async function MarketplacePage({ searchParams = {} }: MarketplacePageProps) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pakistani Manufacturers and Exporters",
    description: "Verified Pakistani manufacturers curated by ORIGINO",
    url: "https://origino.store/marketplace",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <MarketplaceClient
        suppliers={await getSuppliers()}
        stats={await getMarketplaceStats()}
        initialFilters={{
          query: firstParam(searchParams.q) ?? firstParam(searchParams.search),
          category: firstParam(searchParams.category),
          city: firstParam(searchParams.city) ?? firstParam(searchParams.cluster),
          tier: firstParam(searchParams.tier) ?? firstParam(searchParams.verification),
          moq: firstParam(searchParams.moq),
          certification: firstParam(searchParams.certification) ?? firstParam(searchParams.cert),
        }}
      />
    </>
  );
}
