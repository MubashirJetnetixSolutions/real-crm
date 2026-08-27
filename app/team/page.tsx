"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeaderActions from "../components/PageHeaderActions";
import ActionDropdown from "../components/ActionDropdown";
import AppSelect from "../components/forms/AppSelect";
import { useUserProfile } from "../components/UserProfileProvider";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AgentTarget {
    type: "deals" | "value";
    value: number;           // number of deals OR dollar amount
    durationMonths: number;  // total target duration in months
    startDate: string;       // ISO date string
    dealsAchieved: number;
    valueAchieved: number;   // in dollars
}

interface Agent {
    id: string;
    name: string;
    role: string;
    region: string;
    status: string;
    statusClass: string;
    deals: number;
    revenue: string;
    progress: number;
    avatar: string;
    target: AgentTarget;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function remainingLabel(startDate: string, durationMonths: number): string {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Overdue";
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} Days Left`;
    const diffMonths = Math.round(diffDays / 30);
    return `${diffMonths} Month${diffMonths !== 1 ? "s" : ""} Left`;
}

function dealsProgress(target: AgentTarget): number {
    if (target.type === "deals") {
        return Math.min(Math.round((target.dealsAchieved / target.value) * 100), 100);
    }
    return Math.min(Math.round((target.valueAchieved / target.value) * 100), 100);
}

function fmtDollars(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
}

function getProgressBarColor(pct: number, target: AgentTarget): string {
    // If target progress is >= 80%, show green
    if (pct >= 80) {
        return "bg-emerald-500";
    }

    // Calculate remaining time
    const start = new Date(target.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + target.durationMonths);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const isOverdue = diffMs <= 0;
    const isOneMonthOrLess = diffDays <= 30;

    // If overdue and target < 80%
    if (isOverdue) {
        return "bg-error";
    }

    // 1. If duration > 3 months, and 1 month or less remaining, and target < 80%
    if (target.durationMonths > 3 && isOneMonthOrLess && pct < 80) {
        return "bg-error";
    }

    // 2. If duration < 3 months, and target < 80%
    if (target.durationMonths < 3 && pct < 80) {
        return "bg-error";
    }

    // 3. If duration === 1 month, and target < 80%
    if (target.durationMonths === 1 && pct < 80) {
        return "bg-error";
    }

    // otherwise standard color
    return "bg-primary";
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialAgents: Agent[] = [
    {
        id: "1", name: "Marcus Holloway", role: "Senior Property Advisor", region: "Beverly Hills",
        status: "Top Performer", statusClass: "bg-tertiary text-on-tertiary",
        deals: 24, revenue: "$4.8M", progress: 92,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5c_f7JIMFz2A6T0EfLL-fcKd6GW_-QV3_X2HObN-bbLuSa4-KssG_56C75OAtg9xoyOoZLd_hnJRiOVhUTp4jDYIxFZn3oarS0sPKtyTSxiQHtekUnB94zuJDD30ETy_4MmZ0gZ-Mc9BaS7sFgc9lRP8Cmx0Fll9VT47ZD4uyCfnilHxB5nM_zJXOQ5IwSMBpl1RydikZ9r075LsGtua7txzo7D2mB_aWxBYanN0f6gY4mApjtBsleX7vNAH3kzR-oMHSzoJVxif",
        target: { type: "deals", value: 30, durationMonths: 12, startDate: "2026-01-01", dealsAchieved: 24, valueAchieved: 4800000 },
    },
    {
        id: "2", name: "Elena Rodriguez", role: "Investment Specialist", region: "Manhattan",
        status: "Active", statusClass: "bg-primary text-on-primary",
        deals: 18, revenue: "$3.1M", progress: 78,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxE0jce8vE5W-dXmkGl1J03gaZn0Mm21Rt6vxzFUsmsXnMVXQbOfX9Q1mKs4rp8cIWMuCRm_njeN1gINtsBbmhrxTZHz1l0ykdI4uHwzglzdfYA1MCakwWPrlvhL7Eq_VS7kKnmaCqYzSSCl52xFTfH5FYn1z03yfwxvA4ujKrbJM9daA9MVyWwa2Y1WS3IMyNgOYmsF-7S8Y-uj6p6SBStO5eVcTR6F6daip2zma3bweW88_WTNQ7aW7rZufpSJWkp1nZ4QYoUdWc",
        target: { type: "value", value: 5000000, durationMonths: 6, startDate: "2026-06-01", dealsAchieved: 18, valueAchieved: 3100000 },
    },
    {
        id: "3", name: "David Chen", role: "Commercial Lead", region: "San Francisco",
        status: "On Leave", statusClass: "bg-surface-container-highest text-on-surface-variant",
        deals: 15, revenue: "$5.2M", progress: 85,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC94YvfWylQL3Qxxl91UYJHn7feg10NLuPV3YGfckmGCtxooVWlOognlxGRrPKfuGGIIgQwkC0U2IfTeTufE3ULqEVUMGwC8IEyyZ6m4zdjKaZ-WMUP3qWrw4wRVqjZgQhRUnuQsji31DNAOvdg9WXJ5EobnQ6p0rZXKPna3PncleBpCguw5M1PhdRyPsVl4VU3T2bx1u9ut_w7leNCSx3tcpDpDf0Yo-cWbmTmgekBa4GjA0RE0Yf02B8ssydWD49RukSEd5Lij5ym",
        target: { type: "value", value: 8000000, durationMonths: 12, startDate: "2026-01-01", dealsAchieved: 15, valueAchieved: 5200000 },
    },
    {
        id: "4", name: "Sarah Chen", role: "Luxury Property Expert", region: "Miami Beach",
        status: "Active", statusClass: "bg-primary text-on-primary",
        deals: 21, revenue: "$7.4M", progress: 88,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfyXqMv17C8qKjS4J8fpR-p0CZRMyhEzWviTvh9Cbx6meNDQun_MtBdoHouJ8mmDRU-CC2WsPxH2KPXQ9hSoH2D-6Zp47I9xD6xvNJ0Kj35LFY4i2RNTb1orEToZ-92wbbNTf8b8GcayqKE2oh61syElA37CtBDUcjmzt5qoom5FwRgyNtNKUR8PoIhnZwGiVK2aUUIsj2ffpbYnUN4znM5UrZ7sOtVkF9YTGhJ5fTAgmpMQrnw7Y5Saej0b2iW4xMNZOfK_den3b",
        target: { type: "deals", value: 25, durationMonths: 9, startDate: "2026-04-01", dealsAchieved: 21, valueAchieved: 7400000 },
    },
    {
        id: "5", name: "James Wilson", role: "Commercial Broker", region: "Chicago",
        status: "Active", statusClass: "bg-primary text-on-primary",
        deals: 11, revenue: "$8.0M", progress: 64,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY0b9eHrjInYaFSha32W7PWhhqgvbqnRoV4D-8MFTRQS7JY-eKP9aTIRBgynhZQ5x1EkkgUrXYr6aJvv_v2dxuoqQvhEQVRTRZVmJFuaDMK01tcoSEOMfI0oqm4G-4-_rHQrddHqki4jKs8bqfeALVUF7v87yneY8ikhQsAHkBQ0y0YE1S7QkH_BbWnWP4k6r3HprqkS1bt_m-Dn0EqeluDAURSRlKXuHA8jTdQT4FzDZBPJa4Tp8JFLE65UxrtKHYI7-XF4U94p",
        target: { type: "value", value: 12000000, durationMonths: 12, startDate: "2026-01-01", dealsAchieved: 11, valueAchieved: 8000000 },
    },
    {
        id: "6", name: "Emily Davis", role: "Junior Agent", region: "Boston",
        status: "Active", statusClass: "bg-primary text-on-primary",
        deals: 6, revenue: "$1.2M", progress: 45,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaixkSM7JEg6ovIeFdRUmqMkyw-eu7Ae3sTZMIzl-thHLmQY13aMLwrR4YDzSjmjcGpbmr7VQ-joNkjmPcOqEUjUW9Ul-B7PhbRtdZXuk-f0nscKryZQ_GL95WB2EhCaRxbfW-ExpybPJn6MqtavdnbHaNk4JGqlJiHkSkAs_yzWPMhbMURfeLwYoOeyWCcrYiXXvlcAwq9RnomKTrfJgPSeqqCyDha91hYLHoe6lQGbyTjcCQX2Ye3toLK36RgRsBmJ9B2-QdMKkg",
        target: { type: "deals", value: 15, durationMonths: 6, startDate: "2026-07-01", dealsAchieved: 6, valueAchieved: 1200000 },
    },
];

// ─── Edit Agent Modal ────────────────────────────────────────────────────────

function EditAgentModal({ agent, onClose, onSave }: {
    agent: Agent;
    onClose: () => void;
    onSave: (agent: Agent) => void;
}) {
    const [form, setForm] = useState({ name: agent.name, role: agent.role, region: agent.region, status: agent.status });
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const statusClass = form.status === "Top Performer"
            ? "bg-tertiary text-on-tertiary"
            : form.status === "Active"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface-variant";
        onSave({ ...agent, name: form.name, role: form.role, region: form.region, status: form.status, statusClass });
        setSaved(true);
        setTimeout(onClose, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                    <h2 className="text-headline-md font-bold text-on-surface">Edit Agent Profile</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
                    </button>
                </div>
                {saved ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <p className="text-headline-md font-bold text-on-surface">Profile Saved!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {[["name", "Agent Name *"], ["role", "Role *"], ["region", "Region *"]].map(([key, label]) => (
                            <div key={key}>
                                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">{label}</label>
                                <input required type="text" value={form[key as keyof typeof form]}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>
                        ))}
                        <div>
                            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Status *</label>
                            <AppSelect instanceId="edit-member-status" value={form.status}
                                onChange={(v) => setForm((f) => ({ ...f, status: v ?? "Active" }))}
                                options={["Active", "Top Performer", "On Leave"].map((s) => ({ value: s, label: s }))} />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Save Changes</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Add Agent Modal ─────────────────────────────────────────────────────────

function AddAgentModal({ onClose, onAdd }: {
    onClose: () => void;
    onAdd: (agent: Agent) => void;
}) {
    const [form, setForm] = useState({ name: "", role: "", region: "", status: "Active" });
    const [targetType, setTargetType] = useState<"deals" | "value">("deals");
    const [targetAmount, setTargetAmount] = useState("");
    const [targetDuration, setTargetDuration] = useState("12");
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.role || !form.region || !targetAmount) return;
        const statusClass = form.status === "Top Performer"
            ? "bg-tertiary text-on-tertiary"
            : form.status === "Active"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface-variant";

        const newAgent: Agent = {
            id: Date.now().toString(),
            name: form.name, role: form.role, region: form.region,
            status: form.status, statusClass,
            deals: 0, revenue: "$0", progress: 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=004AC6&color=fff&size=200`,
            target: {
                type: targetType,
                value: Number(targetAmount),
                durationMonths: Number(targetDuration),
                startDate: new Date().toISOString().split("T")[0],
                dealsAchieved: 0,
                valueAchieved: 0,
            },
        };
        onAdd(newAgent);
        setSaved(true);
        setTimeout(onClose, 900);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10 max-h-[90dvh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 shrink-0">
                    <div>
                        <h2 className="text-headline-md font-bold text-on-surface">Add New Agent</h2>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">Fill in profile details and set an initial target.</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
                    </button>
                </div>

                {saved ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <p className="text-headline-md font-bold text-on-surface">Agent Added!</p>
                        <p className="text-body-sm text-on-surface-variant mt-1">Target has been set successfully.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
                        {/* Profile */}
                        <div>
                            <p className="text-label-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">person</span>Agent Profile
                            </p>
                            <div className="space-y-3">
                                {[["name", "Agent Name *", "text"], ["role", "Job Title / Role *", "text"], ["region", "Region *", "text"]].map(([key, label]) => (
                                    <div key={key}>
                                        <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">{label}</label>
                                        <input required type="text" value={form[key as keyof typeof form]}
                                            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Status *</label>
                                    <AppSelect instanceId="add-member-status" value={form.status}
                                        onChange={(v) => setForm((f) => ({ ...f, status: v ?? "Active" }))}
                                        options={["Active", "Top Performer", "On Leave"].map((s) => ({ value: s, label: s }))} />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-outline-variant/30" />

                        {/* Target Setup */}
                        <div>
                            <p className="text-label-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">track_changes</span>Initial Target
                            </p>
                            <div className="space-y-4">
                                {/* Duration */}
                                <div>
                                    <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Target Duration (Months) *</label>
                                    <input required type="number" min="1" max="60" value={targetDuration}
                                        onChange={(e) => setTargetDuration(e.target.value)}
                                        placeholder="e.g. 12"
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </div>

                                {/* Target Type Radio */}
                                <div>
                                    <label className="text-label-sm text-on-surface-variant font-medium block mb-2.5">Target Type *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(["deals", "value"] as const).map((t) => (
                                            <label
                                                key={t}
                                                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${targetType === t
                                                    ? "border-primary bg-primary/5"
                                                    : "border-outline-variant/40 hover:border-primary/30 hover:bg-surface-container-low"
                                                    }`}
                                            >
                                                {/* Custom Radio */}
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${targetType === t ? "border-primary" : "border-outline-variant"}`}>
                                                    {targetType === t && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                </div>
                                                <input type="radio" name="targetType" value={t} checked={targetType === t}
                                                    onChange={() => { setTargetType(t); setTargetAmount(""); }} className="sr-only" />
                                                <div>
                                                    <p className={`text-label-sm font-bold ${targetType === t ? "text-primary" : "text-on-surface"}`}>
                                                        {t === "deals" ? "By Deals" : "By Value ($)"}
                                                    </p>
                                                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                                                        {t === "deals" ? "Set total deals to close" : "Set a revenue target in dollars"}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">
                                        {targetType === "deals" ? "Total Deals Target *" : "Total Revenue Target ($) *"}
                                    </label>
                                    <div className="relative">
                                        {targetType === "value" && (
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">$</span>
                                        )}
                                        <input required type="number" min="1" value={targetAmount}
                                            onChange={(e) => setTargetAmount(e.target.value)}
                                            placeholder={targetType === "deals" ? "e.g. 30" : "e.g. 5000000"}
                                            className={`w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${targetType === "value" ? "pl-7 pr-3" : "px-3"}`} />
                                    </div>
                                    {targetType === "value" && targetAmount && (
                                        <p className="text-[11px] text-on-surface-variant mt-1">= {fmtDollars(Number(targetAmount))}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">person_add</span>Add Agent
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Edit Target Modal ────────────────────────────────────────────────────────

function EditTargetModal({ agent, onClose, onSave }: {
    agent: Agent;
    onClose: () => void;
    onSave: (target: AgentTarget) => void;
}) {
    const [targetType, setTargetType] = useState<"deals" | "value">(agent.target.type);
    const [targetAmount, setTargetAmount] = useState(agent.target.value.toString());
    const [targetDuration, setTargetDuration] = useState(agent.target.durationMonths.toString());
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...agent.target,
            type: targetType,
            value: Number(targetAmount),
            durationMonths: Number(targetDuration),
        });
        setSaved(true);
        setTimeout(onClose, 700);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                    <div>
                        <h2 className="text-headline-md font-bold text-on-surface">Edit Target</h2>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">{agent.name}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
                    </button>
                </div>

                {saved ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <p className="text-headline-sm font-bold text-on-surface">Target Updated!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Duration */}
                        <div>
                            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Target Duration (Months) *</label>
                            <input required type="number" min="1" max="60" value={targetDuration}
                                onChange={(e) => setTargetDuration(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>

                        {/* Target Type Radio */}
                        <div>
                            <label className="text-label-sm text-on-surface-variant font-medium block mb-2.5">Target Type *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {(["deals", "value"] as const).map((t) => (
                                    <label
                                        key={t}
                                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${targetType === t
                                            ? "border-primary bg-primary/5"
                                            : "border-outline-variant/40 hover:border-primary/30 hover:bg-surface-container-low"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${targetType === t ? "border-primary" : "border-outline-variant"}`}>
                                            {targetType === t && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                        <input type="radio" name="editTargetType" value={t} checked={targetType === t}
                                            onChange={() => { setTargetType(t); setTargetAmount(""); }} className="sr-only" />
                                        <div>
                                            <p className={`text-label-sm font-bold ${targetType === t ? "text-primary" : "text-on-surface"}`}>
                                                {t === "deals" ? "By Deals" : "By Value ($)"}
                                            </p>
                                            <p className="text-[11px] text-on-surface-variant mt-0.5">
                                                {t === "deals" ? "Total deals to close" : "Revenue in dollars"}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">
                                {targetType === "deals" ? "Total Deals Target *" : "Total Revenue Target ($) *"}
                            </label>
                            <div className="relative">
                                {targetType === "value" && (
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">$</span>
                                )}
                                <input required type="number" min="1" value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder={targetType === "deals" ? "e.g. 30" : "e.g. 5000000"}
                                    className={`w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${targetType === "value" ? "pl-7 pr-3" : "px-3"}`} />
                            </div>
                            {targetType === "value" && targetAmount && (
                                <p className="text-[11px] text-on-surface-variant mt-1">= {fmtDollars(Number(targetAmount))}</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Save Target</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Reset Target Confirm ────────────────────────────────────────────────────

function ResetTargetConfirm({ agent, onClose, onConfirm }: {
    agent: Agent;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10">
                <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-[30px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>restart_alt</span>
                    </div>
                    <h3 className="text-headline-sm font-bold text-on-surface mb-2">Reset Target?</h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        This will reset <strong>{agent.name}</strong>&apos;s progress to zero. The target value and duration will remain unchanged.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
                        <button
                            type="button"
                            onClick={() => { onConfirm(); onClose(); }}
                            className="flex-1 py-2.5 bg-error text-on-error rounded-lg text-label-md font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                            Yes, Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Dual Progress Bar Component ──────────────────────────────────────────────

function DualProgressBar({ agent }: { agent: Agent }) {
    const t = agent.target;
    const remainLabel = remainingLabel(t.startDate, t.durationMonths);
    const pct = dealsProgress(t);
    const barColor = getProgressBarColor(pct, t);

    // Values to display
    const achievedLabel = t.type === "deals"
        ? `${t.dealsAchieved} Deals Achieved`
        : `${fmtDollars(t.valueAchieved)} Achieved`;
    const targetLabel = t.type === "deals"
        ? `${t.dealsAchieved} / ${t.value} Deals`
        : `${fmtDollars(t.valueAchieved)} / ${fmtDollars(t.value)}`;
    const durationLabel = `${t.durationMonths} Month${t.durationMonths !== 1 ? "s" : ""} Duration`;

    return (
        <div className="space-y-1">
            {/* Row 1: labels */}
            <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-on-surface-variant font-medium">{achievedLabel}</span>
                <span className="text-[11px] font-bold text-on-surface">{targetLabel}</span>
            </div>
            {/* Bar */}
            <div className="h-2.5 bg-surface-container rounded-full overflow-hidden border border-outline-variant/20 relative">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {/* Row 2: duration labels */}
            <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-on-surface-variant">{durationLabel}</span>
                <span className={`text-[11px] font-bold ${remainLabel === "Overdue" ? "text-error" : remainLabel.includes("Days") || remainLabel.startsWith("1 Month") ? "text-amber-600" : "text-on-surface-variant"}`}>
                    {remainLabel}
                </span>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TeamPage() {
    const { avatar } = useUserProfile();
    const [teamList, setTeamList] = useState<Agent[]>(initialAgents);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [showProductivity, setShowProductivity] = useState(false);
    const [showAddAgent, setShowAddAgent] = useState(false);
    const [editTargetAgent, setEditTargetAgent] = useState<Agent | null>(null);
    const [resetTargetAgent, setResetTargetAgent] = useState<Agent | null>(null);

    const filtered = teamList.filter(
        (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function updateAgent(updated: Agent) {
        setTeamList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }

    function handleResetTarget(agentId: string) {
        setTeamList((prev) => prev.map((a) =>
            a.id === agentId
                ? { ...a, target: { ...a.target, dealsAchieved: 0, valueAchieved: 0 }, deals: 0, revenue: "$0", progress: 0 }
                : a
        ));
    }

    function handleEditTarget(agentId: string, newTarget: AgentTarget) {
        setTeamList((prev) => prev.map((a) =>
            a.id === agentId ? { ...a, target: newTarget, progress: dealsProgress(newTarget) } : a
        ));
    }

    return (
        <>
            {/* Modals */}
            {showProductivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductivity(false)} />
                    <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                            <h2 className="text-headline-md font-bold text-on-surface">Team Productivity</h2>
                            <button onClick={() => setShowProductivity(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-end gap-2 h-40 px-2">
                                {[40, 60, 85, 95].map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: `rgba(0,74,198,${0.2 + i * 0.25})` }} />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                                    <p className="text-metric-md font-bold text-primary">1,248</p>
                                    <p className="text-label-sm text-outline">Completed Tasks</p>
                                </div>
                                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                                    <p className="text-metric-md font-bold text-primary">452</p>
                                    <p className="text-label-sm text-outline">Client Meetings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingAgent && (
                <EditAgentModal agent={editingAgent} onClose={() => setEditingAgent(null)}
                    onSave={(updated) => { updateAgent(updated); setEditingAgent(null); }} />
            )}
            {showAddAgent && (
                <AddAgentModal onClose={() => setShowAddAgent(false)}
                    onAdd={(a) => setTeamList((prev) => [a, ...prev])} />
            )}
            {editTargetAgent && (
                <EditTargetModal agent={editTargetAgent} onClose={() => setEditTargetAgent(null)}
                    onSave={(newTarget) => { handleEditTarget(editTargetAgent.id, newTarget); setEditTargetAgent(null); }} />
            )}
            {resetTargetAgent && (
                <ResetTargetConfirm agent={resetTargetAgent} onClose={() => setResetTargetAgent(null)}
                    onConfirm={() => handleResetTarget(resetTargetAgent.id)} />
            )}

            {/* Top App Bar */}
            <header className="app-fixed-header bg-surface border-b border-outline-variant z-40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 lg:px-gutter py-3 sm:py-0 sm:min-h-[5rem]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1 min-w-0 w-full">
                    <h2 className="text-headline-lg text-on-surface font-bold shrink-0">Agent Grid</h2>
                    <div className="relative w-full sm:max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none"
                            placeholder="Search agents by name or region..."
                            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end w-full sm:w-auto">
                    <div className="flex items-center bg-surface-container-low rounded-lg p-1">
                        <button onClick={() => setViewMode("grid")} className={`px-3 py-1 rounded-md transition-all ${viewMode === "grid" ? "bg-white ambient-shadow text-primary" : "text-on-surface-variant"}`}>
                            <span className="material-symbols-outlined">grid_view</span>
                        </button>
                        <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded-md transition-all ${viewMode === "list" ? "bg-white ambient-shadow text-primary" : "text-on-surface-variant"}`}>
                            <span className="material-symbols-outlined">list</span>
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAddAgent(true)}
                        className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Add Agent
                    </button>
                    <div className="h-8 w-px bg-outline-variant mx-1" />
                    <PageHeaderActions />
                    <Link href="/settings" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant block">
                        <img alt="Profile" className="w-full h-full object-cover" src={avatar} />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <div className="px-4 sm:px-6 lg:px-gutter py-4 sm:py-gutter space-y-section-gap">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                        <div className="bg-white p-card-padding rounded-xl ambient-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-on-surface-variant text-label-md">Total Agents</span>
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined">groups</span></div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-metric-lg font-extrabold">42</span>
                                <span className="text-tertiary text-label-sm bg-tertiary/10 px-2 py-0.5 rounded-full">+4%</span>
                            </div>
                            <div className="mt-4 flex items-end gap-1 h-8">
                                {[35, 55, 42, 68, 78].map((h, i) => (<div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%`, opacity: 0.25 + i * 0.15 }} />))}
                            </div>
                        </div>
                        <div className="bg-white p-card-padding rounded-xl ambient-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-on-surface-variant text-label-md">Top Sellers</span>
                                <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary"><span className="material-symbols-outlined">military_tech</span></div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-metric-lg font-extrabold">12</span>
                                <span className="text-tertiary text-label-sm bg-tertiary/10 px-2 py-0.5 rounded-full">+2</span>
                            </div>
                            <div className="mt-4 flex items-end gap-1 h-8">
                                {[30, 60, 45, 85, 70].map((h, i) => (<div key={i} className="flex-1 bg-tertiary rounded-t-sm" style={{ height: `${h}%`, opacity: 0.2 + i * 0.2 }} />))}
                            </div>
                        </div>
                        <div className="bg-white p-card-padding rounded-xl ambient-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-on-surface-variant text-label-md">Monthly Revenue</span>
                                <div className="p-2 bg-secondary-container rounded-lg text-secondary"><span className="material-symbols-outlined">payments</span></div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-metric-lg font-extrabold">$1.2M</span>
                                <span className="text-tertiary text-label-sm bg-tertiary/10 px-2 py-0.5 rounded-full">+18%</span>
                            </div>
                            <div className="mt-4 h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-3/4 rounded-full" />
                            </div>
                        </div>
                        <div className="bg-white p-card-padding rounded-xl ambient-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-on-surface-variant text-label-md">Active Leads</span>
                                <div className="p-2 bg-surface-container rounded-lg text-on-surface-variant"><span className="material-symbols-outlined">bolt</span></div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-metric-lg font-extrabold">842</span>
                                <span className="text-error text-label-sm bg-error/10 px-2 py-0.5 rounded-full">-3%</span>
                            </div>
                            <div className="mt-4 flex items-end gap-1 h-8">
                                {[72, 65, 58, 52, 48].map((h, i) => (<div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%`, opacity: 0.3 + (4 - i) * 0.12 }} />))}
                            </div>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="flex flex-col xl:flex-row gap-gutter">
                        <div className="flex-1">
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-gutter">
                                    {filtered.map((agent) => (
                                        <div key={agent.id} className="bg-white rounded-xl ambient-shadow overflow-hidden flex flex-col group transition-all hover:-translate-y-1 duration-200">
                                            {/* Avatar Section */}
                                            <div className="relative pt-8 pb-4 px-card-padding flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent">
                                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-label-sm font-semibold shadow-lg ${agent.statusClass}`}>
                                                    {agent.status}
                                                </div>
                                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-surface shrink-0 shadow-md bg-surface-container-low">
                                                    <img className="w-full h-full object-cover object-center" src={agent.avatar} alt={agent.name} />
                                                </div>
                                                <div className="absolute bottom-4 right-4 flex gap-2">
                                                    <Link href="/messages" className="bg-white/90 backdrop-blur p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                                                        <span className="material-symbols-outlined">chat</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-card-padding space-y-3 pt-2 flex-1 flex flex-col">
                                                {/* Name */}
                                                <div className="text-center">
                                                    <h3 className="text-headline-md font-bold">{agent.name}</h3>
                                                    <p className="text-on-surface-variant text-body-sm">{agent.role} • {agent.region}</p>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-3 rounded-lg">
                                                    <div>
                                                        <p className="text-outline text-[10px] uppercase font-bold tracking-wider">Deals</p>
                                                        <p className="text-headline-md text-primary font-bold">{agent.deals}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-outline text-[10px] uppercase font-bold tracking-wider">Revenue</p>
                                                        <p className="text-headline-md text-primary font-bold">{agent.revenue}</p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar 1: Target Progress */}
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-label-sm">
                                                        <span className="text-on-surface-variant">Target Progress</span>
                                                        <span className={`font-bold ${getProgressBarColor(agent.progress, agent.target) === "bg-error" ? "text-error" : getProgressBarColor(agent.progress, agent.target) === "bg-emerald-500" ? "text-emerald-600" : "text-primary"}`}>{agent.progress}%</span>
                                                    </div>
                                                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(agent.progress, agent.target)}`} style={{ width: `${agent.progress}%` }} />
                                                    </div>
                                                </div>

                                                {/* Progress Bar 2: Deals / Value with duration */}
                                                <DualProgressBar agent={agent} />

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-1 mt-auto">
                                                    <Link href={`/team/${agent.id}`} className="flex flex-1 items-center justify-center bg-primary/5 text-primary rounded-lg text-label-sm text-center hover:bg-primary/10 transition-colors font-semibold">
                                                        View Profile
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditTargetAgent(agent)}
                                                        className="flex items-center gap-1 px-2.5 py-2 border border-outline-variant rounded-lg text-label-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                                                        title="Edit Target"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">track_changes</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setResetTargetAgent(agent)}
                                                        className="flex items-center gap-1 px-2.5 py-2 border border-outline-variant rounded-lg text-label-sm text-on-surface-variant hover:bg-error/5 hover:text-error hover:border-error/30 transition-colors"
                                                        title="Reset Target"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                                    </button>
                                                    <ActionDropdown
                                                        icon="more_horiz"
                                                        buttonClassName="p-1 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
                                                        items={[
                                                            { label: "Edit Profile", icon: "edit", onClick: () => setEditingAgent(agent) },
                                                            // { label: "Edit Target", icon: "track_changes", onClick: () => setEditTargetAgent(agent) },
                                                            // { label: "Reset Target", icon: "restart_alt", onClick: () => setResetTargetAgent(agent) },
                                                            // { label: "Message", icon: "chat" },
                                                            { label: "Remove", icon: "person_remove", danger: true, onClick: () => setTeamList((prev) => prev.filter((a) => a.id !== agent.id)) },
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl ambient-shadow overflow-hidden">
                                    <div className="table-responsive custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead className="bg-surface-container-low border-b border-outline-variant">
                                                <tr>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Agent</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Region</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Deals</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Revenue</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Progress</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4" />
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant">
                                                {filtered.map((agent) => (
                                                    <tr key={agent.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <Link href={`/team/${agent.id}`} className="flex items-center gap-3">
                                                                <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
                                                                <span className="font-semibold text-body-md group-hover:text-primary transition-colors">{agent.name}</span>
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 text-body-md text-on-surface-variant">{agent.role}</td>
                                                        <td className="px-6 py-4 text-body-md text-on-surface-variant">{agent.region}</td>
                                                        <td className="px-6 py-4 font-bold text-primary">{agent.deals}</td>
                                                        <td className="px-6 py-4 font-bold text-on-surface">{agent.revenue}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 w-32">
                                                                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                                                                    <div className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(agent.progress, agent.target)}`} style={{ width: `${agent.progress}%` }} />
                                                                </div>
                                                                <span className={`text-label-sm font-bold ${getProgressBarColor(agent.progress, agent.target) === "bg-error" ? "text-error" : getProgressBarColor(agent.progress, agent.target) === "bg-emerald-500" ? "text-emerald-600" : "text-primary"}`}>{agent.progress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-label-sm font-semibold ${agent.statusClass}`}>{agent.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <ActionDropdown
                                                                items={[
                                                                    { label: "Edit Profile", icon: "edit", onClick: () => setEditingAgent(agent) },
                                                                    { label: "Edit Target", icon: "track_changes", onClick: () => setEditTargetAgent(agent) },
                                                                    { label: "Reset Target", icon: "restart_alt", onClick: () => setResetTargetAgent(agent) },
                                                                    { label: "Message", icon: "chat" },
                                                                    { label: "Remove", icon: "person_remove", danger: true, onClick: () => setTeamList((prev) => prev.filter((a) => a.id !== agent.id)) },
                                                                ]}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
