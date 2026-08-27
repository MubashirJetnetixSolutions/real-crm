"use client";

import Link from "next/link";
import { useState } from "react";
import AppSelect from "../../components/forms/AppSelect";

interface FollowUpTask {
  id: number;
  lead: string;
  type: string;
  time: string;
  priority: string;
  completed: boolean;
}

const initialTasks: FollowUpTask[] = [
  { id: 1, lead: "Sarah Miller", type: "Call", time: "10:30 AM", priority: "High", completed: false },
  { id: 2, lead: "James Wilson", type: "Email", time: "1:00 PM", priority: "Medium", completed: false },
  { id: 3, lead: "Michael Chen", type: "Meeting", time: "3:45 PM", priority: "High", completed: false },
  { id: 4, lead: "Emily Davis", type: "Call", time: "Yesterday", priority: "Medium", completed: true },
];

function NewTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (task: Omit<FollowUpTask, "id" | "completed">) => void;
}) {
  const [form, setForm] = useState({
    lead: "",
    type: "Call",
    time: "",
    priority: "Medium",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lead.trim() || !form.time.trim()) return;
    onAdd(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">New Task</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">Schedule a follow-up for a lead.</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Lead Name *</label>
            <input
              required
              value={form.lead}
              onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
              placeholder="e.g. Sarah Miller"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Type</label>
              <AppSelect instanceId="followup-type" value={form.type}
                onChange={(v) => setForm((f) => ({ ...f, type: v ?? "Call" }))}
                options={["Call", "Email", "Meeting"].map((t) => ({ value: t, label: t }))} />
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Priority</label>
              <AppSelect instanceId="followup-priority" value={form.priority}
                onChange={(v) => setForm((f) => ({ ...f, priority: v ?? "Medium" }))}
                options={["High", "Medium", "Low"].map((p) => ({ value: p, label: p }))} />
            </div>
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Due Time *</label>
            <input
              required
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              placeholder="e.g. Tomorrow, 2:00 PM"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FollowUpsPage() {
  const [tasks, setTasks] = useState<FollowUpTask[]>(initialTasks);
  const [showNewTask, setShowNewTask] = useState(false);

  const pendingCount = tasks.filter((t) => !t.completed).length;

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleAddTask(task: Omit<FollowUpTask, "id" | "completed">) {
    setTasks((prev) => [
      ...prev,
      { ...task, id: Math.max(0, ...prev.map((t) => t.id)) + 1, completed: false },
    ]);
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="p-8 space-y-6">
      {showNewTask && (
        <NewTaskModal onClose={() => setShowNewTask(false)} onAdd={handleAddTask} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Follow-ups</h1>
          <p className="text-body-md text-secondary mt-1">Manage your daily tasks and lead follow-ups.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/leads" className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">group</span>
            All Leads
          </Link>
          <button
            type="button"
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add_task</span>
            New Task
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden ambient-shadow">
        <div className="border-b border-outline-variant px-6 py-4 bg-surface-bright flex justify-between items-center">
          <h2 className="text-headline-md text-on-surface">Today&apos;s Tasks</h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-sm font-semibold">
            {pendingCount} Pending
          </span>
        </div>

        <div className="divide-y divide-outline-variant">
          {tasks.map((task) => (
            <div key={task.id} className="p-6 hover:bg-surface-bright transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-checked={task.completed}
                  role="checkbox"
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    task.completed
                      ? "bg-primary border-primary text-white"
                      : "border-outline hover:border-primary"
                  }`}
                >
                  {task.completed && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
                <div>
                  <h3 className={`text-label-md ${task.completed ? "line-through text-secondary" : "text-on-surface"}`}>
                    {task.type} with {task.lead}
                  </h3>
                  <p className="text-body-sm text-secondary mt-0.5">
                    {task.time} • Priority: {task.priority}
                  </p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button type="button" className="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
