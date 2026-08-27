import React from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendDirection?: "up" | "down" | "stable";
  iconBgColor?: string;
  iconTextColor?: string;
}

export default function KpiCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "up",
  iconBgColor = "bg-primary/10",
  iconTextColor = "text-primary",
}: KpiCardProps) {
  return (
    <div className="bg-white p-card-padding rounded-xl ambient-shadow flex flex-col justify-between h-40 border border-outline-variant/30">
      <div className="flex justify-between items-start">
        <span className="text-label-md text-on-surface-variant">{title}</span>
        <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center ${iconTextColor}`}>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-metric-lg font-bold text-on-surface">{value}</h3>
        {trend && (
          <span
            className={`flex items-center text-label-sm px-2 py-0.5 rounded-full ${
              trendDirection === "up"
                ? "bg-tertiary-fixed-dim/20 text-tertiary"
                : trendDirection === "down"
                ? "bg-error-container/20 text-error"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {trendDirection === "up" && (
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
            )}
            {trendDirection === "down" && (
              <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span>
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
