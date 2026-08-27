"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import PageHeaderActions from "../components/PageHeaderActions";
import ActionDropdown from "../components/ActionDropdown";
import AppSelect from "../components/forms/AppSelect";
import NumericInput from "../components/forms/NumericInput";
import { api, ApiClientError } from "../lib/apiClient";
import { useToast } from "../components/ToastProvider";
import type { ClientDTO } from "@/types/clients";

interface Client {
    id: number;
    name: string;
    joinDate: string;
    email: string;
    phone: string;
    type: "Buyer" | "Seller" | "Investor";
    typeClass: string;
    activeDeals: number;
    closedDeals: number;
    budget: string;
    intent: string;
    intentClass: string;
    status: "Active" | "Pending" | "Inactive";
    statusColor: string;
    avatar: string;
}

const TYPE_CLASSES: Record<ClientDTO["type"], string> = {
    Buyer: "bg-primary/10 text-primary",
    Seller: "bg-secondary-container/50 text-secondary",
    Investor: "bg-tertiary/10 text-tertiary",
};

const STATUS_COLORS: Record<ClientDTO["status"], string> = {
    Active: "bg-tertiary",
    Pending: "bg-secondary",
    Inactive: "bg-error",
};

function intentClassOf(intent: string): string {
    if (/high|expansion|vip/i.test(intent)) return "text-tertiary";
    if (/financing|review/i.test(intent)) return "text-error";
    return "text-outline";
}

