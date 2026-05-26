"use client";

export interface ProviderRec {
  name: string;
  estimated_rate: number;
  monthly_savings: number;
  annual_savings: number;
  description: string;
}

interface RecommendationCardProps {
  rec: ProviderRec;
  currentRate: number;
  index: number;
}

export default function RecommendationCard({ rec, currentRate, index }: RecommendationCardProps) {
  const savingsPct = Math.round(((currentRate - rec.estimated_rate) / currentRate) * 100);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(34,197,94,0.05)",
        border: "1px solid rgba(34,197,94,0.15)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
        style={{ background: "#22C55E" }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500/60 mb-1">
            Option {index + 1}
          </p>
          <h3 className="text-base font-bold text-white leading-tight">{rec.name}</h3>
        </div>
        {savingsPct > 0 && (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-bold text-emerald-400 shrink-0"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            -{savingsPct}%
          </span>
        )}
      </div>

      {/* Rate comparison */}
      <div className="relative flex items-center gap-2 mb-4">
        <div
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs text-slate-500 mb-0.5">Their rate</p>
          <p className="text-lg font-bold text-emerald-400">
            ${rec.estimated_rate.toFixed(3)}
            <span className="text-xs font-normal text-slate-500">/kWh</span>
          </p>
        </div>
        <span className="text-slate-600 text-sm shrink-0">→</span>
        <div
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs text-slate-500 mb-0.5">Your rate</p>
          <p className="text-lg font-bold text-slate-400">
            ${currentRate.toFixed(3)}
            <span className="text-xs font-normal text-slate-500">/kWh</span>
          </p>
        </div>
      </div>

      {/* Savings pill */}
      <div
        className="relative rounded-xl p-4 text-center mb-3"
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.12)",
        }}
      >
        <p className="text-xs text-emerald-400/60 uppercase tracking-widest mb-1">You save</p>
        <p className="text-3xl font-black text-emerald-400">
          ${rec.monthly_savings.toFixed(0)}
          <span className="text-base font-semibold text-emerald-500/60">/mo</span>
        </p>
        <p className="text-xs text-emerald-400/50 mt-0.5">
          ${rec.annual_savings.toFixed(0)} per year
        </p>
      </div>

      <p className="relative text-xs text-slate-500 leading-relaxed">{rec.description}</p>
    </div>
  );
}
