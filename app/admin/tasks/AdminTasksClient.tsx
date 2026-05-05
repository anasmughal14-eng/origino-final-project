"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { AdminTask } from "@/lib/mock-data";

const assignees = ["Admin Ops", "Compliance", "Document Vault", "Growth Team", "Account Management"];
const taskTypes: AdminTask["type"][] = ["sla_breach", "sanctions_review", "document_expiry", "application_review", "manual_follow_up"];
const entityTypes: AdminTask["linked_entity_type"][] = ["marketing_order", "application", "supplier", "document", "escrow"];

const emptyTask: Omit<AdminTask, "id" | "created_at"> = {
  title: "",
  type: "manual_follow_up",
  priority: "medium",
  status: "open",
  assigned_to: null,
  linked_entity_type: "supplier",
  linked_entity_id: "",
  linked_href: "/admin/suppliers",
  due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  notes: "",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function priorityClass(priority: AdminTask["priority"]) {
  if (priority === "urgent" || priority === "high") return "stamp-reject";
  if (priority === "medium") return "stamp-pending";
  return "stamp-approve";
}

function statusClass(status: AdminTask["status"]) {
  if (status === "completed") return "stamp-approve";
  if (status === "blocked") return "stamp-reject";
  return "stamp-pending";
}

export default function AdminTasksClient({ tasks }: { tasks: AdminTask[] }) {
  const [items, setItems] = useState(tasks);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AdminTask["status"] | "all">("all");
  const [priority, setPriority] = useState<AdminTask["priority"] | "all">("all");
  const [assignee, setAssignee] = useState("all");
  const [entityType, setEntityType] = useState<AdminTask["linked_entity_type"] | "all">("all");
  const [editingId, setEditingId] = useState("");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [newTask, setNewTask] = useState(emptyTask);
  const [loadingId, setLoadingId] = useState("");
  const [stampId, setStampId] = useState("");

  const filtered = useMemo(() => items.filter((task) => {
    const haystack = `${task.title} ${task.type} ${task.priority} ${task.status} ${task.assigned_to ?? ""} ${task.linked_entity_id}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (status === "all" || task.status === status)
      && (priority === "all" || task.priority === priority)
      && (assignee === "all" || (assignee === "unassigned" ? !task.assigned_to : task.assigned_to === assignee))
      && (entityType === "all" || task.linked_entity_type === entityType);
  }), [assignee, entityType, items, priority, query, status]);

  const urgent = items.filter((task) => task.priority === "urgent" && task.status !== "completed").length;
  const open = items.filter((task) => task.status !== "completed").length;
  const blocked = items.filter((task) => task.status === "blocked").length;

  async function patchTask(id: string, update: Partial<AdminTask>, message: string) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Task update failed");
      setItems((list) => list.map((task) => task.id === id ? { ...task, ...update } : task));
      setStampId(id);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Task update failed");
    } finally {
      setLoadingId("");
    }
  }

  async function createTask() {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!newTask.linked_entity_id.trim()) {
      toast.error("Linked entity id is required");
      return;
    }
    if (!newTask.notes?.trim()) {
      toast.error("Task note is required");
      return;
    }

    setLoadingId("new-task");
    try {
      const taskToCreate = {
        ...newTask,
        linked_href: newTask.linked_href || `/admin/${newTask.linked_entity_type.replace("_", "-")}s`,
        due_at: new Date(newTask.due_at).toISOString(),
      };
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToCreate),
      });
      const payload = await response.json() as { success: boolean; data?: AdminTask; error?: string };
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error ?? "Task creation failed");
      setItems((list) => [payload.data as AdminTask, ...list]);
      setStampId(payload.data.id);
      setCreating(false);
      setNewTask(emptyTask);
      toast.success("Task created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Task creation failed");
    } finally {
      setLoadingId("");
    }
  }

  function openNote(task: AdminTask) {
    setEditingId(task.id);
    setNote(task.notes ?? "");
  }

  async function saveNote() {
    if (!note.trim()) {
      toast.error("Task note is required");
      return;
    }
    await patchTask(editingId, { notes: note }, "Task note saved");
    setEditingId("");
    setNote("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Task Management</span>
          <h1 className="mt-4 text-4xl">Tasks</h1>
          <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">Central queue for SLA breaches, sanctions review, document expiry, application review, and manual follow-ups.</p>
          <button className="btn-pill btn-pill-forest mt-5 min-h-[44px]" onClick={() => setCreating(true)}>Create Task</button>
        </div>
        <div className="grid gap-3 text-right sm:grid-cols-3">
          <div><p className="metric-numeral text-3xl">{open}</p><p className="small-caps text-sm">Open</p></div>
          <div><p className="metric-numeral text-3xl text-[var(--terracotta)]">{urgent}</p><p className="small-caps text-sm">Urgent</p></div>
          <div><p className="metric-numeral text-3xl">{blocked}</p><p className="small-caps text-sm">Blocked</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, entity, assignee" />
        <select className="input-editorial" value={status} onChange={(event) => setStatus(event.target.value as AdminTask["status"] | "all")}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
        </select>
        <select className="input-editorial" value={priority} onChange={(event) => setPriority(event.target.value as AdminTask["priority"] | "all")}>
          <option value="all">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="input-editorial" value={assignee} onChange={(event) => setAssignee(event.target.value)}>
          <option value="all">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {assignees.map((person) => <option key={person} value={person}>{person}</option>)}
        </select>
        <select className="input-editorial" value={entityType} onChange={(event) => setEntityType(event.target.value as AdminTask["linked_entity_type"] | "all")}>
          <option value="all">All linked types</option>
          {entityTypes.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
        </select>
      </div>

      <div className="mt-8 overflow-x-auto border">
        <table className="w-full min-w-[1120px] border-collapse text-sm">
          <thead className="border-b bg-[var(--cream)] text-left">
            <tr>
              <th className="p-4">Task</th>
              <th className="p-4">Type</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Linked Entity</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Due</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task) => (
              <tr className="border-b align-top" key={task.id}>
                <td className="p-4">
                  <p className="font-semibold">{task.title}</p>
                  <p className="mt-2 text-xs text-[var(--ink-muted)]">{task.notes}</p>
                  {stampId === task.id && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Updated</p>}
                </td>
                <td className="p-4"><span className="badge-patch">{task.type.replace("_", " ")}</span></td>
                <td className="p-4"><span className={`badge-patch ${priorityClass(task.priority)}`}>{task.priority}</span></td>
                <td className="p-4"><span className={`badge-patch ${statusClass(task.status)}`}>{task.status.replace("_", " ")}</span></td>
                <td className="p-4">
                  <Link className="font-semibold underline-offset-4 hover:underline" href={task.linked_href}>{task.linked_entity_id}</Link>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">{task.linked_entity_type.replace("_", " ")}</p>
                </td>
                <td className="p-4">
                  <select className="input-editorial min-w-[170px]" value={task.assigned_to ?? ""} onChange={(event) => patchTask(task.id, { assigned_to: event.target.value || null, status: event.target.value ? "in_progress" : task.status }, "Task assigned")} disabled={loadingId === task.id}>
                    <option value="">Unassigned</option>
                    {assignees.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
                  </select>
                </td>
                <td className="p-4">{formatDate(task.due_at)}</td>
                <td className="p-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button className="btn-pill btn-pill-outline min-h-[44px] px-5" onClick={() => openNote(task)}>{task.notes ? "Edit Note" : "Note"}</button>
                    <button className="btn-pill btn-pill-outline min-h-[44px] px-5 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => patchTask(task.id, { status: "blocked" }, "Task blocked")} disabled={task.status === "blocked" || task.status === "completed" || loadingId === task.id}>{task.status === "blocked" ? "Blocked" : "Block"}</button>
                    <button className="btn-pill btn-pill-forest min-h-[44px] px-5 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => patchTask(task.id, { status: "completed" }, "Task completed")} disabled={task.status === "completed" || loadingId === task.id}>{task.status === "completed" ? "Completed" : "Complete"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <div className="mt-6 border p-6 text-center">No tasks match this filter.</div>}

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-xl">
            <span className="badge-patch">Task Note</span>
            <h2 className="mt-4 text-3xl">Update Task Note</h2>
            <textarea className="input-editorial mt-4 min-h-[130px]" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add follow-up notes, decision, or blocker" />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setEditingId("")}>Cancel</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={saveNote} disabled={loadingId === editingId}>{loadingId === editingId ? "Saving..." : "Save Note"}</button>
            </div>
          </div>
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-3xl">
            <span className="badge-patch">Manual Task</span>
            <h2 className="mt-4 text-3xl">Create Admin Task</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className="input-editorial md:col-span-2" value={newTask.title} onChange={(event) => setNewTask((task) => ({ ...task, title: event.target.value }))} placeholder="Task title" />
              <select className="input-editorial" value={newTask.type} onChange={(event) => setNewTask((task) => ({ ...task, type: event.target.value as AdminTask["type"] }))}>
                {taskTypes.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
              </select>
              <select className="input-editorial" value={newTask.priority} onChange={(event) => setNewTask((task) => ({ ...task, priority: event.target.value as AdminTask["priority"] }))}>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select className="input-editorial" value={newTask.assigned_to ?? ""} onChange={(event) => setNewTask((task) => ({ ...task, assigned_to: event.target.value || null, status: event.target.value ? "in_progress" : "open" }))}>
                <option value="">Unassigned</option>
                {assignees.map((person) => <option key={person} value={person}>{person}</option>)}
              </select>
              <input className="input-editorial" type="datetime-local" value={newTask.due_at} onChange={(event) => setNewTask((task) => ({ ...task, due_at: event.target.value }))} />
              <select className="input-editorial" value={newTask.linked_entity_type} onChange={(event) => setNewTask((task) => ({ ...task, linked_entity_type: event.target.value as AdminTask["linked_entity_type"] }))}>
                {entityTypes.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
              </select>
              <input className="input-editorial" value={newTask.linked_entity_id} onChange={(event) => setNewTask((task) => ({ ...task, linked_entity_id: event.target.value }))} placeholder="Linked entity id, e.g. app-2" />
              <input className="input-editorial md:col-span-2" value={newTask.linked_href} onChange={(event) => setNewTask((task) => ({ ...task, linked_href: event.target.value }))} placeholder="/admin/applications/app-2" />
              <textarea className="input-editorial min-h-[120px] md:col-span-2" value={newTask.notes ?? ""} onChange={(event) => setNewTask((task) => ({ ...task, notes: event.target.value }))} placeholder="Task note or decision context" />
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setCreating(false)}>Cancel</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={createTask} disabled={loadingId === "new-task"}>{loadingId === "new-task" ? "Creating..." : "Create Task"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
