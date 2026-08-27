"use client";

import { useState } from "react";
import Header from "../components/Header";
import AppSelect from "../components/forms/AppSelect";

const stats = [
  { label: "Total Revenue (MTD)", value: "$2.4M", change: "+18%", up: true, icon: "payments", color: "text-primary", bg: "bg-primary/10" },
  { label: "Deals Closed", value: "42", change: "+6", up: true, icon: "handshake", color: "text-tertiary", bg: "bg-tertiary/10" },
  { label: "Avg. Deal Value", value: "$195K", change: "+4.2%", up: true, icon: "trending_up", color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Conversion Rate", value: "24.5%", change: "-1.1%", up: false, icon: "percent", color: "text-error", bg: "bg-error/10" },
];

const topAgents = [
  { name: "Sarah Chen", deals: 21, revenue: "$7.4M", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfyXqMv17C8qKjS4J8fpR-p0CZRMyhEzWviTvh9Cbx6meNDQun_MtBdoHouJ8mmDRU-CC2WsPxH2KPXQ9hSoH2D-6Zp47I9xD6xvNJ0Kj35LFY4i2RNTb1orEToZ-92wbbNTf8b8GcayqKE2oh61syElA37CtBDUcjmzt5qoom5FwRgyNtNKUR8PoIhnZwGiVK2aUUIsj2ffpbYnUN4znM5UrZ7sOtVkF9YTGhJ5fTAgmpMQrnw7Y5Saej0b2iW4xMNZOfK_den3b" },
  { name: "Marcus Holloway", deals: 24, revenue: "$4.8M", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5c_f7JIMFz2A6T0EfLL-fcKd6GW_-QV3_X2HObN-bbLuSa4-KssG_56C75OAtg9xoyOoZLd_hnJRiOVhUTp4jDYIxFZn3oarS0sPKtyTSxiQHtekUnB94zuJDD30ETy_4MmZ0gZ-Mc9BaS7sFgc9lRP8Cmx0Fll9VT47ZD4uyCfnilHxB5nM_zJXOQ5IwSMBpl1RydikZ9r075LsGtua7txzo7D2mB_aWxBYanN0f6gY4mApjtBsleX7vNAH3kzR-oMHSzoJVxif" },
  { name: "James Wilson", deals: 11, revenue: "$8.0M", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY0b9eHrjInYaFSha32W7PWhhqgvbqnRoV4D-8MFTRQS7JY-eKP9aTIRBgynhZQ5x1EkkgUrXYr6aJvv_v2dxuoqQrQvhEQVRTRZVmJFuaDMK01tcoSEOMfI0oqm4G-4-_rHQrddHqki4jKs8bqfeALVUF7v87yneY8ikhQsAHkBQ0y0YE1S7QkH_BbWnWP4k6r3HprqkS1bt_m-Dn0EqeluDAURSRlKXuHA8jTdQT4FzDZBPJa4Tp8JFLE65UxrtKHYI7-XF4U94p" },
];

export default function ReportPage() {
  const [period, setPeriod] = useState("This Month");
  return (
    <>
      <Header title="Reports & Analytics" subtitle="Performance metrics and business insights" />

      <main className="p-container-margin space-y-section-gap">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-headline-lg text-on-surface font-bold">Analytics Overview</h2>
            <p className="text-body-md text-on-surface-variant mt-1">June 2025 — YTD Performance</p>
          </div>
          <div className="flex gap-3">
            <div className="w-44">
              <AppSelect instanceId="report-period" size="md" value={period}
                onChange={(v) => setPeriod(v ?? "This Month")}
                options={["This Month", "Last Quarter", "Year to Date"].map((p) => ({ value: p, label: p }))} />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wide text-[11px]">
                  {s.label}
                </span>
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[20px] ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {s.icon}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-metric-lg font-bold text-on-surface">{s.value}</span>
                <span className={`text-label-sm font-semibold px-2 py-0.5 rounded-full ${s.up ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"}`}>
                  {s.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Main charts area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue trend */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-md font-headline-md font-bold text-on-surface">Revenue Trend</h3>
              <div className="flex gap-2 text-label-sm">
                {["7D", "1M", "3M", "1Y"].map((p, i) => (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${i === 1 ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {/* Chart placeholder with animated bars */}
            <div className="h-56 flex items-end justify-between gap-2 px-2">
              {[65, 80, 55, 90, 72, 85, 60, 95, 70, 88, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-primary/20 transition-all duration-500 relative group hover:bg-primary/80"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${Math.round(h * 23.5)}K
                    </div>
                  </div>
                  <span className="text-[10px] text-outline">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Agents */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <h3 className="text-headline-md font-headline-md font-bold text-on-surface mb-6">Top Performers</h3>
            <div className="space-y-4">
              {topAgents.map((agent, i) => (
                <div key={agent.name} className="flex items-center gap-3">
                  <span className={`text-label-sm font-bold w-5 text-right ${i === 0 ? "text-primary" : "text-outline"}`}>
                    #{i + 1}
                  </span>
                  <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-surface" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-semibold text-on-surface truncate">{agent.name}</p>
                    <p className="text-body-sm text-outline">{agent.deals} deals · {agent.revenue}</p>
                  </div>
                  {i === 0 && (
                    <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">Top</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline breakdown */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
          <h3 className="text-headline-md font-headline-md font-bold text-on-surface mb-6">Pipeline Stage Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { stage: "Inquiry", count: 48, pct: 32, color: "bg-secondary" },
              { stage: "Viewing", count: 35, pct: 24, color: "bg-primary" },
              { stage: "Offer", count: 22, pct: 15, color: "bg-tertiary" },
              { stage: "Negotiation", count: 18, pct: 12, color: "bg-error-container" },
              { stage: "Closed", count: 25, pct: 17, color: "bg-tertiary" },
            ].map((s) => (
              <div key={s.stage} className="text-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-surface-container-high" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" strokeDasharray={`${s.pct}, 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-label-md font-bold text-on-surface">{s.pct}%</span>
                </div>
                <p className="text-label-md font-bold text-on-surface">{s.stage}</p>
                <p className="text-body-sm text-outline">{s.count} deals</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
