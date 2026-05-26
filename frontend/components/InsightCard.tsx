"use client";
import type { Insight } from "@/lib/api";

const CONFIG: Record<string, {
  gradient: string;
  bg: string;
  icon: string;
  label: string;
}> = {
  overpaying_flag: {
    gradient: "linear-gradient(180deg, #EF4444, #F97316)",
    bg: "rgba(239,68,68,0.06)",
    icon: "⚠",
    label: "Overpaying Alert",
  },
  avg_rate_vs_benchmark: {
    gradient: "linear-gradient(180deg, #3B82F6, #8B5CF6)",
    bg: "rgba(59,130,246,0.06)",
    icon: "◈",
    label: "Rate Analysis",
  },
  mom_usage_change: {
    gradient: "linear-gradient(180deg, #8B5CF6, #EC4899)",
    bg: "rgba(139,92,246,0.06)",
    icon: "↗",
    label: "Usage Trend",
  },
  estimated_annual_spend: {
    gradient: "linear-gradient(180deg, #22C55E, #10B981)",
    bg: "rgba(34,197,94,0.06)",
    icon: "◎",
    label: "Annual Forecast",
  },
  provider_recommendation: {
    gradient: "linear-gradient(180deg, #22C55E, #10B981)",
    bg: "rgba(34,197,94,0.06)",
    icon: "⇄",
    label: "Provider Switch",
  },
  savings_tip: {
    gradient: "linear-gradient(180deg, #F59E0B, #F97316)",
    bg: "rgba(245,158,11,0.06)",
    icon: "💡",
    label: "Savings Tip",
  },
};

const DEFAULT_CONFIG = {
  gradient: "linear-gradient(180deg, #64748B, #94A3B8)",
  bg: "rgba(100,116,139,0.06)",
  icon: "·",
  label: "Insight",
};

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const cfg = CONFIG[insight.insight_type] ?? DEFAULT_CONFIG;

  return (
    <div
      className="group relative flex gap-4 rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: cfg.bg,
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Left gradient bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: cfg.gradient }}
      />

      {/* Icon */}
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {cfg.icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
          {cfg.label}
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          {insight.insight_value}
        </p>
      </div>
    </div>
  );
}
