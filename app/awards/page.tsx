import AwardsClient from "./AwardsClient";
import { getAwards, getSuppliers } from "@/lib/data-service";

export default async function AwardsPage() {
  return <AwardsClient awards={await getAwards()} suppliers={await getSuppliers()} />;
}
