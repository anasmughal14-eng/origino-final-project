import ToolPage from "@/app/components/shared/ToolPage";

export default function CampaignPage({ params }: { params: { slug: string } }) {
  return <ToolPage eyebrow="Campaign" title={params.slug.replace(/-/g, " ")} description="Seasonal sourcing campaign landing page for promoted categories, clusters, and buyer-seller matchmaking." actions={[{ href: "/marketplace", label: "Browse Suppliers" }]} />;
}
