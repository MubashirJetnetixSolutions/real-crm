"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import PageHeaderActions from "../components/PageHeaderActions";
import ActionDropdown from "../components/ActionDropdown";
import AppSelect from "../components/forms/AppSelect";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Deal {
  id: string;
  title: string;
  client: string;
  price: string;
  priority: string;
  priorityClass: string;
  time: string;
  icon: string;
  image?: string;
  avatars?: string[];
  agentName?: string;
  agentAvatar?: string;
  stage?: string;
  notes?: string;
}

interface Column {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
}

interface Pipeline {
  id: string;
  name: string;
  columns: Column[];
}

// ── Avatar constants ───────────────────────────────────────────────────────────
const AV = {
  sarah: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAImOyRrtuhpU6_P5ItzUiACq2mTw73Gtl_XD_iyU3e9nGVOKSsjo2VcDbWJbughEGVJqteuGerJP3OjoGaYJ2nOmVkF_h6a7FxgEWFx93rfaudCvNwIsyAI-P0Bpr8uipNB8MEJhZHdJNoAb695tWBCJB00D7xsqCISFYyFteyOY-pjdefnG__bYio4kKTdHIj_ZR49mrqA5YF7skGWNh3nLcQmB-Qr7E56RROLBIa4hOIzCCrGHMJuRyM_hUL2QYttNZjlbjwyw",
  mike: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5WyWGNQ995GDPVgxmgSf_WcWV9ifWUcffP4bmtuWdluVEslQ4vlLFcq_ziAiEmFrCNX68zyjbm7sWky-S97lHm5GEdy5kM9nQWsm31df9n4oueK5teHnkiHakOFBiY7ZElTDE6OHESOzvgPAt1XeixF1wdgmbK-75_mQbFVBs3LR4jbpFwPXD_ovFx_N2y-DBl_wgmZfCsKNCasNcKpPh-LIkCjhrZZWJYX-dfL5UG0Y-Jyslhy8ssm1vYz9LsAW_9Ps12lJxTbuS",
  a1: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGQoOVRfXqwybKKLHydPd086C38AF72GDmLeZ2ToQRyu5_kEodlh1brSZX6ke7BJ1RmBmNHYrKUsTdTg_P3luRlZqzsxe718cgAIIl23fssGakabyTQGk0w1W9a5yCIXrCBpX7u3Mz9Tp6N0UgNd2wDeezjmkV02GPj5-mLs2lZhKw2iUNi21CbFem7XeL_gtQ_C5NJfr_5L72dppNJF62Po6CfNP-l-pgNQL7m4RqwKCPW4rxWN2I__Ah7q46UUBUesQ8IBeQkVZb",
  a2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtAnbfCdz4TCIV9nAM6XfBLc4xopaVgl35vJcQnO6kPluyMtFSoxum7LFKnKsVSyKWvGIGV3ToF5Vix_IXb_BXqTJXAkwjUYDmheVrP89Uvp-F8O9IaWdlL9cBa5xigZJvGNZ2d0lXtivnjuq9ykQW6OHFr8xZvUdyLDpEu-glFSWRJW3m0RJ-6MjiXqdiZT7myeHzOBBJkWQ3nBD2ieSYfD_UOdk9ZyBsOoCpqXMYZ8V7K8tuDzUz8AZxW_Hr6m6IvozCaJC2aelM",
};

