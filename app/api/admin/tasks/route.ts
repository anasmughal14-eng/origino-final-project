import { created, fail, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { AdminTask } from "@/lib/mock-data";

function normaliseEntityType(value: unknown): AdminTask["linked_entity_type"] {
  const text = String(value ?? "supplier").replace("-", "_");
  if (text === "marketing") return "marketing_order";
  if (text === "admin_task" || text === "manual_follow_up") return "supplier";
  if (["marketing_order", "application", "supplier", "document", "escrow"].includes(text)) {
    return text as AdminTask["linked_entity_type"];
  }
  return "supplier";
}

export async function POST(request: Request) {
  try {
    const body = await readJson<Partial<AdminTask> & { linkedEntity?: string; linkedEntityType?: string }>(request);
    if (!body.title) return fail("title is required", 400);
    if (!body.type) return fail("type is required", 400);
    if (!body.priority) return fail("priority is required", 400);
    const linkedEntityId = body.linked_entity_id ?? body.linkedEntity;
    if (!linkedEntityId) return fail("linked_entity_id is required", 400);
    const linkedEntityType = normaliseEntityType(body.linked_entity_type ?? body.linkedEntityType ?? body.type);
    const dueAt = body.due_at ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const notes = body.notes ?? "Created from the admin task queue.";

    const task: AdminTask = {
      id: `task-${Date.now()}`,
      title: body.title,
      type: body.type,
      priority: body.priority,
      status: body.status ?? "open",
      assigned_to: body.assigned_to ?? null,
      linked_entity_type: linkedEntityType,
      linked_entity_id: linkedEntityId,
      linked_href: body.linked_href ?? "/admin/tasks",
      due_at: dueAt,
      notes,
      created_at: new Date().toISOString(),
    };

    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("admin_tasks")
        .insert({
          title: task.title,
          type: task.type,
          priority: task.priority,
          status: task.status,
          assigned_to: task.assigned_to,
          linked_entity_type: task.linked_entity_type,
          linked_entity_id: task.linked_entity_id,
          linked_href: task.linked_href,
          due_at: task.due_at,
          notes: task.notes,
        })
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return created(data);
    }

    return created(task);
  } catch {
    return fail("Unable to create task", 500);
  }
}
