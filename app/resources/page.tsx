import ToolPage from "@/app/components/shared/ToolPage";

export default function ResourcesPage() {
  return <ToolPage title="Resource Library" description="Central resource hub for export guides, government schemes, community posts, journal articles, landed-cost tools, and supplier awards." actions={[{ href: "/export-docs", label: "Export Guides" }, { href: "/blog", label: "Journal" }]} items={[{ title: "Documentation hub", body: "Pakistan-specific guides for Form-E, GSP+, CE, FDA, Halal, DTRE, and certificates of origin." }, { title: "Knowledge layer", body: "Community posts, buyer education, logistics notes, and landed-cost planning are linked from here." }]} />;
}
