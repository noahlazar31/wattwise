import Link from "next/link";
import type { Metadata } from "next";
import { getBills, getInsights } from "@/lib/api";
import ShareButtons from "@/components/ShareButtons";
import type { ProviderRec } from "@/components/RecommendationCard";
import type { SavingsTip } from "@/components/SavingsTipCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

function parseSafe<T>(str: string): T | null {
  try { return JSON.parse(str) as T; } catch { return null; }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const billsData = await getBills(id);
    const latest = billsData.bills[0];
    if (!latest) return { title: "Energy Analysis | WattWise" };
    const rate = Number(latest.total_cost) / Number(latest.kwh_used);
    const isOver = rate > 0.192;
    return {
      title: `${isOver ? "Overpaying" : "Good Rate"} at $${rate.toFixed(3)}/kWh | WattWise`,
      description: `This household pays $${rate.toFixed(3)}/kWh for electricity. See if you can do better with WattWise — free energy bill analysis.`,
      openGraph: {
        title: `${isOver ? "⚠️ Overpaying" : "✅ Good rate"} — $${rate.toFixed(3)}/kWh`,
        description: `Check if you're overpaying for electricity. Free AI-powered analysis in under 10 seconds.`,
      },
    };
  } catch {
    return { title: "Energy Analysis | WattWise" };
  }
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;

  let bills: Awaited<ReturnType<typeof getBills>>["bills"] = [];
  let insights: Awaited<ReturnType<typeof getInsights>>["insights"] = [];

  try {
    const [b, i] = await Promise.all([getBills(id), getInsights(id)]);
    bills = b.bills;
    insights = i.insights;
  } catch {
    // Show not found
  }

  const latest = bills[0];
  const rate = latest ? Number(latest.total_cost) / Number(latest.kwh_used) : null;
  const isOver = rate !== null && rate > 0.192;

  const providerRecs: ProviderRec[] = insights
    .filter((i) => i.insight_type === "provider_recommendation")
    .map((i) => parseSafe<ProviderRec>(i.insight_value))
    .filter(Boolean) as ProviderRec[];

  const savingsTips: SavingsTip[] = insights
    .filter((i) => i.insight_type === "savings_tip")
    .map((i) => parseSafe<SavingsTip>(i.insight_value))
    .filter(Boolean) as SavingsTip[];

  const bestAnnual = providerRecs.length > 0
    ? Math.max(...providerRecs.map((r) => r.annual_savings))
    : 0;
  const tipsAnnual = savingsTips.reduce((s, t) => s + t.monthly_savings, 0) * 12;
  const totalSavings = bestAnnual + tipsAnnual;

  if (!latest) {
    return (
      <div className="dark-page min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-2xl mb-3">🔍</p>
          <h1 className="text-xl font-bold text-white mb-2">Analysis not found</h1>
          <p className="text-sm text-slate-500 mb-6">This result may have expired or the link is incorrect.</p>
          <Link href="/upload" className="rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "#F5A623", color: "#111" }}>
            Analyze My Bill →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-page relative min-h-screen overflow-hidden" style={{ background: "#0A0F1E" }}>
      {/* Orbs */}
      <div className="orb orb-blue" style={{ top: "-80px", left: "-100px" }} />
      <div className="orb orb-purple" style={{ bottom: "0", right: "-80px" }} />

      {/* Nav */}
      <header
        className="sticky top-0 z-50 flex h-14 items-center justify-between px-6"
        style={{ background: "rgba(10,15,30,0.85)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
            ⚡
          </div>
          <span className="text-sm font-semibold text-white">WattWise</span>
        </Link>
        <Link href="/upload"
          className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:scale-105"
          style={{ background: "#F5A623", color: "#111" }}>
          Analyze My Bill →
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-6 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
            📊 Shared Energy Report
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {latest.utility_provider ? `${latest.utility_provider} Bill Analysis` : "Energy Bill Analysis"}
          </h1>
          {totalSavings > 0 && (
            <p className="text-sm text-slate-400">
              <span className="text-emerald-400 font-bold">${Math.round(totalSavings)}/year</span> in potential savings found
            </p>
          )}
        </div>

        {/* Rate card */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Rate Comparison</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-xs text-slate-500 mb-1">This household</p>
              <p className={`text-3xl font-black ${isOver ? "text-red-400" : "text-emerald-400"}`}>
                ${rate?.toFixed(3)}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">/kWh</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-xs text-slate-500 mb-1">US average</p>
              <p className="text-3xl font-black" style={{ color: "#F5A623" }}>$0.160</p>
              <p className="text-xs text-slate-600 mt-0.5">/kWh</p>
            </div>
          </div>
          <div className="rounded-xl p-3 text-center text-sm font-semibold"
            style={{
              background: isOver ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
              border: isOver ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(34,197,94,0.15)",
              color: isOver ? "#F87171" : "#4ADE80",
            }}>
            {isOver
              ? `⚠ Paying ${Math.round(((rate! - 0.16) / 0.16) * 100)}% above the US average`
              : "✅ Rate is at or below the US average"}
          </div>
        </div>

        {/* Best provider rec */}
        {providerRecs[0] && (
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-3">
              Best Alternative Found
            </p>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-base font-bold text-white">{providerRecs[0].name}</p>
                <p className="text-xs text-slate-500">${providerRecs[0].estimated_rate.toFixed(3)}/kWh</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-400">${Math.round(providerRecs[0].monthly_savings)}/mo</p>
                <p className="text-xs text-emerald-400/50">${Math.round(providerRecs[0].annual_savings)}/year saved</p>
              </div>
            </div>
          </div>
        )}

        {/* Share section */}
        <div className="rounded-2xl p-5 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Share this report
          </p>
          <ShareButtons householdId={id} annualSavings={totalSavings} />
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl p-8"
          style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.15)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#F5A623" }}>
            Check your own bill
          </p>
          <h2 className="text-xl font-bold text-white mb-2">Are you overpaying?</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
            Upload your utility bill and get your own analysis in under 10 seconds. Free, no account needed.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-full font-semibold transition-all hover:scale-105"
            style={{ background: "#F5A623", color: "#111", padding: "12px 28px", boxShadow: "0 4px 20px rgba(245,166,35,0.3)" }}
          >
            Analyze My Bill — Free →
          </Link>
        </div>

      </main>
    </div>
  );
}
