"use client";

export interface SavingsTip {
  title: string;
  tip: string;
  monthly_savings: number;
  category: string;
}

interface SavingsTipCardProps {
  tip: SavingsTip;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  behavior: { icon: "🕐", color: "#F59E0B", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.15)" },
  equipment: { icon: "⚡", color: "#3B82F6", bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.15)" },
  plan:      { icon: "📋", color: "#8B5CF6", bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.15)" },
  solar:     { icon: "☀️", color: "#F97316", bg: "rgba(249,115,22,0.07)", border: "rgba(249,115,22,0.15)" },
};

export default function SavingsTipCard({ tip }: SavingsTipCardProps) {
  const cfg = CATEGORY_CONFIG[tip.category] ?? CATEGORY_CONFIG.behavior;

  return (
    <div
      className="group flex gap-4 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
        style={{ background: `${cfg.color}18` }}
      >
        {cfg.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-slate-200 leading-tight">{tip.title}</p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: `${cfg.color}18`, color: cfg.color }}
          >
            ~${tip.monthly_savings.toFixed(0)}/mo
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{tip.tip}</p>
      </div>
    </div>
  );
}
