"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import PageHeaderActions from "../components/PageHeaderActions";
import ActionDropdown from "../components/ActionDropdown";
import { api, ApiClientError } from "../lib/apiClient";
import { initialsOf, timeAgo } from "../lib/format";
import { useToast } from "../components/ToastProvider";
import AppSelect from "../components/forms/AppSelect";
import AppDatePicker from "../components/forms/AppDatePicker";
import type { LeadDTO } from "@/types/leads";

// ── Follow-up Modal ──────────────────────────────────────────────────────────
function FollowUpModal({
  leadName,
  onClose,
}: {
  leadName: string;
  onClose: () => void;
}) {
  const [type, setType] = useState("Call");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") onClose(); });
  }, [onClose]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Schedule Follow-up</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">For: <span className="font-semibold text-primary">{leadName}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        {saved ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <p className="text-headline-md font-bold text-on-surface">Follow-up Scheduled!</p>
            <p className="text-body-sm text-on-surface-variant mt-1">You'll be reminded before the event.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Follow-up Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["Call", "Email", "Meeting"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 rounded-lg text-label-md font-semibold border transition-all ${
                      type === t
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Date</label>
                <AppDatePicker
                  value={date || null}
                  onChange={(v) => setDate(v ?? "")}
                  required
                  minDate={new Date().toISOString().slice(0, 10)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What to discuss..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-outline"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all"
              >
                Schedule
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Per-row action menu for the leads table ──────────────────────────────────
function LeadActionMenu({
  leadId,
  leadName,
  onSchedule,
  onDelete,
}: {
  leadId: number;
  leadName: string;
  onSchedule: (name: string) => void;
  onDelete: (id: number, name: string) => void;
}) {
  return (
    <ActionDropdown
      ariaLabel="Lead actions"
      items={[
        { label: "View Details", icon: "visibility", href: `/leads/${leadId}` },
        { label: "Edit Lead", icon: "edit" },
        { label: "Send Email", icon: "mail" },
        { label: "Schedule Follow-up", icon: "schedule", onClick: () => onSchedule(leadName) },
        { label: "Delete Lead", icon: "delete", danger: true, onClick: () => onDelete(leadId, leadName) },
      ]}
    />
  );
}

// ── View model: API lead -> table row ─────────────────────────────────────────
const STAGE_WIDTHS: Record<string, string> = {
  New: "w-[10%]",
  Contacted: "w-1/5",
  Inquiry: "w-1/4",
  Viewing: "w-2/5",
  Negotiation: "w-3/4",
  Closed: "w-full",
};

function toLeadRow(lead: LeadDTO) {
  return {
    id: lead.id,
    name: lead.name,
    time: timeAgo(lead.createdAt),
    phone: lead.phone ?? "—",
    property: lead.propertyInterest ?? "—",
    budget: lead.budget ?? "—",
    stage: lead.stage,
    stageWidth: STAGE_WIDTHS[lead.stage] ?? "w-[10%]",
    status: lead.status,
    avatar: lead.avatarUrl,
    initials: initialsOf(lead.name),
    agentAvatar: lead.agentAvatar,
    hasFollowUp: lead.hasFollowUp,
  };
}


export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState("All Leads");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [followUpLead, setFollowUpLead] = useState<string | null>(null); // leadName or null
  const [leads, setLeads] = useState<ReturnType<typeof toLeadRow>[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const loadLeads = useCallback(async () => {
    try {
      const { data } = await api.get<LeadDTO[]>("/api/leads?pageSize=100");
      setLeads(data.map(toLeadRow));
    } catch (err) {
      toastError(err instanceof ApiClientError ? err.message : "Failed to load leads.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete lead "${name}"? This can be undone by an administrator.`)) return;
    const previous = leads;
    setLeads((list) => list.filter((l) => l.id !== id));
    try {
      await api.delete(`/api/leads/${id}`);
      success(`Lead "${name}" deleted.`);
    } catch (err) {
      setLeads(previous);
      toastError(err instanceof ApiClientError ? err.message : "Failed to delete the lead.");
    }
  }

  const filteredLeads = leads.filter((lead) => {
    // Quick Filter Tabs
    if (activeTab === "New Leads" && lead.stage !== "New") return false;
    if (activeTab === "Hot Leads" && lead.status !== "Hot") return false;
    if (activeTab === "Follow-ups" && !lead.hasFollowUp) return false;
    if (activeTab === "Converted" && lead.stage !== "Closed") return false;
    if (activeTab === "Lost" && lead.status !== "Cold") return false;
    // Filter Dropdown
    if (statusFilter !== "All Statuses" && lead.status !== statusFilter) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !lead.name.toLowerCase().includes(q) &&
        !lead.phone.toLowerCase().includes(q) &&
        !lead.property.toLowerCase().includes(q) &&
        !lead.budget.toLowerCase().includes(q) &&
        !lead.stage.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot":
        return "bg-error-container/20 text-error";
      case "Warm":
        return "bg-primary-container/20 text-primary";
      case "Cold":
        return "bg-surface-container-highest text-outline";
      default:
        return "bg-surface-container-highest text-outline";
    }
  };

  const tabs = [
    "All Leads",
    "New Leads",
    "Hot Leads",
    "Follow-ups",
    "Converted",
    "Lost",
  ];

  return (
    <>
      {/* Follow-up Modal */}
      {followUpLead && (
        <FollowUpModal
          leadName={followUpLead}
          onClose={() => setFollowUpLead(null)}
        />
      )}

      {/* TopNavBar */}
      <header className="app-fixed-header bg-surface flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 lg:px-gutter py-3 sm:py-0 sm:min-h-[5rem] z-40 border-b border-outline-variant/30">
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <p className="text-body-sm font-body-sm text-on-surface-variant hidden sm:block">Good Morning, Jetnetix</p>
            <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface truncate">All Leads</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap justify-end">
          <div className="relative flex-1 sm:flex-none min-w-[140px] sm:min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className={`w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary outline-none transition-all duration-300 ${searchFocused ? "sm:w-80" : "sm:w-64"}`}
              placeholder="Search leads, contact..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <PageHeaderActions />
          <div className="hidden sm:block h-8 w-px bg-outline-variant mx-2"></div>
          <div className="hidden md:flex items-center gap-3 pl-2">
            <img
              alt="Jetnetix user profile"
              className="w-10 h-10 rounded-full border-2 border-primary-fixed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnwuGTXHKmHTwjHN2WA_5jIGk5-QwT_2gJ14jsvQo8xKnTDs14cXd75SBCIkrlFIg6uVQPqpUeDVHtayAKe8rDRQcFwv4PoxvbcDty8AV9fCeavWW00qP_qrE__GMDCN7aYpI49WpzQWtitH-u2JPEHhCfzxzdYFJqCHBFaQ3sqMD8xRS0aic-eSFJApRCUS0ry-sYL8g_COPWiZxLDAIlxDxnhhQ4Pj0a4Ab1DGn1kDaLspgmGr8q0Gb-xhffVVL2WuUHmbWRC2ty"
            />
            <span className="material-symbols-outlined text-outline">expand_more</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="p-container-margin">
        {/* Header Actions */}
        <div className="flex sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
          <div className="flex gap-2 relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-label-md transition-all ambient-shadow ${showFilters ? "bg-surface-container-high border-primary text-primary" : "bg-white border-outline-variant text-on-surface hover:bg-surface-container"}`}
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              Filter
            </button>
            {showFilters && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-4 z-50 ambient-shadow">
                <h3 className="text-label-md font-bold mb-3">Filter Leads</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-label-sm text-secondary block mb-1">Status</label>
                    <AppSelect
                      instanceId="lead-status-filter"
                      size="sm"
                      value={statusFilter}
                      onChange={(v) => setStatusFilter(v ?? "All Statuses")}
                      isClearable={statusFilter !== "All Statuses"}
                      options={["All Statuses", "Hot", "Warm", "Cold"].map((s) => ({ value: s, label: s }))}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant flex justify-end">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm font-bold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg text-label-md hover:bg-surface-container transition-all ambient-shadow">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export
            </button>
          </div>
          <Link
            href="/leads/add"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Lead
          </Link>
        </div>

        {/* Section 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-gap">
          {/* Total Leads */}
          <div className="bg-white p-card-padding rounded-xl ambient-shadow flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-label-md text-on-surface-variant">Total Leads</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-metric-lg font-metric-lg">2,845</h3>
              <span className="flex items-center text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20 text-tertiary">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                +12.5%
              </span>
            </div>
          </div>
          {/* Hot Leads */}
          <div className="bg-white p-card-padding rounded-xl ambient-shadow flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-label-md text-on-surface-variant">Hot Leads</span>
              <div className="w-10 h-10 rounded-lg bg-error-container/30 flex items-center justify-center text-error">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-metric-lg font-metric-lg">482</h3>
              <span className="flex items-center text-label-sm px-2 py-0.5 rounded-full bg-error-container/20 text-error">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                +8.2%
              </span>
            </div>
          </div>
          {/* Converted */}
          <div className="bg-white p-card-padding rounded-xl ambient-shadow flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-label-md text-on-surface-variant">Converted Leads</span>
              <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-metric-lg font-metric-lg">1,240</h3>
              <span className="flex items-center text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20 text-tertiary">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                +18%
              </span>
            </div>
          </div>
          {/* Lost */}
          <div className="bg-white p-card-padding rounded-xl ambient-shadow flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-label-md text-on-surface-variant">Lost Leads</span>
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_off</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-metric-lg font-metric-lg">112</h3>
              <span className="flex items-center text-label-sm px-2 py-0.5 rounded-full bg-surface-container/50 text-outline">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span>
                -4%
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Quick Filters */}
        <div className="mb-gutter border-b border-outline-variant flex items-center gap-8 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-label-md whitespace-nowrap transition-colors border-b-2 ${isActive ? "font-bold text-primary border-primary" : "font-medium text-on-surface-variant hover:text-on-surface border-transparent"}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Main Section Grid (3:1) */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left Col: Table (9 cols) */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-xl ambient-shadow overflow-hidden">
              <div className="table-responsive custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Lead Name</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Contact</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Property</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Budget</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Stage</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Status</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold">Agent</th>
                      <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {loading &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={`skeleton-${i}`} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0" />
                              <div className="space-y-2">
                                <div className="h-3 w-28 bg-surface-container-high rounded" />
                                <div className="h-2.5 w-16 bg-surface-container rounded" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4"><div className="h-3 w-24 bg-surface-container-high rounded" /></td>
                          <td className="px-6 py-4"><div className="h-3 w-32 bg-surface-container-high rounded" /></td>
                          <td className="px-6 py-4"><div className="h-3 w-20 bg-surface-container-high rounded" /></td>
                          <td className="px-6 py-4"><div className="h-2 w-24 bg-surface-container-high rounded-full" /></td>
                          <td className="px-6 py-4"><div className="h-6 w-14 bg-surface-container-high rounded-full" /></td>
                          <td className="px-6 py-4"><div className="w-8 h-8 rounded-full bg-surface-container-high" /></td>
                          <td className="px-6 py-4" />
                        </tr>
                      ))}
                    {!loading && filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-background transition-colors h-[table-row-height] even:bg-surface-container-low/30">
                        <td className="px-6 py-4">
                          <Link href={`/leads/${lead.id}`} className="flex items-center gap-3 group">
                            {lead.avatar ? (
                              <img alt={lead.name} className="w-10 h-10 rounded-full object-cover shrink-0" src={lead.avatar} />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {lead.initials}
                              </div>
                            )}
                            <div>
                              <p className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">{lead.name}</p>
                              <p className="text-body-sm text-on-surface-variant">{lead.time}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-body-md text-on-surface-variant">{lead.phone}</td>
                        <td className="px-6 py-4">
                          <p className="text-body-md font-medium">{lead.property}</p>
                        </td>
                        <td className="px-6 py-4 text-body-md font-semibold text-primary">{lead.budget}</td>
                        <td className="px-6 py-4">
                          <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                            <div className={`bg-primary h-full ${lead.stageWidth}`}></div>
                          </div>
                          <span className="text-body-sm text-on-surface-variant mt-1 block">{lead.stage}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-label-sm rounded-full font-semibold ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {lead.agentAvatar ? (
                              <img alt="Agent" className="w-8 h-8 rounded-full border-2 border-white object-cover" src={lead.agentAvatar} />
                            ) : (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <LeadActionMenu
                            leadId={lead.id}
                            leadName={lead.name}
                            onSchedule={(name) => setFollowUpLead(name)}
                            onDelete={handleDelete}
                          />
                        </td>
                      </tr>
                    ))}
                    {!loading && filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-outline text-body-md">
                          No leads match the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant">
                <p className="text-body-sm text-on-surface-variant">Showing 1-{filteredLeads.length} of {filteredLeads.length} leads</p>
                <div className="flex gap-2">
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-all" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-all" disabled>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Widgets (3 cols) */}
          <div className="col-span-12 lg:col-span-3 space-y-gutter">
            {/* Upcoming Follow-ups */}
            <div className="bg-white rounded-xl ambient-shadow p-card-padding">
              <h4 className="text-headline-md font-headline-md mb-4 flex justify-between items-center">
                Follow-ups
                <Link href="/leads/follow-ups" className="text-label-sm text-primary hover:underline">
                  View All
                </Link>
              </h4>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setFollowUpLead("Sarah Miller")}
                  className="w-full text-left p-3 bg-surface-container-low rounded-lg border-l-4 border-error hover:bg-surface-container transition-colors"
                >
                  <p className="text-label-md font-bold">Call Sarah Miller</p>
                  <p className="text-body-sm text-on-surface-variant mb-2">Discuss penthouse offer</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-error font-semibold flex items-center">
                      <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                      Today, 2:00 PM
                    </span>
                    <span className="text-primary text-label-sm font-bold">Schedule</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFollowUpLead("Marcus Chen")}
                  className="w-full text-left p-3 bg-surface-container-low rounded-lg border-l-4 border-primary hover:bg-surface-container transition-colors"
                >
                  <p className="text-label-md font-bold">Email Marcus Chen</p>
                  <p className="text-body-sm text-on-surface-variant mb-2">Send property brochures</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-on-surface-variant flex items-center">
                      <span className="material-symbols-outlined text-[16px] mr-1">calendar_today</span>
                      Tomorrow, 10:00 AM
                    </span>
                    <span className="text-primary text-label-sm font-bold">Schedule</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Conversion Rate Widget */}
            <div className="bg-white rounded-xl ambient-shadow p-card-padding text-center">
              <h4 className="text-label-md font-bold text-on-surface-variant mb-6 uppercase tracking-wider">Conversion Rate</h4>
              <div className="relative flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="100, 100"
                      strokeWidth="2.5"
                    ></path>
                    <path
                      className="text-primary-container"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="64, 100"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    ></path>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[40px] leading-none font-extrabold text-on-surface">64%</span>
                      <span className="mt-1 flex items-center gap-0.5 text-[12px] font-bold text-tertiary">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        +2.4%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-body-sm text-on-surface font-medium leading-tight">Better than 72%</p>
                  <p className="text-body-sm text-on-surface-variant">of other agents this month</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl ambient-shadow p-card-padding">
              <h4 className="text-label-md font-bold mb-4">Recent Activities</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-body-md text-on-surface">
                      New inquiry from <b>Lisa Ray</b>
                    </p>
                    <p className="text-body-sm text-on-surface-variant">15 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-tertiary mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-body-md text-on-surface">
                      Deal closed for <b>32 Oak Ave</b>
                    </p>
                    <p className="text-body-sm text-on-surface-variant">1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-body-md text-on-surface">
                      Lead <b>John Doe</b> marked as Lost
                    </p>
                    <p className="text-body-sm text-on-surface-variant">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
