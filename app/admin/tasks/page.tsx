import { getAdminTasks } from "@/lib/data-service";
import AdminTasksClient from "./AdminTasksClient";

export default async function AdminTasksPage() {
  const tasks = await getAdminTasks();
  return <AdminTasksClient tasks={tasks} />;
}
