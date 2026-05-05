import MarketplaceClient from "./MarketplaceClient";
import { getSuppliers } from "@/lib/data-service";

type MarketplacePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MarketplacePage({ searchParams = {} }: MarketplacePageProps) {
  return (
    <MarketplaceClient
      suppliers={await getSuppliers()}
      initialFilters={{
        query: firstParam(searchParams.q) ?? firstParam(searchParams.search),
        category: firstParam(searchParams.category),
        city: firstParam(searchParams.city) ?? firstParam(searchParams.cluster),
        tier: firstParam(searchParams.tier) ?? firstParam(searchParams.verification),
        moq: firstParam(searchParams.moq),
        certification: firstParam(searchParams.certification) ?? firstParam(searchParams.cert),
      }}
    />
  );
}
