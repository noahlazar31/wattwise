"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBills, getInsights } from "@/lib/api";
import type { Bill, Insight } from "@/lib/api";
import UsageChart from "@/components/UsageChart";
import StatCard from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import RecommendationCard, { type ProviderRec } from "@/components/RecommendationCard";
import SavingsTipCard, { type SavingsTip } from "@/components/SavingsTipCard";

interface PageProps {
  params: Promise<{ household_id: string }>;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

function parseSafe<T>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

export default function DashboardPage({ params }: PageProps) {
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setHouseholdId(p.household_id));
  }, [params]);

  useEffect(() => {
    if (!householdId) return;
    async function load() {
      try {
        const [billsRes, insightsRes] = await Promise.all([
          getBills(householdId!),
          getInsights(householdId!),
        ]);
        setBills(billsRes.bills);
        setInsights(insightsRes.insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [householdId]);

  const latest = bills[0];
  const rate = latest ? Number(latest.total_cost) / Number(latest.kwh_used) : 0;

  // Split insights by type
  const providerRecs: ProviderRec[] = insights
    .filter((i) => i.insight_type === "provider_recommendation")
    .map((i) => parseSafe<ProviderRec>(i.insight_value))
    .filter(Boolean) as ProviderRec[];

  const savingsTips: SavingsTip[] = insights
    .filter((i) => i.insight_type === "savings_tip")
    .map((i) => parseSafe<SavingsTip>(i.insight_value))
    .filter(Boolean) as SavingsTip[];

  const baseInsights = insights.filter(
    (i) => i.insight_type !== "provider_recommendation" && i.insight_type !== "savings_tip"
  );

  // Total potential savings
  const bestProviderAnnual =
    providerRecs.length > 0 ? Math.max(...providerRecs.map((r) => r.annual_savings)) : 0;
  const tipsAnnual = savingsTips.reduce((s, t) => s + t.monthly_savings, 0) * 12;
  const totalSavings = bestProviderAnnual + tipsAnnual;

  return (
    <div className="dark-page relative min-h-screen overflow-x-hidden">
      {/* Background orbs */}
      <div className="orb orb-blue" style={{ top: "-100px", left: "-150px" }} />
      <div className="orb orb-purple" style={{ bottom: "0px", right: "-100px" }} />

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex h-14 items-center justify-between px-6"
        style={{
          background: "rgba(10,15,30,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-all duration-200 group-hover:scale-110"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
          >
            ⚡
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">WattWise</span>
        </Link>

        <Link
          href="/upload"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="text-blue-400">+</span>
          Add bill
        </Link>
      </header>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-10">

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6">
            <SkeletonBlock className="h-8 w-56" />
            <SkeletonBlock className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-28" />)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => <SkeletonBlock key={i} className="h-56" />)}
            </div>
            <SkeletonBlock className="h-64" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl p-6 text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            ⚠ {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">

            {/* ── Page header ───────────────────────────────────── */}
            <div className="fade-up fade-up-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Energy Report
              </h1>
              <p className="mt-0.5 text-xs font-mono text-slate-700">
                {householdId}
              </p>
            </div>

            {/* ── Savings potential banner ───────────────────────── */}
            {totalSavings > 0 && (
              <div
                className="fade-up fade-up-2 relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.10) 0%, rgba(16,185,129,0.07) 100%)",
                  border: "1px solid rgba(34,197,94,0.18)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{ background: "rgba(34,197,94,0.12)" }}
                    >
                      💰
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-0.5">
                        Savings Potential Found
                      </p>
                      <p className="text-xl font-bold text-white">
                        Save up to{" "}
                        <span className="text-emerald-400">${totalSavings.toFixed(0)}/year</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {providerRecs.length > 0 && `${providerRecs.length} cheaper provider${providerRecs.length !== 1 ? "s" : ""} found`}
                        {providerRecs.length > 0 && savingsTips.length > 0 && " · "}
                        {savingsTips.length > 0 && `${savingsTips.length} savings tips`}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#switch-save"
                    className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-400 transition-all hover:scale-105"
                    style={{
                      background: "rgba(34,197,94,0.10)",
                      border: "1px solid rgba(34,197,94,0.20)",
                    }}
                  >
                    See recommendations ↓
                  </a>
                </div>
              </div>
            )}

            {/* ── Stat tiles ───────────────────────────────────── */}
            {latest ? (
              <div className="fade-up fade-up-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                  label="Total Cost"
                  value={Number(latest.total_cost)}
                  prefix="$"
                  decimals={2}
                  progress={Math.min(Number(latest.total_cost) / 200, 1)}
                  accent="#3B82F6"
                  delay={0}
                />
                <StatCard
                  label="kWh Used"
                  value={Number(latest.kwh_used)}
                  decimals={1}
                  progress={Math.min(Number(latest.kwh_used) / 1000, 1)}
                  accent="#8B5CF6"
                  delay={80}
                  suffix=" kWh"
                />
                <StatCard
                  label="Effective Rate"
                  value={rate}
                  prefix="$"
                  suffix="/kWh"
                  decimals={4}
                  progress={Math.min(rate / 0.3, 1)}
                  accent={rate > 0.192 ? "#EF4444" : "#22C55E"}
                  delay={160}
                  sub={rate > 0.192 ? "above US avg" : "below US avg"}
                />
                <StatCard
                  label="Billing Days"
                  value={Math.ceil(
                    (new Date(latest.billing_period_end).getTime() -
                      new Date(latest.billing_period_start).getTime()) /
                      86400000
                  )}
                  decimals={0}
                  progress={0.85}
                  accent="#F59E0B"
                  delay={240}
                  sub={
                    new Date(latest.billing_period_start).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    }) +
                    " – " +
                    new Date(latest.billing_period_end).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })
                  }
                />
              </div>
            ) : (
              <div
                className="fade-up fade-up-3 rounded-2xl p-8 text-center text-sm text-slate-500"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                No bills uploaded yet.
              </div>
            )}

            {/* ── Latest bill metadata ─────────────────────────── */}
            {latest && (
              <div
                className="fade-up fade-up-4 rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Latest Bill
                  </p>
                  {latest.utility_provider && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium text-blue-300"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                      }}
                    >
                      {latest.utility_provider}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {latest.rate_plan && (
                    <div
                      className="rounded-lg px-3 py-2 text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-slate-500">Rate Plan </span>
                      <span className="font-mono font-semibold text-slate-200">
                        {latest.rate_plan}
                      </span>
                    </div>
                  )}
                  {latest.account_last_four && (
                    <div
                      className="rounded-lg px-3 py-2 text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-slate-500">Account </span>
                      <span className="font-mono font-semibold text-slate-200">
                        ••••{latest.account_last_four}
                      </span>
                    </div>
                  )}
                  <div
                    className="rounded-lg px-3 py-2 text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="text-slate-500">Period </span>
                    <span className="font-mono font-semibold text-slate-200">
                      {new Date(latest.billing_period_start).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" – "}
                      {new Date(latest.billing_period_end).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Switch & Save ─────────────────────────────────── */}
            {providerRecs.length > 0 && (
              <div id="switch-save" className="fade-up fade-up-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Switch &amp; Save
                  </p>
                  <span className="text-xs text-emerald-400/60">
                    {providerRecs.length} alternative{providerRecs.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {providerRecs.map((rec, i) => (
                    <RecommendationCard key={i} rec={rec} currentRate={rate} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Reduce Your Bill ─────────────────────────────── */}
            {savingsTips.length > 0 && (
              <div className="fade-up fade-up-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Reduce Your Bill
                  </p>
                  <span className="text-xs text-amber-400/60">
                    ${savingsTips.reduce((s, t) => s + t.monthly_savings, 0).toFixed(0)}/mo potential
                  </span>
                </div>
                <div className="space-y-2">
                  {savingsTips.map((tip, i) => (
                    <SavingsTipCard key={i} tip={tip} />
                  ))}
                </div>
              </div>
            )}

            {/* ── AI Insights (rate analysis, trends) ───────────── */}
            {baseInsights.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Rate &amp; Usage Analysis
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {baseInsights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Usage chart ──────────────────────────────────── */}
            {bills.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    kWh Usage Over Time
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-blue-400"
                    style={{ background: "rgba(59,130,246,0.1)" }}
                  >
                    {bills.length} bill{bills.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <UsageChart bills={bills} />
              </div>
            )}

            {/* ── Bills table ──────────────────────────────────── */}
            {bills.length > 1 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="px-6 py-4 border-b border-white/5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Bill History
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Period", "Provider", "kWh", "Cost", "Rate"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr
                        key={bill.id}
                        className="border-b border-white/[0.03] transition-colors duration-150 hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-3.5 text-slate-300 font-medium">
                          {new Date(bill.billing_period_start).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500">
                          {bill.utility_provider ?? "—"}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-300">
                          {Number(bill.kwh_used).toLocaleString()}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-300">
                          ${Number(bill.total_cost).toFixed(2)}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-xs text-slate-500">
                          ${(Number(bill.total_cost) / Number(bill.kwh_used)).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── CTA banner ───────────────────────────────────── */}
            <div
              className="relative overflow-hidden rounded-2xl p-10 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(59,130,246,0.08) 100%)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {/* Subtle grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
                  Track more · save more
                </p>
                <h3 className="text-xl font-bold text-white mb-2">Got another bill?</h3>
                <p className="text-sm text-slate-400 mb-7 max-w-sm mx-auto">
                  Each bill improves your insights and makes your annual savings forecast more accurate.
                </p>
                <Link
                  href="/upload"
                  className="glow-btn inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-400 hover:scale-105"
                >
                  Upload Another Bill
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
