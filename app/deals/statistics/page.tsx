"use client";

import Link from 'next/link';
import { useState } from "react";
import AppSelect from "../../components/forms/AppSelect";

export default function DealStatisticsPage() {
  const [period, setPeriod] = useState("This Month");
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/deals" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-headline-lg text-on-surface">Pipeline Statistics</h1>
            <p className="text-body-md text-secondary mt-1">Analyze your sales performance and forecasts.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="hidden sm:block w-40">
            <AppSelect instanceId="stats-period" size="md" value={period}
              onChange={(v) => setPeriod(v ?? "This Month")}
              options={["This Month", "Last Month", "This Quarter", "This Year"].map((p) => ({ value: p, label: p }))} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-label-sm text-secondary uppercase tracking-wider font-bold">Total Revenue</p>
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1.5 rounded-lg">account_balance_wallet</span>
          </div>
          <h2 className="text-metric-md text-on-surface mb-2">$4.2M</h2>
          <div className="flex items-center gap-2">
            <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12.5%
            </span>
            <span className="text-body-sm text-secondary">vs last month</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-label-sm text-secondary uppercase tracking-wider font-bold">Deals Won</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">emoji_events</span>
          </div>
          <h2 className="text-metric-md text-on-surface mb-2">18</h2>
          <div className="flex items-center gap-2">
            <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +4
            </span>
            <span className="text-body-sm text-secondary">vs last month</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-label-sm text-secondary uppercase tracking-wider font-bold">Win Rate</p>
            <span className="material-symbols-outlined text-orange-600 bg-orange-500/10 p-1.5 rounded-lg">pie_chart</span>
          </div>
          <h2 className="text-metric-md text-on-surface mb-2">64%</h2>
          <div className="flex items-center gap-2">
            <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -2.1%
            </span>
            <span className="text-body-sm text-secondary">vs last month</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-label-sm text-secondary uppercase tracking-wider font-bold">Avg. Deal Size</p>
            <span className="material-symbols-outlined text-secondary bg-surface-container-highest p-1.5 rounded-lg">monetization_on</span>
          </div>
          <h2 className="text-metric-md text-on-surface mb-2">$850k</h2>
          <div className="flex items-center gap-2">
            <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +5.4%
            </span>
            <span className="text-body-sm text-secondary">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
          <h2 className="text-headline-md text-on-surface mb-6">Pipeline by Stage</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-label-md text-on-surface">New Deal</span>
                <span className="text-label-md text-on-surface">$3.5M (3)</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-label-md text-on-surface">Negotiation</span>
                <span className="text-label-md text-on-surface">$5.2M (2)</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-label-md text-on-surface">Booking</span>
                <span className="text-label-md text-on-surface">$1.2M (1)</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-label-md text-on-surface">Documentation</span>
                <span className="text-label-md text-on-surface">$3.1M (2)</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '31%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
          <h2 className="text-headline-md text-on-surface mb-6">Top Performing Agents</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-md shrink-0">
                MH
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-label-md text-on-surface">Marcus Holloway</span>
                  <span className="text-label-md text-on-surface">$2.1M</span>
                </div>
                <p className="text-body-sm text-secondary">5 Deals Closed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-md shrink-0">
                ER
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-label-md text-on-surface">Elena Rodriguez</span>
                  <span className="text-label-md text-on-surface">$1.4M</span>
                </div>
                <p className="text-body-sm text-secondary">3 Deals Closed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-md shrink-0">
                DK
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-label-md text-on-surface">David Kim</span>
                  <span className="text-label-md text-on-surface">$700k</span>
                </div>
                <p className="text-body-sm text-secondary">1 Deal Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
