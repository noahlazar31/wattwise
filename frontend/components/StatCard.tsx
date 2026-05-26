"use client";
import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  progress?: number; // 0–1
  accent?: string;
  delay?: number;
  sub?: string;
}

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  progress = 0.6,
  accent = "#3B82F6",
  delay = 0,
  sub,
}: StatCardProps) {
  const animated = useCountUp(value, 1400, decimals, delay);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 cursor-default
                 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-20 blur-2xl
                   transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: accent }}
      />

      <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-3">
        {label}
      </p>

      <p className="text-3xl font-bold tracking-tight text-white">
        <span className="text-slate-400 text-xl mr-0.5">{prefix}</span>
        {animated.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        <span className="text-slate-400 text-base ml-0.5">{suffix}</span>
      </p>

      {sub && (
        <p className="mt-1 text-xs text-slate-500">{sub}</p>
      )}

      {/* Progress bar */}
      <div className="mt-4 h-px w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${Math.min(progress * 100, 100)}%`,
            background: `linear-gradient(90deg, ${accent}55, ${accent})`,
          }}
        />
      </div>
    </div>
  );
}
