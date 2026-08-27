"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeaderActions from "../../components/PageHeaderActions";
import { api, ApiClientError } from "../../lib/apiClient";
import { initialsOf } from "../../lib/format";
import { useToast } from "../../components/ToastProvider";
import AppSelect from "../../components/forms/AppSelect";
import type { LeadDTO, LeadStatus } from "@/types/leads";

interface Task {
  id: string;
  type: "call" | "calendar_today" | "mail";
  title: string;
  time: string;
  desc: string;
  completed: boolean;
}

interface Activity {
  id: string;
  type: "forum" | "phone_in_talk" | "mail";
  title: string;
  time: string;
  desc: string;
  meta?: string;
}

const STATUS_BADGES: Record<LeadStatus, { classes: string; icon: string; label: string }> = {
  Hot: { classes: "bg-error-container text-on-error-container", icon: "local_fire_department", label: "Hot Lead" },
  Warm: { classes: "bg-primary-container text-on-primary-container", icon: "local_fire_department", label: "Warm Lead" },
  Cold: { classes: "bg-surface-container-highest text-on-surface-variant", icon: "ac_unit", label: "Cold Lead" },
};

function AddTaskModal({
  leadName,
  onClose,
  onAdd,
}: {
  leadName: string;
  onClose: () => void;
  onAdd: (task: Omit<Task, "id" | "completed">) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    time: "Tomorrow, 2:00 PM",
    type: "call" as Task["type"],
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Add New Task</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">Schedule a follow-up for {leadName}.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Task Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Follow-up Call"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              placeholder="What needs to be done..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-outline"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Due Time</label>
              <input
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                placeholder="Tomorrow, 2:00 PM"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Type</label>
              <AppSelect
                instanceId="task-type"
                value={form.type}
                onChange={(v) => setForm((f) => ({ ...f, type: (v ?? "call") as Task["type"] }))}
                options={[
                  { value: "call", label: "Call" },
                  { value: "calendar_today", label: "Meeting" },
                  { value: "mail", label: "Email" },
                ]}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10">
        <div className="p-6">
          <h2 className="text-headline-md font-bold text-on-surface mb-2">{title}</h2>
          <p className="text-body-md text-on-surface-variant leading-relaxed">{message}</p>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">No</button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { success: showToast, error: toastError } = useToast();

  const [lead, setLead] = useState<LeadDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newNote, setNewNote] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [converted, setConverted] = useState(false);

  useEffect(() => {
    const leadId = Number(params.id);
    if (!Number.isInteger(leadId) || leadId <= 0) {
      setMissing(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    api
      .get<LeadDTO>(`/api/leads/${leadId}`)
      .then(({ data }) => {
        if (cancelled) return;
        setLead(data);
        if (data.notes) {
          setActivities([
            {
              id: "act-notes",
              type: "forum",
              title: "Lead Notes",
              time: "From lead record",
              desc: data.notes,
            },
          ]);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 404) {
          setMissing(true);
        } else {
          toastError(err instanceof ApiClientError ? err.message : "Failed to load the lead.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (missing) notFound();

  if (loading || !lead) {
    return (
      <main className="page-padding pb-8 sm:pb-12">
        <div className="mb-8 space-y-3 animate-pulse pt-6">
          <div className="h-3 w-40 bg-surface-container-high rounded" />
          <div className="h-8 w-64 bg-surface-container-high rounded" />
        </div>
        <div className="grid grid-cols-12 gap-gutter animate-pulse">
          <div className="col-span-12 lg:col-span-4 space-y-gutter">
            <div className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding h-[420px]" />
            <div className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding h-56" />
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-gutter">
            <div className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding h-[420px]" />
            <div className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding h-48" />
          </div>
          <div className="col-span-12 lg:col-span-3 space-y-gutter">
            <div className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding h-80" />
            <div className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding h-64" />
          </div>
        </div>
      </main>
    );
  }

  const badge = STATUS_BADGES[lead.status] ?? STATUS_BADGES.Warm;

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setActivities([
      {
        id: `act-${Date.now()}`,
        type: "forum",
        title: "Internal Note Added",
        time: "Just now",
        desc: newNote,
      },
      ...activities,
    ]);
    setNewNote("");
  };

  const handleAddTask = (task: Omit<Task, "id" | "completed">) => {
    setTasks([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        ...task,
        completed: false,
      },
    ]);
    showToast("Task added successfully!");
  };

  const handleConvertClient = () => {
    setConverted(true);
    showToast(`${lead.name} has been successfully converted into a client.`);
  };

  const createDealHref = `/deals/add?lead=${encodeURIComponent(lead.name)}${lead.propertyInterest ? `&property=${encodeURIComponent(lead.propertyInterest)}` : ""}`;

  return (
    <>
      {showAddTask && (
        <AddTaskModal
          leadName={lead.name}
          onClose={() => setShowAddTask(false)}
          onAdd={handleAddTask}
        />
      )}
      {showConvertConfirm && (
        <ConfirmModal
          title="Convert to Client?"
          message={`Are you sure you want to convert ${lead.name} from a lead into a client? This will move them to your client list.`}
          confirmLabel="Yes, Convert"
          onConfirm={handleConvertClient}
          onClose={() => setShowConvertConfirm(false)}
        />
      )}

      {/* TopNavBar */}
      <header className="app-fixed-header bg-surface flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 lg:px-gutter py-3 sm:py-0 sm:min-h-[5rem] z-40 border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
            <input
              className={`bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 w-full sm:w-64 text-body-md focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${searchFocused ? "sm:w-80 lg:w-[400px]" : "sm:w-64"}`}
              placeholder="Search for leads, deals, or properties..."
              type="text"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-6">
          <PageHeaderActions />
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-label-md font-label-md text-on-surface">Jetnetix</p>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Admin Profile</p>
            </div>
            <img
              alt="Jetnetix user profile"
              className="w-10 h-10 rounded-full border border-outline-variant object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS68ZOIMAWzar66WhBMHMnOl1QyqW6uTw_uO9yyXsoOyyvLZWar1s9fYpwPvEo9_BeOkSD6LLdxirKV4BNcaPSioy7Moi1jOX5hOykY12M_sMwoZrkT2DGDgXPSnLPdKXdRC85vE3PWwFhG4pBMyJ1-9vkqtdpRSuIdTytG19P9KMG4B3GtqZcQfbPlxLKtF8eySv9yyomQIdwgElkGjFnnBozuV_47HpBmaFIqRdyV6hHbmeU_ACJZTw3ZAuqDvyzjEC2LkNUNAQ9"
            />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="page-padding pb-8 sm:pb-12">
        {/* Breadcrumbs & Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-label-sm font-label-sm text-outline mb-2">
              <Link className="hover:text-primary transition-colors" href="/leads">
                Leads
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">{lead.name}</span>
            </nav>
            <div className="flex items-center gap-4">
              <h2 className="text-headline-xl font-headline-xl text-on-surface">{lead.name}</h2>
              <span className={`px-3 py-1 ${badge.classes} rounded-full text-label-sm font-label-sm flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {badge.icon}
                </span>
                {badge.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(createDealHref)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-label-md font-label-md hover:bg-surface-container-high transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              Create Deal
            </button>
            <button
              type="button"
              onClick={() => setShowConvertConfirm(true)}
              disabled={converted}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-label-md hover:brightness-110 soft-shadow transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              {converted ? "Converted to Client" : "Convert to Client"}
            </button>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Profile Card (Left Column) */}
          <div className="col-span-12 lg:col-span-4 space-y-gutter">
            <section className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-primary-container opacity-10"></div>
              <div className="relative flex flex-col items-center pt-4 mb-8">
                {lead.avatarUrl ? (
                  <img
                    alt={`${lead.name} Avatar`}
                    className="w-24 h-24 rounded-full border-4 border-surface-container-lowest soft-shadow object-cover mb-4"
                    src={lead.avatarUrl}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-surface-container-lowest soft-shadow bg-secondary-container flex items-center justify-center text-primary font-bold text-headline-lg mb-4">
                    {initialsOf(lead.name)}
                  </div>
                )}
                <h4 className="text-headline-lg font-headline-lg text-on-surface font-semibold">{lead.name}</h4>
                <p className="text-body-md font-body-md text-on-surface-variant">Individual Lead</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/20 rounded-lg">mail</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-outline">Email Address</p>
                      <p className="text-body-md font-body-md text-on-surface">{lead.email ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/20 rounded-lg">call</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-outline">Phone Number</p>
                      <p className="text-body-md font-body-md text-on-surface">{lead.phone ?? "—"}</p>
                    </div>
                  </div>
                </div>
                <hr className="border-outline-variant/30" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-label-sm font-label-sm text-outline mb-1">Budget</p>
                    <p className="text-headline-md font-headline-md text-on-surface">{lead.budget ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm text-outline mb-1">Source</p>
                    <p className="text-body-md font-body-md text-on-surface">{lead.source ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm text-outline mb-1">Preferred Type</p>
                    <p className="text-body-md font-body-md text-on-surface">{lead.propertyInterest ?? "Any"}</p>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm text-outline mb-1">Location</p>
                    <p className="text-body-md font-body-md text-on-surface">{lead.preferredLocation ?? "—"}</p>
                  </div>
                </div>
                <div className="p-4 bg-surface-container rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {lead.agentAvatar ? (
                      <img
                        alt={`${lead.agentName ?? "Agent"} Avatar`}
                        className="w-10 h-10 rounded-full object-cover"
                        src={lead.agentAvatar}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-outline">person</span>
                      </div>
                    )}
                    <div>
                      <p className="text-label-sm font-label-sm text-outline">Assigned Agent</p>
                      <p className="text-body-md font-body-md text-on-surface font-semibold">{lead.agentName ?? "Unassigned"}</p>
                    </div>
                  </div>
                  <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">message</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Tasks & Follow-ups */}
            <section className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-headline-md font-headline-md text-on-surface">Upcoming Tasks</h4>
                <span className="w-6 h-6 bg-primary text-on-primary rounded-full text-[10px] flex items-center justify-center font-bold">
                  {tasks.filter((t) => !t.completed).length}
                </span>
              </div>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-4 border border-outline-variant rounded-xl flex items-start gap-4 hover:border-primary/40 transition-all cursor-pointer group ${task.completed ? "opacity-50 line-through" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${task.type === "call" ? "bg-tertiary-fixed/30 text-tertiary" : "bg-secondary-fixed/30 text-secondary"}`}
                    >
                      <span className="material-symbols-outlined">{task.type}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-label-md font-label-md text-on-surface">{task.title}</p>
                        <span className={`text-label-sm font-label-sm ${task.time.includes("Today") ? "text-error" : "text-on-surface-variant"}`}>
                          {task.time}
                        </span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">{task.desc}</p>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-body-sm text-outline text-center py-2">No upcoming tasks for this lead.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAddTask(true)}
                className="w-full mt-6 py-3 border-2 border-dashed border-outline-variant rounded-xl text-label-md font-label-md text-outline hover:border-primary/40 hover:text-primary transition-all"
              >
                + Add New Task
              </button>
            </section>
          </div>

          {/* Timeline & Main Column (Center Column) */}
          <div className="col-span-12 lg:col-span-5 space-y-gutter">
            <section className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-headline-md font-headline-md text-on-surface">Activity Timeline</h4>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-surface-container-high rounded-lg text-outline">
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                  <button className="px-4 py-2 bg-surface-container-low text-label-md font-label-md rounded-lg hover:bg-surface-container-high transition-colors">
                    Log Activity
                  </button>
                </div>
              </div>
              <div className="relative space-y-8 before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-0.5 before:bg-surface-container-high">
                {activities.map((act) => (
                  <div key={act.id} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-surface-container-lowest border-4 border-surface-container-high flex items-center justify-center z-10">
                      <span
                        className={`material-symbols-outlined text-[18px] ${act.type === "forum" ? "text-primary" : act.type === "phone_in_talk" ? "text-tertiary" : "text-secondary"}`}
                      >
                        {act.type}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/50">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-label-md font-label-md text-on-surface">{act.title}</p>
                        <span className="text-body-sm font-body-sm text-outline">{act.time}</span>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant">{act.desc}</p>
                      {act.meta && (
                        <div className="mt-3 p-2 bg-surface-container-low rounded-lg flex items-center gap-2 w-fit">
                          <span
                            className={`material-symbols-outlined text-[16px] ${act.meta.includes(".pdf") ? "text-error" : "text-outline"}`}
                          >
                            {act.meta.includes(".pdf") ? "picture_as_pdf" : "mic"}
                          </span>
                          <span className="text-label-sm font-label-sm text-on-surface">{act.meta}</span>
                          {!act.meta.includes(".pdf") && (
                            <button className="ml-auto material-symbols-outlined text-primary">play_circle</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-body-sm text-outline text-center py-4">No activity recorded for this lead yet.</p>
                )}
              </div>
              <div className="mt-8 text-center">
                <button className="text-primary text-label-md font-label-md hover:underline">View All Activities</button>
              </div>
            </section>

            {/* Notes Section */}
            <section className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding">
              <h4 className="text-headline-md font-headline-md text-on-surface mb-4">Sales Team Notes</h4>
              <div className="relative">
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-xl p-4 text-body-md focus:ring-2 focus:ring-primary/20 placeholder:text-outline outline-none"
                  placeholder="Type private team notes here..."
                  rows={4}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddNote}
                  className="absolute bottom-3 right-3 p-2 bg-primary text-on-primary rounded-lg soft-shadow active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </section>
          </div>

          {/* Interested Properties & Score (Right Column) */}
          <div className="col-span-12 lg:col-span-3 space-y-gutter">
            <section className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding">
              <h4 className="text-headline-md font-headline-md text-on-surface mb-6">Interested Properties</h4>
              {lead.propertyInterest ? (
                <div className="group relative bg-surface-container-low rounded-2xl overflow-hidden hover:soft-shadow transition-all duration-300">
                  <img
                    alt={lead.propertyInterest}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-label-sm font-label-sm text-primary font-bold">
                    Interested In
                  </div>
                  <div className="p-4">
                    <h5 className="text-headline-md font-headline-md text-on-surface truncate">{lead.propertyInterest}</h5>
                    <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 mb-3">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {lead.preferredLocation ?? "Location flexible"}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-headline-md font-headline-md text-primary">{lead.budget ?? "Budget TBD"}</p>
                    </div>
                    <Link
                      href="/properties"
                      className="w-full inline-block text-center py-2.5 bg-primary-container text-on-primary-container text-label-md font-label-md rounded-xl hover:brightness-110 transition-all active:scale-95 font-semibold"
                    >
                      View Property Details
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-body-sm text-outline text-center py-2">No property preference recorded.</p>
              )}
              <div className="mt-6 p-4 border border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2 text-outline cursor-pointer hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">add_circle</span>
                <span className="text-label-md font-label-md">Link Property</span>
              </div>
            </section>

            <section className="bg-surface-container-lowest soft-shadow rounded-2xl p-card-padding overflow-hidden">
              <h4 className="text-headline-md font-headline-md text-on-surface mb-4">Lead Score</h4>
              <div className="flex flex-col items-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                    <circle
                      className="stroke-primary"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="16"
                      strokeDasharray={`${lead.status === "Hot" ? 85 : lead.status === "Warm" ? 55 : 25}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-xl font-headline-xl text-on-surface font-extrabold">
                      {lead.status === "Hot" ? 85 : lead.status === "Warm" ? 55 : 25}
                    </span>
                    <span className="text-label-sm font-label-sm text-outline">{lead.status}</span>
                  </div>
                </div>
                <p className="mt-6 text-body-sm font-body-sm text-center text-on-surface-variant">
                  {lead.status === "Hot"
                    ? "High purchase intent based on engagement and recent activity."
                    : lead.status === "Warm"
                      ? "Moderate purchase intent. Regular follow-ups recommended."
                      : "Low engagement so far. Consider a re-engagement campaign."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full soft-shadow flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]">edit</span>
      </button>
    </>
  );
}
