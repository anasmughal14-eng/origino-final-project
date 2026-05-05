import AdminQueuePage from "../../AdminQueuePage";

export default function AdminThemeEditorPage() {
  return (
    <AdminQueuePage
      eyebrow="Design tokens"
      title="Theme Editor"
      description="Review forest, terracotta, cream, ink, font, and RTL-safe design token override records."
      records={[
        { id: "theme-1", title: "Forest primary", subtitle: "#2d4a3e applied across primary actions.", status: "active" },
        { id: "theme-2", title: "Typography stack", subtitle: "Playfair Display, DM Sans, and Courier Prime loaded.", status: "active" },
        { id: "theme-3", title: "RTL spacing audit", subtitle: "Logical CSS properties review remains open.", status: "open", priority: "urgent" },
      ]}
    />
  );
}
