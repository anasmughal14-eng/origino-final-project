import AuditTool from "@/app/components/audit/AuditTool";

export const metadata = {
  title: "AI Export Readiness Audit | ORIGINO",
  description: "Score Pakistani manufacturers against ORIGINO's export-readiness criteria before marketplace listing.",
};

export default function AuditPage() {
  return <AuditTool />;
}
