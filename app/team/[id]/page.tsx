"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getAgentById, type AgentData } from "../../lib/mockData";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface PerformerHistory {
    year: number;
    target: string;
    timeTaken: string;
}

interface PerformanceProfile {
    history: PerformerHistory[];
    currentTarget: {
        type: "deals" | "value";
        value: number;
        achieved: number;
        durationMonths: number;
        startDate: string;
    };
    overallScore: number;
    badge: {
        label: string;
        colorClass: string;
        icon: string;
    };
}

// ─── Mock History Map ────────────────────────────────────────────────────────

const AGENT_PERFORMANCE_MAP: Record<string, PerformanceProfile> = {
    "1": {
        history: [
            { year: 2025, target: "30 Deals", timeTaken: "20 Days" },
            { year: 2024, target: "$5.0M Value", timeTaken: "28 Days" },
        ],
        currentTarget: { type: "deals", value: 30, achieved: 24, durationMonths: 12, startDate: "2026-01-01" },
        overallScore: 94,
        badge: { label: "Elite Performer", colorClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", icon: "workspace_premium" },
    },
    "2": {
        history: [
            { year: 2025, target: "20 Deals", timeTaken: "25 Days" },
        ],
        currentTarget: { type: "value", value: 5000000, achieved: 3100000, durationMonths: 6, startDate: "2026-06-01" },
        overallScore: 85,
        badge: { label: "High Achiever", colorClass: "bg-primary/10 text-primary border-primary/20", icon: "trending_up" },
    },
    "3": {
        history: [
            { year: 2024, target: "$8.0M Value", timeTaken: "24 Days" },
        ],
        currentTarget: { type: "value", value: 8000000, achieved: 5200000, durationMonths: 12, startDate: "2026-01-01" },
        overallScore: 88,
        badge: { label: "High Achiever", colorClass: "bg-primary/10 text-primary border-primary/20", icon: "trending_up" },
    },
    "4": {
        history: [
            { year: 2025, target: "25 Deals", timeTaken: "18 Days" },
        ],
        currentTarget: { type: "deals", value: 25, achieved: 21, durationMonths: 9, startDate: "2026-04-01" },
        overallScore: 91,
        badge: { label: "Elite Performer", colorClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", icon: "workspace_premium" },
    },
};

function getPerformanceProfile(id: string, agent: AgentData): PerformanceProfile {
    if (AGENT_PERFORMANCE_MAP[id]) {
        return AGENT_PERFORMANCE_MAP[id];
    }
    const score = agent.progress || 70;
    return {
        history: [
            { year: 2025, target: "10 Deals", timeTaken: "29 Days" }
        ],
        currentTarget: {
            type: "deals",
            value: 15,
            achieved: agent.deals || 6,
            durationMonths: 6,
            startDate: "2026-07-01",
        },
        overallScore: score,
        badge: {
            label: score >= 80 ? "High Achiever" : "Steady Performer",
            colorClass: score >= 80 ? "bg-primary/10 text-primary border-primary/20" : "bg-surface-container-high text-on-surface-variant border-outline-variant",
            icon: score >= 80 ? "trending_up" : "monitoring",
        },
    };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProgressBarColor(pct: number, durationMonths: number, startDate: string): string {
    if (pct >= 80) return "bg-emerald-500";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isOverdue = diffMs <= 0;
    const isOneMonthOrLess = diffDays <= 30;

    if (isOverdue || (durationMonths > 3 && isOneMonthOrLess && pct < 80) || (durationMonths < 3 && pct < 80)) {
        return "bg-error";
    }
    return "bg-primary";
}

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

function fmtDollars(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
}

const tabContent = {
    listings: [
        { title: "The Horizon Penthouse", location: "450 Skyline Blvd, Downtown", price: "$2,450,000", status: "Available", statusClass: "bg-primary-container text-on-primary-container", date: "Oct 15, 2023", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
        { title: "Suburban Family Home", location: "445 Pine St", price: "$950,000", status: "Under Offer", statusClass: "bg-orange-500/10 text-orange-600", date: "Sep 28, 2023", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    ],
    sales: [
        { title: "Luxury Beachfront Villa", location: "Miami Beach, FL", price: "$4,200,000", status: "Closed", statusClass: "bg-tertiary/10 text-tertiary", date: "Aug 12, 2023", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
        { title: "Downtown Modern Loft", location: "Chicago, IL", price: "$850,000", status: "Closed", statusClass: "bg-tertiary/10 text-tertiary", date: "Jul 03, 2023", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    ],
    reviews: [
        { client: "Eleanor Pemberton", rating: 5, text: "Marcus was incredibly professional and helped us find our dream home within weeks.", date: "Nov 2023" },
        { client: "Robert Haze", rating: 5, text: "Outstanding negotiation skills. Highly recommend for luxury properties.", date: "Oct 2023" },
    ],
};

function EditProfileModal({ agent, onClose, onSave }: { agent: AgentData; onClose: () => void; onSave: (a: AgentData) => void }) {
    const [form, setForm] = useState({ name: agent.name, role: agent.role, region: agent.region, email: agent.email || "", phone: agent.phone || "" });
    const [saved, setSaved] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave({ ...agent, ...form });
        setSaved(true);
        setTimeout(onClose, 800);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                    <h2 className="text-headline-md font-bold text-on-surface">Edit Profile</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {saved ? (
                    <div className="flex flex-col items-center py-12">
                        <span className="material-symbols-outlined text-[48px] text-tertiary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <p className="text-headline-md font-bold">Profile Updated!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {(["name", "role", "region", "email", "phone"] as const).map((key) => (
                            <div key={key}>
                                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5 capitalize">{key === "email" ? "Email" : key === "phone" ? "Phone" : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input
                                    required={key !== "phone"}
                                    type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                                    value={form[key]}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold">Save</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function AgentProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const initialAgent = getAgentById(id);
    const [agent, setAgent] = useState<AgentData | null>(initialAgent ?? null);
    const [activeTab, setActiveTab] = useState<"listings" | "sales" | "reviews">("listings");
    const [showEdit, setShowEdit] = useState(false);

    if (!agent) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-headline-lg mb-4">Agent Not Found</h1>
                <Link href="/team" className="text-primary font-semibold hover:underline">Back to Team</Link>
            </div>
        );
    }

    const profile = getPerformanceProfile(id, agent);
    const currentTarget = profile.currentTarget;
    const pct = Math.min(
        currentTarget.type === "deals"
            ? Math.round((currentTarget.achieved / currentTarget.value) * 100)
            : Math.round((currentTarget.achieved / currentTarget.value) * 100),
        100
    );

    const barColor = getProgressBarColor(pct, currentTarget.durationMonths, currentTarget.startDate);
    const barColorTop = getProgressBarColor(agent.progress, currentTarget.durationMonths, currentTarget.startDate);

    // Labels
    const achievedLabel = currentTarget.type === "deals"
        ? `${currentTarget.achieved} Deals Achieved`
        : `${fmtDollars(currentTarget.achieved)} Achieved`;
    const targetLabel = currentTarget.type === "deals"
        ? `${currentTarget.achieved} / ${currentTarget.value} Deals`
        : `${fmtDollars(currentTarget.achieved)} / ${fmtDollars(currentTarget.value)}`;
    const durationLabel = `${currentTarget.durationMonths} Month${currentTarget.durationMonths !== 1 ? "s" : ""} Duration`;
    const remainLabel = remainingLabel(currentTarget.startDate, currentTarget.durationMonths);

    const tabs = [
        { id: "listings" as const, label: "Active Listings" },
        { id: "sales" as const, label: "Recent Sales" },
        { id: "reviews" as const, label: "Client Reviews" },
    ];

    return (
        <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
            {showEdit && (
                <EditProfileModal agent={agent} onClose={() => setShowEdit(false)} onSave={setAgent} />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/team" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 overflow-hidden shrink-0">
                            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-headline-lg text-on-surface flex items-center gap-3">
                                {agent.name}
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block ${agent.statusClass}`}>
                                    {agent.status}
                                </span>
                            </h1>
                            <p className="text-body-md text-secondary mt-1">{agent.role} • {agent.region} • Joined {agent.joined}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/messages" className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                        Message
                    </Link>
                    <button
                        onClick={() => setShowEdit(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:opacity-90 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                        <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Badge & Overall Performance */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-headline-md text-on-surface">Agent Status</h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] text-label-xs font-bold border uppercase tracking-wider ${profile.badge.colorClass}`}>
                                {profile.overallScore >= 90 ? "Grade A+" : profile.overallScore >= 80 ? "Grade A" : "Grade B"}
                            </span>
                        </div>
                        <div className="flex shadow-lg shadow-dark/20 items-center justify-between p-4 bg-surface-container-low rounded-xl">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[32px] text-primary">{profile.badge.icon}</span>
                                <div>
                                    <p className="text-label-sm text-secondary">Performance Level</p>
                                    <p className="text-body-md font-bold text-on-surface">{profile.badge.label}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                            <div className="flex justify-between text-body-sm">
                                <span className="text-on-surface-variant font-medium">Overall Performance Score</span>
                                <span className="font-extrabold text-primary">{profile.overallScore}%</span>
                            </div>
                            <div className="h-3 bg-surface-container rounded-full overflow-hidden border border-outline-variant/20">
                                <div className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(profile.overallScore, currentTarget.durationMonths, currentTarget.startDate)}`} style={{ width: `${profile.overallScore}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Target Progress Card */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                        <h2 className="text-headline-md text-on-surface mb-4">Current Target Details</h2>
                        <div className="space-y-5">
                            {/* Progress 1 */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-body-sm text-secondary font-medium">Target Progress</span>
                                    <span className={`text-label-md font-bold ${barColorTop === "bg-error" ? "text-error" : barColorTop === "bg-emerald-500" ? "text-emerald-600" : "text-primary"}`}>{agent.progress}%</span>
                                </div>
                                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/20">
                                    <div className={`h-full rounded-full ${barColorTop}`} style={{ width: `${agent.progress}%` }} />
                                </div>
                            </div>

                            {/* Progress 2 */}
                            <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[11px] text-on-surface-variant font-semibold">{achievedLabel}</span>
                                    <span className="text-[11px] font-bold text-on-surface">{targetLabel}</span>
                                </div>
                                <div className="h-2.5 bg-surface-container rounded-full overflow-hidden border border-outline-variant/20 relative">
                                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex justify-between items-baseline pt-0.5">
                                    <span className="text-[11px] text-on-surface-variant font-medium">{durationLabel}</span>
                                    <span className={`text-[11px] font-bold ${remainLabel === "Overdue" ? "text-error" : remainLabel.includes("Days") || remainLabel.startsWith("1 Month") ? "text-amber-600" : "text-on-surface-variant"}`}>
                                        {remainLabel}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="bg-surface-container-low rounded-lg p-3 text-center">
                                    <p className="text-metric-md text-on-surface">{agent.deals}</p>
                                    <p className="text-label-sm text-secondary">Deals Won</p>
                                </div>
                                <div className="bg-surface-container-low rounded-lg p-3 text-center">
                                    <p className="text-metric-md text-on-surface">{agent.revenue}</p>
                                    <p className="text-label-sm text-secondary">Revenue</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Performer History Card */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                        <h2 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                            Top Performer History
                        </h2>
                        {profile.history.length === 0 ? (
                            <p className="text-body-sm text-on-surface-variant">No top performer titles earned yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {profile.history.map((hist, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-amber-500/[0.04] border border-amber-500/20 rounded-xl">
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <span className="text-label-sm font-bold">{hist.year}</span>
                                        </div>
                                        <div>
                                            <p className="text-label-sm font-bold text-on-surface">{hist.target} Achieved</p>
                                            <p className="text-[11px] text-on-surface-variant">Completed in {hist.timeTaken}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                        <h2 className="text-headline-md text-on-surface mb-4">Contact Info</h2>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-center border-b border-outline-variant pb-3">
                                <span className="material-symbols-outlined text-secondary">mail</span>
                                <div className="min-w-0">
                                    <p className="text-label-sm text-secondary">Email</p>
                                    <p className="text-body-md text-on-surface truncate">{agent.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center border-b border-outline-variant pb-3">
                                <span className="material-symbols-outlined text-secondary">call</span>
                                <div>
                                    <p className="text-label-sm text-secondary">Phone</p>
                                    <p className="text-body-md text-on-surface">{agent.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className="material-symbols-outlined text-secondary">location_on</span>
                                <div>
                                    <p className="text-label-sm text-secondary">Office Location</p>
                                    <p className="text-body-md text-on-surface">{agent.office}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Main Content Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-lg mb-3">account_balance_wallet</span>
                            <p className="text-label-sm text-secondary">Total Sales Volume</p>
                            <h2 className="text-metric-md text-on-surface mt-1">{agent.revenue}</h2>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg mb-3">home_work</span>
                            <p className="text-label-sm text-secondary">Active Listings</p>
                            <h2 className="text-metric-md text-on-surface mt-1">{tabContent.listings.length}</h2>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                            <span className="material-symbols-outlined text-orange-600 bg-orange-500/10 p-2 rounded-lg mb-3">group</span>
                            <p className="text-label-sm text-secondary">Active Clients</p>
                            <h2 className="text-metric-md text-on-surface mt-1">24</h2>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden ambient-shadow">
                        <div className="flex border-b border-outline-variant overflow-x-auto custom-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-label-md whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                                        ? "text-primary border-primary font-semibold"
                                        : "text-secondary border-transparent hover:text-on-surface"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="p-6">
                            {activeTab === "reviews" ? (
                                <div className="space-y-4">
                                    {tabContent.reviews.map((review) => (
                                        <div key={review.client} className="p-4 border border-outline-variant rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-bold text-on-surface">{review.client}</p>
                                                <div className="flex text-primary">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-body-md text-secondary">{review.text}</p>
                                            <p className="text-body-sm text-outline mt-2">{review.date}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(activeTab === "listings" ? tabContent.listings : tabContent.sales).map((item) => (
                                        <div key={item.title} className="flex flex-col sm:flex-row gap-4 p-4 border border-outline-variant rounded-xl hover:bg-surface-bright transition-colors">
                                            <div className="w-full sm:w-32 h-32 sm:h-24 rounded-lg bg-surface-container-high shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-label-md text-on-surface">{item.title}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${item.statusClass}`}>{item.status}</span>
                                                    </div>
                                                    <p className="text-body-sm text-secondary mt-1">{item.location}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-label-md text-on-surface">{item.price}</span>
                                                    <span className="text-body-sm text-secondary">Listed: {item.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