function formatJoinDate(value: string | null): string {
    if (!value) return "—";
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) return value;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function toClientRow(dto: ClientDTO): Client {
    return {
        id: dto.id,
        name: dto.name,
        joinDate: formatJoinDate(dto.joinedAt),
        email: dto.email ?? "—",
        phone: dto.phone ?? "—",
        type: dto.type,
        typeClass: TYPE_CLASSES[dto.type],
        activeDeals: dto.activeDeals,
        closedDeals: dto.closedDeals,
        budget: dto.budget ?? "—",
        intent: dto.intent ?? "—",
        intentClass: intentClassOf(dto.intent ?? ""),
        status: dto.status,
        statusColor: STATUS_COLORS[dto.status],
        avatar: dto.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.name)}&background=dbe1ff&color=004ac6&bold=true`,
    };
}

// Action menu for each row
function RowActionMenu({
    clientId,
    clientName,
    onDelete,
}: {
    clientId: number;
    clientName: string;
    onDelete: (id: number, name: string) => void;
}) {
    return (
        <ActionDropdown
            buttonClassName="p-2 hover:bg-surface-container-high rounded-lg text-outline-variant transition-colors group-hover:text-on-surface"
            items={[
                { label: "View Profile", icon: "visibility", href: `/clients/${clientId}` },
                { label: "Edit Client", icon: "edit" },
                { label: "Send Message", icon: "mail" },
                { label: "Schedule Follow-up", icon: "schedule" },
                { label: "Remove Client", icon: "delete", danger: true, onClick: () => onDelete(clientId, clientName) },
            ]}
        />
    );
}

// ── Add Client Modal ─────────────────────────────────────────────────────────
function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Client) => void }) {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", type: "Buyer" as "Buyer" | "Seller",
        budget: "", status: "Active" as "Active" | "Pending" | "Inactive",
    });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { error: toastError } = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        setSaving(true);
        try {
            const { data } = await api.post<ClientDTO>("/api/clients", {
                name: form.name.trim(),
                email: form.email.trim() || null,
                phone: form.phone.trim() || null,
                budget: form.budget.trim() || null,
                type: form.type,
                status: form.status,
            });
            setSaved(true);
            setTimeout(() => { onAdd(toClientRow(data)); onClose(); }, 1200);
        } catch (err) {
            setSaving(false);
            if (err instanceof ApiClientError) {
                if (err.fields) setErrors(err.fields);
                toastError(err.message === "Validation failed" ? "Please fix the highlighted fields." : err.message);
            } else {
                toastError("Something went wrong while saving the client.");
            }
        }
    }

    const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
        <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">{label}</label>
            {key === "phone" ? (
                <NumericInput
                    mode="phone"
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    placeholder={placeholder}
                    ariaLabel={label}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
                />
            ) : (
                <input
                    type={type}
                    required={key === "name"}
                    placeholder={placeholder}
                    value={form[key] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
                />
            )}
            {errors[key] && <p className="text-body-sm text-error mt-1">{errors[key]}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                    <div>
                        <h2 className="text-headline-md font-bold text-on-surface">Add New Client</h2>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">Fill in the client's information below.</p>
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
                        <p className="text-headline-md font-bold text-on-surface">Client Added!</p>
                        <p className="text-body-sm text-on-surface-variant mt-1">{form.name} has been added to your CRM.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {field("Full Name", "name", "text", "Eleanor Pemberton")}
                            {field("Email Address", "email", "email", "client@email.com")}
                        </div>
                        {field("Phone Number", "phone", "tel", "+1 (555) 000-0000")}
                        {field("Budget Range", "budget", "text", "$1M - $2.5M")}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Client Type</label>
                                <AppSelect
                                    instanceId="add-client-type"
                                    value={form.type}
                                    onChange={(v) => setForm((f) => ({ ...f, type: (v ?? "Buyer") as typeof f.type }))}
                                    options={["Buyer", "Seller"].map((t) => ({ value: t, label: t }))}
                                />
                            </div>
                            <div>
                                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Status</label>
                                <AppSelect
                                    instanceId="add-client-status"
                                    value={form.status}
                                    onChange={(v) => setForm((f) => ({ ...f, status: (v ?? "Active") as typeof f.status }))}
                                    options={["Active", "Pending", "Inactive"].map((s) => ({ value: s, label: s }))}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
                            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                {saving && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
                                {saving ? "Saving..." : "Add Client"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ── Activity Log Panel ────────────────────────────────────────────────────────
function ActivityLogPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const activities = [
        { icon: "visibility", bg: "bg-primary/10 text-primary", text: "Eleanor Pemberton viewed Luxury Villa, Beverly Hills", time: "2 minutes ago" },
        { icon: "check_circle", bg: "bg-tertiary/10 text-tertiary", text: "Site visit completed for Julian Rossi at Chelsea Heights.", time: "45 minutes ago" },
        { icon: "handshake", bg: "bg-secondary-container/50 text-secondary", text: "Deal initiated by Marcus Thorne for commercial plot #402.", time: "2 hours ago" },
        { icon: "upload_file", bg: "bg-surface-container-high text-on-surface-variant", text: "Proof of funds uploaded by Sarah Jenkins.", time: "Yesterday, 4:30 PM" },
        { icon: "mail", bg: "bg-secondary/10 text-secondary", text: "Email follow-up sent to James Wilson.", time: "2 days ago" },
        { icon: "call", bg: "bg-primary/10 text-primary", text: "Phone call with David Brooks regarding Midtown office.", time: "3 days ago" },
        { icon: "edit", bg: "bg-tertiary/10 text-tertiary", text: "Contract terms updated for Eleanor Pemberton.", time: "4 days ago" },
        { icon: "person_add", bg: "bg-primary/10 text-primary", text: "New client profile created for Julian Rossi.", time: "1 week ago" },
    ];

    return (
        <>
            {open && <div className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[1px]" onClick={onClose} />}
            <div className={`fixed top-0 right-0 h-full drawer-panel-right bg-surface-container-lowest border-l border-outline-variant/30 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                    <div>
                        <h2 className="text-headline-md font-bold text-on-surface">Client Activity Log</h2>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">Timeline of all client actions</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative before:content-[''] before:absolute before:left-[38px] before:top-8 before:bottom-8 before:w-[2px] before:bg-outline-variant/30">
                    {activities.map((activity, i) => (
                        <div key={i} className="relative pl-12">
                            <div className={`absolute left-2 top-0 w-8 h-8 ${activity.bg} rounded-full flex items-center justify-center z-10 border-4 border-surface-container-lowest`}>
                                <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
                            </div>
                            <div>
                                <p className="text-body-sm text-on-surface font-medium leading-snug">{activity.text}</p>
                                <p className="text-body-sm text-outline mt-1 italic">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default function ClientsPage() {
    const [activeTab, setActiveTab] = useState("All Clients");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [showAddClient, setShowAddClient] = useState(false);
    const [showActivityPanel, setShowActivityPanel] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const { success, error: toastError } = useToast();

    const loadClients = useCallback(async () => {
        try {
            const { data } = await api.get<ClientDTO[]>("/api/clients?pageSize=100");
            setClients(data.map(toClientRow));
        } catch (err) {
            toastError(err instanceof ApiClientError ? err.message : "Failed to load clients.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    async function handleDelete(id: number, name: string) {
        if (!window.confirm(`Remove client "${name}"? This can be undone by an administrator.`)) return;
        const previous = clients;
        setClients((list) => list.filter((c) => c.id !== id));
        try {
            await api.delete(`/api/clients/${id}`);
            success(`Client "${name}" removed.`);
        } catch (err) {
            setClients(previous);
            toastError(err instanceof ApiClientError ? err.message : "Failed to remove the client.");
        }
    }

    const filteredClients = clients.filter((client) => {
        if (activeTab === "Active Buyers" && client.type !== "Buyer") return false;
        if (activeTab === "Active Sellers" && client.type !== "Seller") return false;
        if (activeTab === "High Value" && !client.budget.includes("M")) return false;
        if (activeTab === "Returning Clients" && client.closedDeals === 0) return false;
        if (activeTab === "Inactive Clients" && client.status !== "Inactive") return false;
        if (typeFilter !== "All Types" && client.type !== typeFilter) return false;
        if (statusFilter !== "All Statuses" && client.status !== statusFilter) return false;
        if (
            searchQuery &&
            !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !client.email.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const tabs = [
        "All Clients",
        "Active Buyers",
        "Active Sellers",
        "High Value",
        "Returning Clients",
        "Inactive Clients",
    ];

    return (
        <>
            {showAddClient && (
                <AddClientModal
                    onClose={() => setShowAddClient(false)}
                    onAdd={(c) => setClients((prev) => [c, ...prev])}
                />
            )}
            <ActivityLogPanel
                open={showActivityPanel}
                onClose={() => setShowActivityPanel(false)}
            />
            {/* TopNavBar — matches Stitch exactly */}
            <header className="min-h-[4.5rem] py-3 sm:py-0 sm:h-20 bg-background flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 lg:px-8 sticky top-14 lg:top-0 z-40 border-b border-outline-variant/30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 max-w-2xl min-w-0 w-full">
                    <h1 className="text-headline-xl font-headline-xl text-on-surface shrink-0">
                        All Clients
                    </h1>
                    <div className="relative w-full sm:ml-4 lg:ml-8">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                            search
                        </span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-body-md outline-none transition-all"
                            placeholder="Search clients, emails, or properties..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-surface-container-high transition-colors text-label-md ${showFilters ? "bg-surface-container-high border-primary text-primary" : "border-outline-variant"}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            Filter
                        </button>
                        {showFilters && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-4 z-50">
                                <h3 className="text-label-md font-bold mb-3">Filter Clients</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-label-sm text-secondary block mb-1">Client Type</label>
                                        <AppSelect
                                            instanceId="client-type-filter"
                                            size="sm"
                                            value={typeFilter}
                                            onChange={(v) => setTypeFilter(v ?? "All Types")}
                                            isClearable={typeFilter !== "All Types"}
                                            options={["All Types", "Buyer", "Seller"].map((t) => ({ value: t, label: t }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-label-sm text-secondary block mb-1">Status</label>
                                        <AppSelect
                                            instanceId="client-status-filter"
                                            size="sm"
                                            value={statusFilter}
                                            onChange={(v) => setStatusFilter(v ?? "All Statuses")}
                                            isClearable={statusFilter !== "All Statuses"}
                                            options={["All Statuses", "Active", "Pending", "Inactive"].map((s) => ({ value: s, label: s }))}
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
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors text-label-md">
                        <span className="material-symbols-outlined text-[20px]">ios_share</span>
                        Export
                    </button>
                    <button
                        onClick={() => setShowAddClient(true)}
                        className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all text-label-md font-bold shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)]"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add Client
                    </button>
                    <div className="flex items-center gap-2 ml-4 border-l border-outline-variant/30 pl-4">
                        <PageHeaderActions />
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
                {/* Section 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* KPI 1 — Total Clients */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10 group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary/5 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                            <span className="text-tertiary flex items-center gap-1 text-label-sm font-bold bg-tertiary/10 px-2 py-1 rounded-full">
                                +12.5% <span className="material-symbols-outlined text-sm">trending_up</span>
                            </span>
                        </div>
                        <p className="text-label-md text-outline font-medium">Total Clients</p>
                        <h3 className="text-metric-lg font-metric-lg mt-1 font-extrabold">2,482</h3>
                        <div className="mt-4 h-12 w-full flex items-end gap-[2px]">
                            <div className="bg-primary-fixed-dim/40 h-[40%] flex-1 rounded-t-sm" />
                            <div className="bg-primary-fixed-dim/40 h-[60%] flex-1 rounded-t-sm" />
                            <div className="bg-primary-fixed-dim/40 h-[45%] flex-1 rounded-t-sm" />
                            <div className="bg-primary-fixed-dim/40 h-[75%] flex-1 rounded-t-sm" />
                            <div className="bg-primary h-[90%] flex-1 rounded-t-sm" />
                        </div>
                    </div>
                    {/* KPI 2 — Active Buyers */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10 group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary/5 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">shopping_cart</span>
                            </div>
                            <span className="text-tertiary flex items-center gap-1 text-label-sm font-bold bg-tertiary/10 px-2 py-1 rounded-full">
                                +8.2% <span className="material-symbols-outlined text-sm">trending_up</span>
                            </span>
                        </div>
                        <p className="text-label-md text-outline font-medium">Active Buyers</p>
                        <h3 className="text-metric-lg font-metric-lg mt-1 font-extrabold">1,124</h3>
                        <div className="mt-4 h-12 w-full flex items-end gap-[2px]">
                            <div className="bg-secondary-fixed-dim/40 h-[30%] flex-1 rounded-t-sm" />
                            <div className="bg-secondary-fixed-dim/40 h-[50%] flex-1 rounded-t-sm" />
                            <div className="bg-secondary-fixed-dim/40 h-[80%] flex-1 rounded-t-sm" />
                            <div className="bg-secondary-fixed-dim/40 h-[55%] flex-1 rounded-t-sm" />
                            <div className="bg-primary h-[85%] flex-1 rounded-t-sm" />
                        </div>
                    </div>
                    {/* KPI 3 — Sellers */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10 group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary/5 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">account_balance</span>
                            </div>
                            <span className="text-tertiary flex items-center gap-1 text-label-sm font-bold bg-tertiary/10 px-2 py-1 rounded-full">
                                +18.4% <span className="material-symbols-outlined text-sm">trending_up</span>
                            </span>
                        </div>
                        <p className="text-label-md text-outline font-medium">Active Sellers</p>
                        <h3 className="text-metric-lg font-metric-lg mt-1 font-extrabold">452</h3>
                        <div className="mt-4 h-12 w-full flex items-end gap-[2px]">
                            <div className="bg-tertiary-fixed-dim/40 h-[60%] flex-1 rounded-t-sm" />
                            <div className="bg-tertiary-fixed-dim/40 h-[40%] flex-1 rounded-t-sm" />
                            <div className="bg-tertiary-fixed-dim/40 h-[70%] flex-1 rounded-t-sm" />
                            <div className="bg-tertiary-fixed-dim/40 h-[90%] flex-1 rounded-t-sm" />
                            <div className="bg-primary h-[80%] flex-1 rounded-t-sm" />
                        </div>
                    </div>
                    {/* KPI 4 — Returning Clients */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10 group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary/5 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">history</span>
                            </div>
                            <span className="text-error flex items-center gap-1 text-label-sm font-bold bg-error-container/20 px-2 py-1 rounded-full">
                                -2.1% <span className="material-symbols-outlined text-sm">trending_down</span>
                            </span>
                        </div>
                        <p className="text-label-md text-outline font-medium">Returning Clients</p>
                        <h3 className="text-metric-lg font-metric-lg mt-1 font-extrabold">316</h3>
                        <div className="mt-4 h-12 w-full flex items-end gap-[2px]">
                            <div className="bg-outline-variant/40 h-[80%] flex-1 rounded-t-sm" />
                            <div className="bg-outline-variant/40 h-[90%] flex-1 rounded-t-sm" />
                            <div className="bg-outline-variant/40 h-[75%] flex-1 rounded-t-sm" />
                            <div className="bg-outline-variant/40 h-[60%] flex-1 rounded-t-sm" />
                            <div className="bg-primary h-[55%] flex-1 rounded-t-sm" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Quick Filter Tabs */}
                <div className="border-b border-outline-variant/30 flex items-center gap-8 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-1 py-4 border-b-2 font-semibold text-label-md whitespace-nowrap transition-colors duration-200 ${isActive ? "border-primary text-primary font-bold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Section 3: Two-Column Layout */}
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Left: Data Table */}
                    <div className="xl:w-3/4 space-y-6">
                        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10 overflow-hidden">
                            <div className="table-responsive custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                        <tr>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                                                Client Name
                                            </th>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                                                Deals
                                            </th>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                                                Budget
                                            </th>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-label-sm text-outline font-semibold uppercase tracking-wider" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/20">
                                        {loading &&
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <tr key={`skeleton-${i}`} className="animate-pulse">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0" />
                                                            <div className="space-y-2">
                                                                <div className="h-3 w-32 bg-surface-container-high rounded" />
                                                                <div className="h-2.5 w-20 bg-surface-container rounded" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4"><div className="h-3 w-36 bg-surface-container-high rounded" /></td>
                                                    <td className="px-6 py-4"><div className="h-6 w-16 bg-surface-container-high rounded-full" /></td>
                                                    <td className="px-6 py-4"><div className="h-3 w-24 bg-surface-container-high rounded" /></td>
                                                    <td className="px-6 py-4"><div className="h-3 w-24 bg-surface-container-high rounded" /></td>
                                                    <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-container-high rounded" /></td>
                                                    <td className="px-6 py-4" />
                                                </tr>
                                            ))}
                                        {!loading && filteredClients.map((client) => (
                                            <tr
                                                key={client.id}
                                                className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-5">
                                                    <Link
                                                        href={`/clients/${client.id}`}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <img
                                                            alt={client.name}
                                                            className="w-10 h-10 rounded-full object-cover shrink-0"
                                                            src={client.avatar}
                                                        />
                                                        <div>
                                                            <p className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                                                                {client.name}
                                                            </p>
                                                            <p className="text-body-sm text-outline">
                                                                Joined {client.joinDate}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-body-md font-medium text-on-surface">
                                                        {client.email}
                                                    </p>
                                                    <p className="text-body-sm text-outline">{client.phone}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`px-3 py-1 text-label-sm font-bold rounded-full ${client.typeClass}`}
                                                    >
                                                        {client.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-body-md font-bold text-on-surface">
                                                        {client.activeDeals} Active
                                                    </p>
                                                    <p className="text-body-sm text-outline">
                                                        {client.closedDeals} Closed
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-body-md font-bold text-on-surface">
                                                        {client.budget}
                                                    </p>
                                                    <p className={`text-body-sm ${client.intentClass}`}>
                                                        {client.intent}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${client.statusColor}`}
                                                        />
                                                        <span className="text-label-md text-on-surface-variant font-medium">
                                                            {client.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <RowActionMenu clientId={client.id} clientName={client.name} onDelete={handleDelete} />
                                                </td>
                                            </tr>
                                        ))}
                                        {!loading && filteredClients.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-6 py-12 text-center text-outline text-body-md"
                                                >
                                                    No clients match the selected filter.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low/30">
                                <p className="text-body-sm text-outline">
                                    Showing 1 to {filteredClients.length} of{" "}
                                    {filteredClients.length} clients
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors text-outline"
                                        disabled
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            chevron_left
                                        </span>
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-label-sm">
                                        1
                                    </button>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors text-outline"
                                        disabled
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            chevron_right
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Insights & Recent Activity */}
                    <div className="xl:w-1/4 space-y-8">
                        {/* Client Insights */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10">
                            <h4 className="text-headline-md font-headline-md mb-6 font-semibold">
                                Client Insights
                            </h4>
                            {/* Donut chart */}
                            <div className="flex flex-col items-center text-center pb-6 border-b border-outline-variant/30">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg
                                        className="w-full h-full -rotate-90"
                                        viewBox="0 0 128 128"
                                    >
                                        <circle
                                            cx="64"
                                            cy="64"
                                            fill="transparent"
                                            r="58"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-surface-container-high"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            fill="transparent"
                                            r="58"
                                            stroke="currentColor"
                                            strokeDasharray="364"
                                            strokeDashoffset="110"
                                            strokeWidth="8"
                                            className="text-primary"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-headline-lg font-bold text-on-surface">
                                            70%
                                        </span>
                                        <span className="text-[10px] text-outline font-bold uppercase tracking-tighter">
                                            Conversion
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-4 text-body-sm text-outline">
                                    Conversion rate improved by{" "}
                                    <span className="text-tertiary font-bold">+5%</span> this
                                    month.
                                </p>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] border border-outline-variant/10">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-headline-md font-headline-md font-semibold">
                                    Recent Activities
                                </h4>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-outline-variant transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">
                                        refresh
                                    </span>
                                </button>
                            </div>
                            <div className="space-y-6 relative before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
                                {[
                                    { icon: "visibility", bg: "bg-primary/10 text-primary", text: <><span className="font-bold">Eleanor Pemberton</span> viewed <span className="text-primary hover:underline cursor-pointer">Luxury Villa, Beverly Hills</span></>, time: "2 minutes ago" },
                                    { icon: "check_circle", bg: "bg-tertiary/10 text-tertiary", text: <>Site visit completed for <span className="font-bold">Julian Rossi</span> at Chelsea Heights.</>, time: "45 minutes ago" },
                                    { icon: "handshake", bg: "bg-secondary-container/50 text-secondary", text: <>Deal initiated by <span className="font-bold">Marcus Thorne</span> for commercial plot #402.</>, time: "2 hours ago" },
                                    { icon: "upload_file", bg: "bg-surface-container-high text-on-surface-variant", text: <>Proof of funds uploaded by <span className="font-bold">Sarah Jenkins</span>.</>, time: "Yesterday, 4:30 PM" },
                                ].map((activity, i) => (
                                    <div key={i} className="relative pl-10">
                                        <div
                                            className={`absolute left-0 top-0 w-8 h-8 ${activity.bg} rounded-full flex items-center justify-center z-10 border-4 border-surface-container-lowest`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                {activity.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-body-sm text-on-surface font-medium leading-snug">
                                                {activity.text}
                                            </p>
                                            <p className="text-body-sm text-outline mt-1 italic">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowActivityPanel(true)}
                                className="w-full mt-6 py-2 bg-surface-container-low text-on-surface-variant text-label-sm font-bold rounded-lg hover:bg-surface-container-high transition-colors"
                            >
                                View All Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
