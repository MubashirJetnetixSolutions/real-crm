"use client";

import Header from "./components/Header";
import KpiCard from "./components/KpiCard";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { api } from "./lib/apiClient";
import { initialsOf, timeAgo } from "./lib/format";
import type { LeadDTO } from "@/types/leads";
import type { TopPerformerDTO, YearlyTeamPerformanceDTO } from "@/types/team";

function formatCreatedDate(dateStr?: string | null): string {
    if (!dateStr) return "—";
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
        return dateStr;
    }
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<"leads" | "performers">("leads");

    // Latest leads state
    const [leads, setLeads] = useState<LeadDTO[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [leadsError, setLeadsError] = useState<string | null>(null);

    // Top performers state
    const [topPerformers, setTopPerformers] = useState<TopPerformerDTO[]>([]);
    const [loadingPerformers, setLoadingPerformers] = useState(true);
    const [performersError, setPerformersError] = useState<string | null>(null);
    const [perfSearch, setPerfSearch] = useState("");
    const [perfYear, setPerfYear] = useState<string>(new Date().getFullYear().toString());
    const [yearDropOpen, setYearDropOpen] = useState(false);
    const availableYears = ["2026", "2025", "2024", "2023", "2022"];

    useEffect(() => {
        let cancelled = false;

        // Fetch latest leads
        api
            .get<LeadDTO[]>("/api/leads?sort=createdAt&dir=desc&pageSize=6")
            .then(({ data }) => {
                if (!cancelled) {
                    setLeads(data || []);
                    setLoadingLeads(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setLeadsError(err instanceof Error ? err.message : "Failed to load leads");
                    setLoadingLeads(false);
                }
            });

        // Fetch top performers directly from backend API
        api
            .get<TopPerformerDTO[]>("/api/team/top-performers")
            .then(({ data }) => {
                if (!cancelled) {
                    setTopPerformers(data || []);
                    setLoadingPerformers(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setPerformersError(err instanceof Error ? err.message : "Failed to load top performers");
                    setLoadingPerformers(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            <Header title="Dashboard" subtitle="Real Estate CRM Overview" />

            <main className="p-container-margin space-y-section-gap flex-1 overflow-y-auto">
                {/* KPI Row */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    <KpiCard
                        title="Total Active Deals"
                        value="148"
                        icon="account_tree"
                        trend="+12%"
                        trendDirection="up"
                        iconBgColor="bg-primary/10"
                        iconTextColor="text-primary"
                    />
                    <KpiCard
                        title="Pipeline Value"
                        value="$12.4M"
                        icon="payments"
                        trend="+8.4%"
                        trendDirection="up"
                        iconBgColor="bg-tertiary/10"
                        iconTextColor="text-tertiary"
                    />
                    <KpiCard
                        title="Closed (Monthly)"
                        value="42"
                        icon="check_circle"
                        trend="-2%"
                        trendDirection="down"
                        iconBgColor="bg-secondary/10"
                        iconTextColor="text-secondary"
                    />
                    <KpiCard
                        title="Total Revenue"
                        value="$9.4M"
                        icon="percent"
                        trend="+1.2%"
                        trendDirection="up"
                        iconBgColor="bg-primary-fixed/30"
                        iconTextColor="text-primary"
                    />
                </section>

                {/* Quick Links Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <Link href="/leads" className="flex relative justify-between bg-[#0c1222] text-[#ffffff] overflow-hidden border border-outline-variant/30 ambient-shadow gap-2 items-center p-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group">
                        <span className="text-label-md">All Leads</span>
                        <span className="absolute top-0 !flex justify-center items-center h-full right-0 rounded-sm w-[50px] material-symbols-outlined p-2 bg-[#0E46BB] text-[28px] text-[#aaaaaa] group-hover:text-on-primary-container">person_search</span>
                    </Link>
                    <Link href="/leads" className="flex relative justify-between bg-[#0c1222] text-[#ffffff] overflow-hidden border border-outline-variant/30 ambient-shadow gap-2 items-center p-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group">
                        <span className="text-label-md">Deals Pipeline</span>
                        <span className="absolute top-0 !flex justify-center items-center h-full right-0 rounded-sm w-[50px] material-symbols-outlined p-2 bg-[#0E46BB] text-[28px] text-[#aaaaaa] group-hover:text-on-primary-container">account_tree</span>
                    </Link>
                    <Link href="/properties" className="flex relative justify-between bg-[#0c1222] text-[#ffffff] overflow-hidden border border-outline-variant/30 ambient-shadow gap-2 items-center p-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group">
                        <span className="text-label-md">Properties Grid</span>
                        <span className="absolute top-0 !flex justify-center items-center h-full right-0 rounded-sm w-[50px] material-symbols-outlined p-2 bg-[#0E46BB] text-[28px] text-[#aaaaaa] group-hover:text-on-primary-container">domain</span>
                    </Link>
                    <Link href="/team" className="flex relative justify-between bg-[#0c1222] text-[#ffffff] overflow-hidden border border-outline-variant/30 ambient-shadow gap-2 items-center p-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group">
                        <span className="text-label-md">Team Agents</span>
                        <span className="absolute top-0 !flex justify-center items-center h-full right-0 rounded-sm w-[50px] material-symbols-outlined p-2 bg-[#0E46BB] text-[28px] text-[#aaaaaa] group-hover:text-on-primary-container">groups</span>
                    </Link>
                    <Link href="/clients" className="flex relative justify-between bg-[#0c1222] text-[#ffffff] overflow-hidden border border-outline-variant/30 ambient-shadow gap-2 items-center p-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group col-span-2 sm:col-span-1">
                        <span className="text-label-md">All Clients</span>
                        <span className="absolute top-0 !flex justify-center items-center h-full right-0 rounded-sm w-[50px] material-symbols-outlined p-2 bg-[#0E46BB] text-[28px] text-[#aaaaaa] group-hover:text-on-primary-container">group</span>
                    </Link>
                </div>

                {/* Charts Section: Revenue Analytics & Deal Distribution */}
                <section className="grid grid-cols-12 gap-gutter">
                    {/* 1. Revenue Analytics Chart (8 cols on lg) */}
                    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-outline-variant/30 ambient-shadow space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h3 className="text-headline-md font-bold text-on-surface">Revenue Analytics</h3>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700">
                                        <span className="material-symbols-outlined text-[13px]">trending_up</span>
                                        +18.4% YoY
                                    </span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">
                                    Monthly revenue performance and target benchmarks for 2026
                                </p>
                            </div>

                            {/* Summary Metrics & Range Tabs */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-outline-variant/30">
                                    <div className="text-right">
                                        <p className="text-[11px] text-on-surface-variant font-medium">YTD Revenue</p>
                                        <p className="text-title-sm font-extrabold text-primary">$9.4M</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-on-surface-variant font-medium">Avg / Month</p>
                                        <p className="text-title-sm font-extrabold text-on-surface">$783K</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/30 text-[12px] font-semibold">
                                    <button type="button" className="px-2.5 py-1 rounded bg-white text-on-surface shadow-sm">
                                        1Y
                                    </button>
                                    <button type="button" className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface transition-colors">
                                        6M
                                    </button>
                                    <button type="button" className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface transition-colors">
                                        All
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Bar Chart with Grid Lines & Interactive Bars */}
                        <div className="space-y-2">
                            <div className="h-56 relative flex items-end justify-between gap-2 pt-6 px-1">
                                {/* Horizontal Guidelines */}
                                <div className="absolute inset-x-0 top-0 border-b border-dashed border-outline-variant/20 flex justify-end">
                                    <span className="text-[10px] text-outline -translate-y-2.5">$1.2M</span>
                                </div>
                                <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-outline-variant/20 flex justify-end">
                                    <span className="text-[10px] text-outline -translate-y-2.5">$800K</span>
                                </div>
                                <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-outline-variant/20 flex justify-end">
                                    <span className="text-[10px] text-outline -translate-y-2.5">$400K</span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 border-b border-outline-variant/30 flex justify-end">
                                    <span className="text-[10px] text-outline -translate-y-2.5">$0</span>
                                </div>

                                {/* Bars for 12 months */}
                                {[
                                    { month: "Jan", revenue: 580, target: 500, deals: 3 },
                                    { month: "Feb", revenue: 720, target: 600, deals: 4 },
                                    { month: "Mar", revenue: 890, target: 700, deals: 5 },
                                    { month: "Apr", revenue: 640, target: 650, deals: 3 },
                                    { month: "May", revenue: 950, target: 750, deals: 6 },
                                    { month: "Jun", revenue: 1120, target: 800, deals: 7 },
                                    { month: "Jul", revenue: 830, target: 750, deals: 4 },
                                    { month: "Aug", revenue: 980, target: 800, deals: 5 },
                                    { month: "Sep", revenue: 760, target: 700, deals: 4 },
                                    { month: "Oct", revenue: 1040, target: 850, deals: 6 },
                                    { month: "Nov", revenue: 910, target: 800, deals: 5 },
                                    { month: "Dec", revenue: 1180, target: 900, deals: 7 },
                                ].map((item, i) => {
                                    const heightPct = Math.round((item.revenue / 1200) * 100);
                                    const targetPct = Math.round((item.target / 1200) * 100);
                                    const isHighest = item.revenue === 1180;

                                    return (
                                        <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 z-10 h-full justify-end group">
                                            {/* Bar Container */}
                                            <div className="w-full flex items-end justify-center gap-1 h-full relative cursor-pointer">
                                                {/* Target indicator line / bar */}
                                                <div
                                                    className="w-1.5 rounded-t bg-slate-200 group-hover:bg-slate-300 transition-colors"
                                                    style={{ height: `${targetPct}%` }}
                                                    title={`Target: $${item.target}K`}
                                                />

                                                {/* Actual revenue bar */}
                                                <div
                                                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 relative ${
                                                        isHighest
                                                            ? "bg-gradient-to-t from-[#0c1222] via-[#0E46BB] to-[#3b82f6] shadow-sm shadow-primary/30"
                                                            : "bg-gradient-to-t from-primary/70 to-primary group-hover:from-primary group-hover:to-primary-container"
                                                    }`}
                                                    style={{ height: `${heightPct}%` }}
                                                >
                                                    {/* Tooltip on Hover */}
                                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#0c1222] text-white text-[11px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-lg z-30 whitespace-nowrap min-w-[100px] text-center border border-white/10">
                                                        <p className="font-bold text-amber-400">${item.revenue}K Revenue</p>
                                                        <p className="text-[10px] text-slate-300 mt-0.5">
                                                            {item.deals} Deals • Target: ${item.target}K
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Month Label */}
                                            <span className={`text-[11px] font-semibold transition-colors ${
                                                isHighest ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-on-surface"
                                            }`}>
                                                {item.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chart Legend */}
                            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-outline-variant/20 text-[12px] text-on-surface-variant">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-sm bg-primary" />
                                        <span>Actual Revenue</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                                        <span>Target Benchmark</span>
                                    </div>
                                </div>
                                <span className="text-[11px] text-outline">Hover over bars to inspect monthly details</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Deal Distribution by Property Category (4 cols on lg) */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl border border-outline-variant/30 ambient-shadow flex flex-col justify-between space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-headline-md font-bold text-on-surface">Deals by Property</h3>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">Category distribution</p>
                            </div>
                            <span className="p-2 rounded-lg bg-surface-container-low text-primary material-symbols-outlined text-[20px]">
                                pie_chart
                            </span>
                        </div>

                        {/* Visual Circular/Donut Summary */}
                        <div className="flex items-center justify-center gap-6 py-2">
                            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    {/* Segment 1: Luxury Villas (38%) */}
                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#0E46BB" strokeWidth="3.5" strokeDasharray="38, 100" strokeDashoffset="0" />
                                    {/* Segment 2: Commercial (28%) */}
                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#0284c7" strokeWidth="3.5" strokeDasharray="28, 100" strokeDashoffset="-38" />
                                    {/* Segment 3: Penthouses (22%) */}
                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="22, 100" strokeDashoffset="-66" />
                                    {/* Segment 4: Apartments (12%) */}
                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="12, 100" strokeDashoffset="-88" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-title-md font-extrabold text-on-surface">46</span>
                                    <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Deals</span>
                                </div>
                            </div>

                            <div className="space-y-1 text-body-sm">
                                <p className="text-[11px] text-on-surface-variant font-medium">Total Closed Volume</p>
                                <p className="text-headline-md font-extrabold text-on-surface">$9.4M</p>
                                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">verified</span>
                                    High Conversion
                                </p>
                            </div>
                        </div>

                        {/* Breakdown List with Progress Indicators */}
                        <div className="space-y-3 pt-2 border-t border-outline-variant/30">
                            {[
                                { name: "Luxury Villas", value: "$3.6M", pct: 38, count: 18, color: "bg-[#0E46BB]" },
                                { name: "Commercial Hubs", value: "$2.6M", pct: 28, count: 14, color: "bg-sky-600" },
                                { name: "Sky Penthouses", value: "$2.1M", pct: 22, count: 8, color: "bg-emerald-500" },
                                { name: "Modern Apartments", value: "$1.1M", pct: 12, count: 6, color: "bg-amber-500" },
                            ].map((cat) => (
                                <div key={cat.name} className="space-y-1">
                                    <div className="flex justify-between items-center text-body-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                                            <span className="font-semibold text-on-surface text-[12px]">{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12px]">
                                            <span className="text-on-surface-variant font-medium">{cat.count} deals</span>
                                            <span className="font-bold text-on-surface">{cat.value}</span>
                                            <span className="text-outline font-medium">({cat.pct}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dashboard Content Grid */}
                <section className="grid grid-cols-12 gap-gutter">
                    {/* Latest Leads & Top Performers Card - 8 columns on lg */}
                    <div className="col-span-12 lg:col-span-8 space-y-gutter">
                        <div className="bg-white rounded-xl border border-outline-variant/30 ambient-shadow overflow-hidden">
                            {/* Header with 2 Tabs and Link */}
                            <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* 2 Tabs: Latest Leads and Top Performers */}
                                <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("leads")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md font-semibold transition-all ${activeTab === "leads"
                                            ? "bg-white text-on-surface shadow-sm border border-outline-variant/30"
                                            : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${activeTab === "leads" ? "text-primary" : "text-outline"}`}>
                                            person_search
                                        </span>
                                        <span>Latest Leads</span>
                                        {leads.length > 0 && (
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "leads" ? "bg-primary/10 text-primary" : "bg-surface-container-high text-outline"
                                                }`}>
                                                {leads.length}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("performers")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md font-semibold transition-all ${activeTab === "performers"
                                            ? "bg-white text-on-surface shadow-sm border border-outline-variant/30"
                                            : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${activeTab === "performers" ? "text-amber-500" : "text-outline"}`}>
                                            workspace_premium
                                        </span>
                                        <span>Top Performers</span>
                                        {topPerformers.length > 0 && (
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "performers" ? "bg-amber-500/10 text-amber-600" : "bg-surface-container-high text-outline"
                                                }`}>
                                                {topPerformers.length}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Right Link */}
                                <Link
                                    href={activeTab === "leads" ? "/leads" : "/team"}
                                    className="inline-flex items-center gap-1.5 text-primary text-label-sm font-semibold"
                                >
                                    <span>{activeTab === "leads" ? "View All Leads" : "View All Team"}</span>
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </Link>
                            </div>

                            {/* TAB 1: Latest Leads */}
                            {activeTab === "leads" && (
                                <div className="table-responsive custom-scrollbar">
                                    {loadingLeads ? (
                                        <div className="p-8 space-y-4">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                                                    <div className="flex items-center gap-3 w-1/4">
                                                        <div className="w-9 h-9 rounded-full bg-surface-container" />
                                                        <div className="space-y-1.5 flex-1">
                                                            <div className="h-3.5 bg-surface-container rounded w-3/4" />
                                                            <div className="h-2.5 bg-surface-container rounded w-1/2" />
                                                        </div>
                                                    </div>
                                                    <div className="h-3.5 bg-surface-container rounded w-1/5" />
                                                    <div className="h-3.5 bg-surface-container rounded w-1/6" />
                                                    <div className="h-6 bg-surface-container rounded-full w-16" />
                                                    <div className="h-3.5 bg-surface-container rounded w-1/6" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : leadsError ? (
                                        <div className="p-8 text-center">
                                            <p className="text-body-md text-error">{leadsError}</p>
                                        </div>
                                    ) : leads.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <span className="material-symbols-outlined text-outline text-[40px] mb-2 block">person_off</span>
                                            <p className="text-body-lg font-semibold text-on-surface">No leads found</p>
                                            <p className="text-body-sm text-on-surface-variant mt-1">Get started by creating your first lead.</p>
                                            <Link href="/leads/add" className="inline-block mt-4 px-4 py-2 bg-primary text-white text-label-md rounded-lg font-semibold hover:bg-primary/90">
                                                Add New Lead
                                            </Link>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-surface-container-low border-b border-outline-variant">
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Lead Name</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Contact / Phone</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Email</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Source</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Status</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Assigned Agent</th>
                                                    <th className="px-6 py-4 text-label-sm text-outline uppercase font-semibold">Created Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant">
                                                {leads.map((lead) => (
                                                    <tr key={lead.id} className="hover:bg-surface-container-low/20 transition-colors h-16">
                                                        {/* Lead Name */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link href={`/leads/${lead.id}`} className="flex items-center gap-3 group">
                                                                {lead.avatarUrl ? (
                                                                    <img
                                                                        src={lead.avatarUrl}
                                                                        alt={lead.name}
                                                                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-outline-variant/30"
                                                                    />
                                                                ) : (
                                                                    <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                                        {initialsOf(lead.name)}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                                                                        {lead.name}
                                                                    </p>
                                                                    <p className="text-[11px] text-on-surface-variant">{timeAgo(lead.createdAt)}</p>
                                                                </div>
                                                            </Link>
                                                        </td>

                                                        {/* Contact / Phone */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-body-md text-on-surface">
                                                            {lead.phone ? (
                                                                <div className="flex items-center gap-1.5 text-on-surface-variant">
                                                                    <span className="material-symbols-outlined text-[15px] text-outline">call</span>
                                                                    <span>{lead.phone}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-outline text-body-sm">—</span>
                                                            )}
                                                        </td>

                                                        {/* Email */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-body-md text-on-surface">
                                                            {lead.email ? (
                                                                <div className="flex items-center gap-1.5 text-on-surface-variant">
                                                                    <span className="material-symbols-outlined text-[15px] text-outline">mail</span>
                                                                    <span className="truncate max-w-[140px]" title={lead.email}>{lead.email}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-outline text-body-sm">—</span>
                                                            )}
                                                        </td>

                                                        {/* Lead Source */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface-container-high text-on-surface-variant">
                                                                <span className="material-symbols-outlined text-[13px] text-outline">
                                                                    {lead.source?.toLowerCase().includes("web")
                                                                        ? "language"
                                                                        : lead.source?.toLowerCase().includes("ref")
                                                                            ? "hub"
                                                                            : lead.source?.toLowerCase().includes("call")
                                                                                ? "call"
                                                                                : "share"}
                                                                </span>
                                                                <span>{lead.source || "Direct"}</span>
                                                            </span>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-3 py-1 text-label-sm rounded-full font-semibold ${lead.status === "Hot"
                                                                    ? "bg-error-container/20 text-error"
                                                                    : lead.status === "Warm"
                                                                        ? "bg-primary-container/20 text-primary"
                                                                        : "bg-surface-container-highest text-outline"
                                                                    }`}
                                                            >
                                                                {lead.status}
                                                            </span>
                                                        </td>

                                                        {/* Assigned Agent */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {lead.agentName ? (
                                                                <div className="flex items-center gap-2">
                                                                    {lead.agentAvatar ? (
                                                                        <img
                                                                            src={lead.agentAvatar}
                                                                            alt={lead.agentName}
                                                                            className="w-6 h-6 rounded-full object-cover shrink-0"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                                                                            {initialsOf(lead.agentName)}
                                                                        </div>
                                                                    )}
                                                                    <span className="text-body-sm font-medium text-on-surface">{lead.agentName}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-outline text-body-sm italic">Unassigned</span>
                                                            )}
                                                        </td>

                                                        {/* Created Date */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-body-sm text-on-surface-variant">
                                                            {formatCreatedDate(lead.createdAt)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: Top Performers — Table view with search & year filter */}
                            {activeTab === "performers" && (
                                <div className="flex flex-col">
                                    {/* Controls: Search + Year Dropdown */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-outline-variant/20">
                                        {/* Search */}
                                        <div className="relative flex-1">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                                            <input
                                                type="text"
                                                value={perfSearch}
                                                onChange={(e) => setPerfSearch(e.target.value)}
                                                placeholder="Search agent name…"
                                                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                                            />
                                        </div>

                                        {/* Custom Year Dropdown */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setYearDropOpen((v) => !v)}
                                                className={`flex items-center gap-2.5 pl-4 pr-3 py-2 rounded-lg border text-label-sm font-semibold transition-all min-w-[130px] justify-between ${
                                                    yearDropOpen
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-outline-variant/40 bg-surface-container-low text-on-surface hover:border-primary/50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                                                    <span>Year {perfYear}</span>
                                                </div>
                                                <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                                                    yearDropOpen ? "rotate-180 text-primary" : "text-on-surface-variant"
                                                }`}>expand_more</span>
                                            </button>

                                            {yearDropOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setYearDropOpen(false)} />
                                                    <div className="absolute right-0 mt-2 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-20 overflow-hidden">
                                                        <div className="px-3 py-2 border-b border-outline-variant/20">
                                                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Select Year</p>
                                                        </div>
                                                        {availableYears.map((yr) => (
                                                            <button
                                                                key={yr}
                                                                type="button"
                                                                onClick={() => { setPerfYear(yr); setYearDropOpen(false); }}
                                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-label-sm transition-colors ${
                                                                    yr === perfYear
                                                                        ? "bg-primary/10 text-primary font-bold"
                                                                        : "text-on-surface hover:bg-surface-container-low font-medium"
                                                                }`}
                                                            >
                                                                <span>{yr}</span>
                                                                {yr === perfYear && (
                                                                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Table Content */}
                                    {loadingPerformers ? (
                                        <div className="p-6 space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-16 bg-surface-container-low animate-pulse rounded-xl" />
                                            ))}
                                        </div>
                                    ) : performersError ? (
                                        <div className="p-10 text-center">
                                            <p className="text-body-md text-error">{performersError}</p>
                                        </div>
                                    ) : (() => {
                                        // Filter by search + year (year filter is visual for now as API returns current data)
                                        const filtered = topPerformers.filter((a) =>
                                            !perfSearch || a.name.toLowerCase().includes(perfSearch.toLowerCase())
                                        );

                                        if (topPerformers.length === 0) return (
                                            <div className="p-12 text-center">
                                                <span className="material-symbols-outlined text-outline text-[40px] mb-3 block">groups</span>
                                                <p className="text-body-lg font-semibold text-on-surface">No performance data found</p>
                                                <p className="text-body-sm text-on-surface-variant mt-1 mb-4">Assign targets to agents to view completion rankings.</p>
                                                <Link href="/team" className="inline-block px-5 py-2.5 bg-primary text-white text-label-md rounded-lg font-semibold hover:bg-primary/90 transition-all">
                                                    Manage Team
                                                </Link>
                                            </div>
                                        );

                                        if (filtered.length === 0) return (
                                            <div className="p-10 text-center">
                                                <span className="material-symbols-outlined text-outline text-[36px] mb-2 block">search_off</span>
                                                <p className="text-body-md text-on-surface-variant">No agents match your search.</p>
                                            </div>
                                        );

                                        return (
                                            <div className="overflow-x-auto custom-scrollbar">
                                                <table className="w-full text-left min-w-[680px]">
                                                    <thead className="bg-surface-container-low border-b border-outline-variant/20">
                                                        <tr>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider w-10">#</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Agent</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Progress</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Deals</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Time Taken</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-outline-variant/15">
                                                        {filtered.map((agent) => {
                                                            const isRank1 = agent.rank === 1;
                                                            const isRank2 = agent.rank === 2;
                                                            const isRank3 = agent.rank === 3;
                                                            const pct = Math.min(agent.progressPercentage, 100);

                                                            return (
                                                                <tr
                                                                    key={agent.id}
                                                                    className={`transition-colors ${
                                                                        isRank1
                                                                            ? "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                                                                            : "hover:bg-surface-container-low/60"
                                                                    }`}
                                                                >
                                                                    {/* Rank */}
                                                                    <td className="px-4 py-3.5">
                                                                        {isRank1 ? (
                                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-sm">
                                                                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                                                            </div>
                                                                        ) : isRank2 ? (
                                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-300 to-slate-500 text-white font-extrabold text-[12px] flex items-center justify-center">#2</div>
                                                                        ) : isRank3 ? (
                                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 font-extrabold text-[12px] flex items-center justify-center">#3</div>
                                                                        ) : (
                                                                            <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant font-bold text-[12px] flex items-center justify-center">#{agent.rank}</div>
                                                                        )}
                                                                    </td>

                                                                    {/* Agent */}
                                                                    <td className="px-4 py-3.5">
                                                                        <div className="flex items-center gap-2.5">
                                                                            <div className="relative shrink-0">
                                                                                {agent.avatarUrl ? (
                                                                                    <img src={agent.avatarUrl} alt={agent.name} className="w-9 h-9 rounded-full object-cover border-2 border-outline-variant/30" />
                                                                                ) : (
                                                                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-[12px] flex items-center justify-center">{initialsOf(agent.name)}</div>
                                                                                )}
                                                                                {isRank1 && (
                                                                                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">★</span>
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <Link href={`/team/${agent.id}`} className="text-label-sm font-bold text-on-surface hover:text-primary transition-colors">{agent.name}</Link>
                                                                                <p className="text-[11px] text-on-surface-variant">{agent.jobTitle || "Property Advisor"}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    {/* Progress */}
                                                                    <td className="px-4 py-3.5 min-w-[160px]">
                                                                        <div className="flex items-center justify-between mb-1.5">
                                                                            <span className="text-[11px] text-on-surface-variant">{agent.achievedAmountFormatted} / {agent.targetAmountFormatted}</span>
                                                                            <span className={`text-[11px] font-bold ${
                                                                                agent.progressPercentage >= 100 ? "text-emerald-600" :
                                                                                agent.progressPercentage >= 75 ? "text-primary" : "text-on-surface-variant"
                                                                            }`}>{agent.progressPercentage}%</span>
                                                                        </div>
                                                                        <div className="h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant/20">
                                                                            <div
                                                                                className={`h-full rounded-full transition-all duration-700 ${
                                                                                    agent.progressPercentage >= 100
                                                                                        ? "bg-gradient-to-r from-amber-400 via-primary to-emerald-500"
                                                                                        : agent.progressPercentage >= 75
                                                                                            ? "bg-primary"
                                                                                            : "bg-outline/60"
                                                                                }`}
                                                                                style={{ width: `${pct}%` }}
                                                                            />
                                                                        </div>
                                                                    </td>

                                                                    {/* Deals */}
                                                                    <td className="px-4 py-3.5 text-center">
                                                                        <p className="text-label-sm font-bold text-on-surface">{agent.dealsClosed}</p>
                                                                        <p className="text-[10px] text-on-surface-variant">{agent.totalDealValue}</p>
                                                                    </td>

                                                                    {/* Time Taken */}
                                                                    <td className="px-4 py-3.5 text-center">
                                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                                            agent.isCompleted
                                                                                ? isRank1
                                                                                    ? "bg-amber-500/15 text-amber-700 border border-amber-400/30"
                                                                                    : "bg-emerald-500/10 text-emerald-700"
                                                                                : "bg-surface-container text-on-surface-variant"
                                                                        }`}>
                                                                            <span className="material-symbols-outlined text-[13px]">timer</span>
                                                                            {agent.completionDays}d
                                                                            {isRank1 && agent.isCompleted && <span className="ml-0.5">🏆</span>}
                                                                        </span>
                                                                    </td>

                                                                    {/* Status */}
                                                                    <td className="px-4 py-3.5 text-right">
                                                                        {agent.isCompleted ? (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-400/20">
                                                                                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                                                Done
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/8 text-primary border border-primary/20">
                                                                                <span className="material-symbols-outlined text-[13px]">pending</span>
                                                                                Active
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Widgets - 4 columns on lg */}
                    <div className="col-span-12 lg:col-span-4 space-y-gutter">
                        {/* Monthly Goal gauge */}
                        <div className="bg-white rounded-xl border border-outline-variant/30 p-card-padding text-center ambient-shadow">
                            <h4 className="text-label-md font-bold text-on-surface-variant mb-6 uppercase tracking-wider">
                                Monthly Target
                            </h4>
                            <div className="relative flex flex-col items-center">
                                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-surface-container-high"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        />
                                        <path
                                            className="text-primary-container"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray="75, 100"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[36px] font-extrabold text-on-surface">75%</span>
                                        <span className="text-[12px] font-bold text-tertiary flex items-center gap-0.5 mt-0.5">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span> +3%
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-body-sm text-on-surface font-medium leading-tight">Remaining to target</p>
                                    <p className="text-headline-md font-extrabold text-primary mt-1">$2.4M</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-xl border border-outline-variant/30 p-card-padding ambient-shadow">
                            <h4 className="text-label-md font-bold mb-4">Recent Activities</h4>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-body-md text-on-surface">New inquiry from <b>Lisa Ray</b></p>
                                        <p className="text-body-sm text-on-surface-variant">15 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-tertiary mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-body-md text-on-surface">Deal closed for <b>32 Oak Ave</b></p>
                                        <p className="text-body-sm text-on-surface-variant">1 hour ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-body-md text-on-surface">Lead <b>John Doe</b> marked as Lost</p>
                                        <p className="text-body-sm text-on-surface-variant">3 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