// ── Initial pipeline data ─────────────────────────────────────────────────────
const makePipelines = (): Pipeline[] => [
  {
    id: "p-residential",
    name: "Main Residential",
    columns: [
      {
        id: "col-new", name: "New Deal", color: "bg-primary",
        deals: [
          { id: "d1", title: "Skyline Penthouse", client: "Robert Chen", price: "$1,250,000", priority: "High Priority", priorityClass: "bg-error-container/30 text-error", time: "2h ago", icon: "schedule", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMyf-QhXlBsYzRa5jKhMFtDNKWqy33Pkj4KWiToWSjXEjESAaJCmo3k1s-iGORqxI3wLZ5uAFwVRQct9Bi-OelUSugyybfDNKihWgYEtq2inxYy7sFIw5Qi842Ns5sBBRX3XKQyRos14J2zvq3mZou-GBxzv5CVvJPlXmlmhkTFzjZ4YrwVhfk35aC1U3IPK14uHCpOaZ5YQLXi6T5qPXZasTOkIpuhuziBiJqD_tZqDUQWT2vYZxTq15cHBTpJTsnOwQCiJyy6oJi", avatars: [AV.a1, AV.a2], stage: "Inquiry", notes: "Client interested in units above 30th floor." },
          { id: "d2", title: "Oakwood Estate", client: "Sarah Jenkins", price: "$890,000", priority: "Normal", priorityClass: "bg-secondary-container/30 text-secondary", time: "Tomorrow", icon: "pending_actions", agentName: "Sarah J.", agentAvatar: AV.sarah, stage: "Inquiry", notes: "Needs financing pre-approval before proceeding." },
        ],
      },
      {
        id: "col-negotiation", name: "Negotiation", color: "bg-secondary",
        deals: [
          { id: "d3", title: "Waterfront Villa", client: "Liam O'Connell", price: "$3,450,000", priority: "Payment Pending", priorityClass: "bg-tertiary-container/20 text-tertiary", time: "Recent Chat", icon: "mark_chat_unread", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk2OqptE5x5WDoHRbNjCkxxQCCAPSwgoAr50ohYnnAhfA6oDGq2ra85g4T9RSIDVRvH5fZ-V169G6rahPLHWKouoReHdmxp9DQg-vHeUNVNmvMqfhf6Y-DRabj4VFEP6H0NLI32yw5XVp2Gx-VHWVNHt_A1sK7Vw-pXJ_HPA_mdLRbYV9Htjnr2gRTJFMWvJwVh_s1gUp3ZMHJB0P67uUERjofIAeE2XRUsCOStpljkJHmz2yfRxIZu01KL-AKbrQI2nKtcfiCDMgV", agentName: "Mike T.", agentAvatar: AV.mike, stage: "Negotiation", notes: "Counter-offer sent. Awaiting client response." },
        ],
      },
      { id: "col-booking", name: "Booking", color: "bg-tertiary", deals: [] },
      { id: "col-docs", name: "Documentation", color: "bg-secondary", deals: [] },
      { id: "col-closed", name: "Closed", color: "bg-tertiary", deals: [
        { id: "d4", title: "Mountain Retreat", client: "Ana Folau", price: "$720,000", priority: "Closed Won", priorityClass: "bg-tertiary/10 text-tertiary", time: "3 days ago", icon: "verified", agentName: "Sarah J.", agentAvatar: AV.sarah, stage: "Closed" },
      ]},
    ],
  },
  {
    id: "p-commercial",
    name: "Commercial",
    columns: [
      { id: "cc-prospect", name: "Prospect", color: "bg-secondary", deals: [
        { id: "dc1", title: "Downtown Office Block", client: "Nexus Corp", price: "$8,400,000", priority: "High Priority", priorityClass: "bg-error-container/30 text-error", time: "1d ago", icon: "business", stage: "Prospect" },
      ]},
      { id: "cc-due-diligence", name: "Due Diligence", color: "bg-primary", deals: [] },
      { id: "cc-offer", name: "Offer", color: "bg-tertiary", deals: [] },
      { id: "cc-closed", name: "Closed", color: "bg-tertiary", deals: [] },
    ],
  },
  {
    id: "p-luxury",
    name: "Luxury Collection",
    columns: [
      { id: "lc-discovery", name: "Discovery", color: "bg-primary", deals: [
        { id: "dl1", title: "Private Island Estate", client: "Sheikh Al-Rashid", price: "$42,000,000", priority: "VIP", priorityClass: "bg-tertiary/10 text-tertiary", time: "Today", icon: "star", stage: "Discovery" },
      ]},
      { id: "lc-private-tour", name: "Private Tour", color: "bg-secondary", deals: [] },
      { id: "lc-offer", name: "Offer", color: "bg-tertiary", deals: [] },
      { id: "lc-closed", name: "Closed", color: "bg-tertiary", deals: [] },
    ],
  },
];

// ── Deal Card ─────────────────────────────────────────────────────────────────
function DealCard({
  deal,
  onDragStart,
  onSelect,
  onMarkWon,
  onMarkLost,
  onDelete,
}: {
  deal: Deal;
  onDragStart: (dealId: string, fromColId: string) => void;
  onSelect: (deal: Deal) => void;
  onMarkWon: (dealId: string) => void;
  onMarkLost: (dealId: string) => void;
  onDelete: (dealId: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("dealId", deal.id); onDragStart(deal.id, ""); }}
      onClick={() => onSelect(deal)}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-[0px_1px_3px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-[0px_4px_12px_rgba(0,0,0,0.12)] hover:border-primary/30 active:opacity-80 transition-all select-none group relative"
    >
      {deal.image && (
        <div className="h-28 overflow-hidden relative">
          <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-label-md font-bold text-on-surface leading-tight">{deal.title}</p>
            <p className="text-body-sm text-on-surface-variant mt-0.5">{deal.client}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ActionDropdown
              buttonClassName="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline group-hover:text-on-surface"
              items={[
                { label: "View Details", icon: "visibility", onClick: () => onSelect(deal) },
                { label: "Mark as Won", icon: "verified", onClick: () => onMarkWon(deal.id) },
                { label: "Mark as Lost", icon: "cancel", onClick: () => onMarkLost(deal.id) },
                { label: "Delete", icon: "delete", danger: true, onClick: () => onDelete(deal.id) },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-label-md font-bold text-primary">{deal.price}</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${deal.priorityClass}`}>{deal.priority}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
          <span className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">{deal.icon}</span>
            {deal.time}
          </span>
          {deal.agentAvatar ? (
            <img src={deal.agentAvatar} alt={deal.agentName} className="w-6 h-6 rounded-full border border-surface" />
          ) : deal.avatars ? (
            <div className="flex -space-x-1.5">
              {deal.avatars.map((av, i) => (
                <img key={i} src={av} alt="" className="w-6 h-6 rounded-full border border-surface" />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Deal Detail Panel ─────────────────────────────────────────────────────────
function DealDetailPanel({ deal, onClose, onMarkWon, onMarkLost }: {
  deal: Deal; onClose: () => void;
  onMarkWon: (id: string) => void; onMarkLost: (id: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full drawer-panel-right bg-surface-container-lowest border-l border-outline-variant/30 z-50 flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 shrink-0">
          <h2 className="text-headline-md font-bold text-on-surface">Deal Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {deal.image && (
            <div className="h-48 overflow-hidden">
              <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-headline-lg font-bold text-on-surface">{deal.title}</h3>
              <p className="text-body-md text-on-surface-variant mt-1">Client: {deal.client}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Deal Value", value: deal.price, icon: "payments", color: "text-primary" },
                { label: "Stage", value: deal.stage || "New Deal", icon: "account_tree", color: "text-secondary" },
                { label: "Priority", value: deal.priority, icon: "flag", color: "text-error" },
                { label: "Last Update", value: deal.time, icon: "schedule", color: "text-outline" },
              ].map((item) => (
                <div key={item.label} className="bg-surface-container-low rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`material-symbols-outlined text-[14px] ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    <span className="text-label-sm text-on-surface-variant">{item.label}</span>
                  </div>
                  <p className="text-label-md font-bold text-on-surface">{item.value}</p>
                </div>
              ))}
            </div>

            {(deal.agentName || deal.avatars) && (
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl p-4">
                {deal.agentAvatar ? (
                  <img src={deal.agentAvatar} alt={deal.agentName} className="w-10 h-10 rounded-full border-2 border-primary-fixed" />
                ) : (
                  <div className="flex -space-x-2">
                    {(deal.avatars || []).map((av, i) => (
                      <img key={i} src={av} alt="" className="w-9 h-9 rounded-full border-2 border-surface" />
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-label-md font-semibold text-on-surface">{deal.agentName || "Team"}</p>
                  <p className="text-body-sm text-on-surface-variant">Assigned Agent</p>
                </div>
              </div>
            )}

            {deal.notes && (
              <div>
                <p className="text-label-sm text-on-surface-variant font-medium mb-2 uppercase tracking-wide">Notes</p>
                <p className="text-body-md text-on-surface bg-surface-container-low rounded-xl p-4 leading-relaxed">{deal.notes}</p>
              </div>
            )}

            <div>
              <p className="text-label-sm text-on-surface-variant font-medium mb-3 uppercase tracking-wide">Timeline</p>
              <div className="space-y-3">
                {["Deal created", "Initial contact made", "Documents requested", deal.stage === "Closed" ? "Deal closed ✓" : "Awaiting response"].map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? "bg-primary" : i === 3 && deal.stage === "Closed" ? "bg-tertiary" : "bg-outline-variant"}`} />
                    <div>
                      <p className="text-body-sm text-on-surface font-medium">{event}</p>
                      <p className="text-body-sm text-outline">{["2 days ago", "1 day ago", "Today", deal.time][i]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant/30 shrink-0 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onMarkWon(deal.id)} className="flex items-center justify-center gap-2 py-2.5 bg-tertiary/10 text-tertiary rounded-lg text-label-md font-semibold hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Mark Won
            </button>
            <button onClick={() => onMarkLost(deal.id)} className="flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error rounded-lg text-label-md font-semibold hover:bg-error/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              Mark Lost
            </button>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            Schedule Viewing
          </button>
        </div>
      </div>
    </>
  );
}

// ── Add Deal Modal ────────────────────────────────────────────────────────────
function AddDealModal({ columns, onClose, onAdd }: {
  columns: Column[]; onClose: () => void; onAdd: (colId: string, deal: Deal) => void;
}) {
  const [form, setForm] = useState({ title: "", client: "", price: "", priority: "Normal", colId: columns[0]?.id ?? "" });
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const deal: Deal = {
      id: `deal-${Date.now()}`,
      title: form.title,
      client: form.client,
      price: form.price.startsWith("$") ? form.price : `$${form.price}`,
      priority: form.priority,
      priorityClass: form.priority === "High Priority" ? "bg-error-container/30 text-error" : "bg-secondary-container/30 text-secondary",
      time: "Just now",
      icon: "schedule",
      stage: columns.find((c) => c.id === form.colId)?.name || "New Deal",
    };
    setSaved(true);
    setTimeout(() => { onAdd(form.colId, deal); onClose(); }, 1000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Add New Deal</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">Create a deal and assign it to a stage.</p>
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
            <p className="text-headline-md font-bold text-on-surface">Deal Created!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[["Property / Deal Title", "title", "Skyline Penthouse"], ["Client Name", "client", "Robert Chen"], ["Deal Value", "price", "$1,250,000"]].map(([label, key, ph]) => (
              <div key={key}>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">{label}</label>
                <input
                  required
                  placeholder={ph}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Priority</label>
                <AppSelect instanceId="deal-priority" value={form.priority} onChange={(v) => setForm((f) => ({ ...f, priority: v ?? "Normal" }))}
                  options={["Normal", "High Priority", "Payment Pending"].map((p) => ({ value: p, label: p }))} />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Stage</label>
                <AppSelect instanceId="deal-column" value={form.colId} onChange={(v) => setForm((f) => ({ ...f, colId: v ?? columns[0]?.id ?? "" }))}
                  options={columns.map((c) => ({ value: c.id, label: c.name }))} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Add Deal</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Add Stage Modal ───────────────────────────────────────────────────────────
function AddStageModal({ onClose, onAdd }: { onClose: () => void; onAdd: (col: Column) => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-primary");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ id: `col-${Date.now()}`, name, color, deals: [] });
    onClose();
  }

  const colors = [
    { value: "bg-primary", label: "Blue" },
    { value: "bg-secondary", label: "Purple" },
    { value: "bg-tertiary", label: "Green" },
    { value: "bg-error", label: "Red" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h2 className="text-headline-md font-bold text-on-surface">Add Pipeline Stage</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Stage Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Viewing Scheduled"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`flex-1 py-2 rounded-lg ${c.value} text-on-primary text-label-sm font-semibold border-2 transition-all ${color === c.value ? "border-on-surface scale-105" : "border-transparent opacity-60 hover:opacity-90"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Add Stage</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Add Pipeline Modal ────────────────────────────────────────────────────────
function AddPipelineModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Pipeline) => void }) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      id: `p-${Date.now()}`,
      name,
      columns: [
        { id: `c-new-${Date.now()}`, name: "New Deal", color: "bg-primary", deals: [] },
        { id: `c-nego-${Date.now()}`, name: "Negotiation", color: "bg-secondary", deals: [] },
        { id: `c-close-${Date.now()}`, name: "Closed", color: "bg-tertiary", deals: [] },
      ],
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h2 className="text-headline-md font-bold text-on-surface">Create New Pipeline</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Pipeline Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Beach Properties"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
            />
          </div>
          <p className="text-body-sm text-on-surface-variant">3 default stages will be created: New Deal, Negotiation, Closed.</p>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DealsPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(makePipelines);
  const [activePipelineId, setActivePipelineId] = useState("p-residential");
  const [pipelineDropdown, setPipelineDropdown] = useState(false);
  const [dragging, setDragging] = useState<{ dealId: string; fromColId: string } | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddStage, setShowAddStage] = useState(false);
  const [showAddPipeline, setShowAddPipeline] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const pipelineDropRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const pipeline = pipelines.find((p) => p.id === activePipelineId)!;
  const currentSelectedDeal = selectedDeal
    ? pipeline.columns.flatMap((c) => c.deals).find((d) => d.id === selectedDeal.id) ?? null
    : null;

  // Close pipeline dropdown on outside click
  useEffect(() => {
    function h(e: MouseEvent) {
      if (pipelineDropRef.current && !pipelineDropRef.current.contains(e.target as Node)) setPipelineDropdown(false);
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setShowQuickActions(false);
    }
    if (pipelineDropdown || showQuickActions) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [pipelineDropdown, showQuickActions]);

  // Drag helpers
  const handleDragStart = useCallback((dealId: string, _: string) => {
    const fromColId = pipeline.columns.find((c) => c.deals.some((d) => d.id === dealId))?.id ?? "";
    setDragging({ dealId, fromColId });
  }, [pipeline]);

  const handleDrop = useCallback((toColId: string) => {
    if (!dragging) return;
    const { dealId, fromColId } = dragging;
    if (fromColId === toColId) { setDragging(null); setDragOverColId(null); return; }

    setPipelines((prev) => prev.map((p) => {
      if (p.id !== activePipelineId) return p;
      let movedDeal: Deal | undefined;
      const cols = p.columns.map((c) => {
        if (c.id === fromColId) {
          movedDeal = c.deals.find((d) => d.id === dealId);
          return { ...c, deals: c.deals.filter((d) => d.id !== dealId) };
        }
        return c;
      });
      return {
        ...p,
        columns: cols.map((c) => {
          if (c.id === toColId && movedDeal) {
            const updatedDeal = { ...movedDeal, stage: c.name };
            return { ...c, deals: [...c.deals, updatedDeal] };
          }
          return c;
        }),
      };
    }));
    setDragging(null);
    setDragOverColId(null);
  }, [dragging, activePipelineId]);

  // Add deal
  const handleAddDeal = useCallback((colId: string, deal: Deal) => {
    setPipelines((prev) => prev.map((p) => {
      if (p.id !== activePipelineId) return p;
      return { ...p, columns: p.columns.map((c) => c.id === colId ? { ...c, deals: [...c.deals, deal] } : c) };
    }));
  }, [activePipelineId]);

  // Add stage
  const handleAddStage = useCallback((col: Column) => {
    setPipelines((prev) => prev.map((p) => p.id === activePipelineId ? { ...p, columns: [...p.columns, col] } : p));
  }, [activePipelineId]);

  // Mark won/lost
  const handleMarkWon = useCallback((dealId: string) => {
    setPipelines((prev) => prev.map((p) => {
      if (p.id !== activePipelineId) return p;
      let movedDeal: Deal | undefined;
      const cols = p.columns.map((c) => {
        const d = c.deals.find((d) => d.id === dealId);
        if (d) { movedDeal = { ...d, priority: "Closed Won", priorityClass: "bg-tertiary/10 text-tertiary", stage: "Closed" }; return { ...c, deals: c.deals.filter((d) => d.id !== dealId) }; }
        return c;
      });
      const closedCol = cols.find((c) => c.name === "Closed");
      if (closedCol && movedDeal) { return { ...p, columns: cols.map((c) => c.name === "Closed" ? { ...c, deals: [...c.deals, movedDeal!] } : c) }; }
      return { ...p, columns: cols };
    }));
    setSelectedDeal(null);
  }, [activePipelineId]);

  const handleMarkLost = useCallback((dealId: string) => {
    setPipelines((prev) => prev.map((p) => {
      if (p.id !== activePipelineId) return p;
      return { ...p, columns: p.columns.map((c) => ({ ...c, deals: c.deals.filter((d) => d.id !== dealId) })) };
    }));
    setSelectedDeal(null);
  }, [activePipelineId]);

  const handleDeleteDeal = useCallback((dealId: string) => {
    setPipelines((prev) => prev.map((p) => {
      if (p.id !== activePipelineId) return p;
      return { ...p, columns: p.columns.map((c) => ({ ...c, deals: c.deals.filter((d) => d.id !== dealId) })) };
    }));
    if (selectedDeal?.id === dealId) setSelectedDeal(null);
  }, [activePipelineId, selectedDeal]);

  const totalDeals = pipeline.columns.reduce((a, c) => a + c.deals.length, 0);
  const totalValue = pipeline.columns.flatMap((c) => c.deals).reduce((sum, d) => {
    const n = parseFloat(d.price.replace(/[$,]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="w-full min-w-0 max-w-full flex-1 min-h-0 overflow-hidden flex flex-col">
      {/* Modals */}
      {showAddDeal && <AddDealModal columns={pipeline.columns} onClose={() => setShowAddDeal(false)} onAdd={handleAddDeal} />}
      {showAddStage && <AddStageModal onClose={() => setShowAddStage(false)} onAdd={handleAddStage} />}
      {showAddPipeline && <AddPipelineModal onClose={() => setShowAddPipeline(false)} onAdd={(p) => { setPipelines((prev) => [...prev, p]); setActivePipelineId(p.id); }} />}
      {currentSelectedDeal && <DealDetailPanel deal={currentSelectedDeal} onClose={() => setSelectedDeal(null)} onMarkWon={handleMarkWon} onMarkLost={handleMarkLost} />}

      {/* Fixed Header */}
      <header className="app-fixed-header bg-surface flex flex-col xl:flex-row xl:justify-between xl:items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 xl:py-0 xl:min-h-[5rem] border-b border-outline-variant/30">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0 deal-hd">
          {/* Pipeline Switcher */}
          <div className="relative" ref={pipelineDropRef}>
            <button
              onClick={() => setPipelineDropdown((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-label-md font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">account_tree</span>
              {pipeline.name}
              <span className="material-symbols-outlined text-[18px] text-outline">{pipelineDropdown ? "expand_less" : "expand_more"}</span>
            </button>
            {pipelineDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                {pipelines.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setActivePipelineId(p.id); setPipelineDropdown(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-body-sm text-left transition-colors ${p.id === activePipelineId ? "bg-primary/5 text-primary font-semibold" : "text-on-surface hover:bg-surface-container-low"}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">account_tree</span>
                    {p.name}
                    {p.id === activePipelineId && <span className="ml-auto material-symbols-outlined text-[16px] text-primary">check</span>}
                  </button>
                ))}
                <div className="border-t border-outline-variant/30 my-1" />
                <button
                  onClick={() => { setPipelineDropdown(false); setShowAddPipeline(true); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-body-sm text-primary hover:bg-primary/5 transition-colors text-left font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Pipeline
                </button>
              </div>
            )}
          </div>
          <div className="hidden sm:block h-6 w-px bg-outline-variant/50" />
          <div className="min-w-0">
            <p className="text-body-sm text-on-surface-variant hidden sm:block">Good Morning, Jetnetix</p>
            <h2 className="text-headline-lg font-bold text-on-surface truncate">Deals Pipeline</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 deal-hdbt">
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-surface-container-low rounded-xl">
            <div className="text-center">
              <p className="text-label-sm text-on-surface-variant">Total Deals</p>
              <p className="text-label-md font-bold text-on-surface">{totalDeals}</p>
            </div>
            <div className="w-px h-6 bg-outline-variant/50" />
            <div className="text-center">
              <p className="text-label-sm text-on-surface-variant">Pipeline Value</p>
              <p className="text-label-md font-bold text-primary">${(totalValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setShowQuickActions((v) => !v)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-outline-variant rounded-xl text-label-md text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span className="hidden sm:inline">Quick Actions</span>
              <span className="material-symbols-outlined text-[18px] text-outline">{showQuickActions ? "expand_less" : "expand_more"}</span>
            </button>
            {showQuickActions && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                {[
                  { label: "Add New Deal", icon: "add", action: () => { setShowAddDeal(true); setShowQuickActions(false); } },
                  { label: "Add Pipeline Stage", icon: "add_column_right", action: () => { setShowAddStage(true); setShowQuickActions(false); } },
                  { label: "Create Pipeline", icon: "account_tree", action: () => { setShowAddPipeline(true); setShowQuickActions(false); } },
                  { label: "Pipeline Statistics", icon: "bar_chart", href: "/deals/statistics" },
                ].map((item) =>
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setShowQuickActions(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full flex items-center gap-2 px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
          <PageHeaderActions />
          <button
            onClick={() => setShowAddStage(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-label-md text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_column_right</span>
            Add Stage
          </button>
          <button
            onClick={() => setShowAddDeal(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden xs:inline sm:inline">Add Deal</span>
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 min-h-0 w-full max-w-full overflow-hidden">
        <div className="h-full w-full max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar overscroll-x-contain">
          <div className="inline-flex gap-3 sm:gap-4 h-full min-h-full p-4 sm:p-6 pr-6 sm:pr-8 align-top">
            {pipeline.columns.map((col) => {
              const colTotal = col.deals.reduce((sum, d) => {
                const n = parseFloat(d.price.replace(/[$,]/g, ""));
                return sum + (isNaN(n) ? 0 : n);
              }, 0);

              return (
                <div
                  key={col.id}
                  className={`w-72 shrink-0 flex flex-col rounded-xl transition-all ${dragOverColId === col.id ? "ring-2 ring-primary/50 bg-primary/5" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOverColId(col.id); }}
                  onDragLeave={() => setDragOverColId(null)}
                  onDrop={() => handleDrop(col.id)}
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-3 mb-3 px-1">
                    <div className={`w-3 h-3 rounded-full ${col.color}`} />
                    <h3 className="text-label-md font-bold text-on-surface flex-1">{col.name}</h3>
                    <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-medium">{col.deals.length}</span>
                  </div>
                  {colTotal > 0 && (
                    <p className="text-body-sm text-outline px-1 mb-3">${(colTotal / 1000000).toFixed(2)}M</p>
                  )}

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 custom-scrollbar min-h-[120px]">
                    {col.deals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onDragStart={handleDragStart}
                        onSelect={setSelectedDeal}
                        onMarkWon={handleMarkWon}
                        onMarkLost={handleMarkLost}
                        onDelete={handleDeleteDeal}
                      />
                    ))}
                    {col.deals.length === 0 && (
                      <div className={`h-24 border-2 border-dashed rounded-xl flex items-center justify-center transition-colors ${dragOverColId === col.id ? "border-primary/50 bg-primary/5" : "border-outline-variant/50"}`}>
                        <p className="text-body-sm text-outline">Drop here</p>
                      </div>
                    )}
                  </div>

                  {/* Add card button */}
                  <button
                    onClick={() => setShowAddDeal(true)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-outline-variant text-outline text-body-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add deal
                  </button>
                </div>
              );
            })}

            {/* Add Stage button */}
            <button
              onClick={() => setShowAddStage(true)}
              className="w-64 shrink-0 h-40 self-start rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-outline hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              <span className="material-symbols-outlined text-[28px]">add_column_right</span>
              <span className="text-label-md font-semibold">Add Stage</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
