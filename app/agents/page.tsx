import ToolPage from "@/app/components/shared/ToolPage";

export default function AgentsPage() {
  return <ToolPage title="For Agents" description="Agent workflows for linked buyer clients, RFQs, quote follow-up, order tracking, and commission visibility." actions={[{ href: "/agent/dashboard", label: "Open Agent Portal" }, { href: "/register", label: "Register as Agent" }]} items={[{ title: "Client management", body: "Invite and manage buyer clients, then submit inquiries or RFQs on their behalf." }, { title: "Commission tracking", body: "View confirmed order commissions and downloadable statements in the agent portal." }]} />;
}
