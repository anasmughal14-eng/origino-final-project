import ExportDocsClient from "./ExportDocsClient";
import { getExportGuides } from "@/lib/data-service";

export default async function ExportDocsPage() {
  return <ExportDocsClient guides={await getExportGuides()} />;
}
