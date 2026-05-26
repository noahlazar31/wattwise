"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBills, getInsights } from "@/lib/api";
import type { Bill, Insight } from "@/lib/api";
import UsageChart from "@/components/UsageChart";

interface PageProps {
  params: Promise<{ household_id: string }>;
}

const INSIGHT_COLORS: Record<string, string> = {
  overpaying_flag: "red",
  avg_rate_vs_benchmark: "blue",
  mom_usage_change: "purple",
  estimated_annual_spend: "green",
};

function InsightBadge({ type }: { type: string }) {
  const color = INSIGHT_COLORS[type] ?? "zinc";
  const classes: Record<string, string> = {
    red: "bg-red-50 border-red-200 text-red-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    green: "bg-green-50 border-green-200 text-green-700",
    zinc: "bg-zinc-50 border-zinc-200 text-zinc-700",
  };
  const icons: Record<string, string> = {
    red: "⚠️",
    blue: "📊",
    purple: "📈",
    green: "💰",
    zinc: "💡",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${classes[color]}`}
    >
      {icons[color]}
    </span>
  );
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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [householdId]);

  const latestBill = bills[0];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Nav */}
      <header className="bg-white border-b border-zinc-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl tracking-tight">WattWise</span>
          </Link>
          <Link
            href="/upload"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            + Add another bill
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading your energy report…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">
                Your Energy Report
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Household ID: <code className="font-mono">{householdId}</code>
              </p>
            </div>

            {/* Latest bill card */}
            {latestBill ? (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-zinc-900">Latest Bill</h2>
                  <span className="text-xs text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                    {latestBill.utility_provider ?? "Unknown provider"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-xs text-amber-600 font-medium mb-1">Total Cost</p>
                    <p className="text-2xl font-bold text-amber-700">
                      ${Number(latestBill.total_cost).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 font-medium mb-1">kWh Used</p>
                    <p className="text-2xl font-bold text-zinc-800">
                      {Number(latestBill.kwh_used).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 font-medium mb-1">Rate</p>
                    <p className="text-2xl font-bold text-zinc-800">
                      ${(Number(latestBill.total_cost) / Number(latestBill.kwh_used)).toFixed(4)}
                    </p>
                    <p className="text-xs text-zinc-400">/kWh</p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 font-medium mb-1">Period</p>
                    <p className="text-sm font-semibold text-zinc-800 leading-tight">
                      {new Date(latestBill.billing_period_start).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" – "}
                      {new Date(latestBill.billing_period_end).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {(latestBill.rate_plan || latestBill.account_last_four) && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {latestBill.rate_plan && (
                      <span className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-full">
                        Rate plan: {latestBill.rate_plan}
                      </span>
                    )}
                    {latestBill.account_last_four && (
                      <span className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-full">
                        Account: ****{latestBill.account_last_four}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 text-center">
                <p className="text-zinc-400">No bills found yet.</p>
              </div>
            )}

            {/* Insights */}
            {insights.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="font-semibold text-zinc-900 mb-5">
                  AI Insights
                </h2>
                <div className="space-y-3">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`rounded-xl p-4 border flex gap-3 items-start ${
                        insight.insight_type === "overpaying_flag"
                          ? "bg-red-50 border-red-200"
                          : insight.insight_type === "estimated_annual_spend"
                          ? "bg-green-50 border-green-200"
                          : "bg-zinc-50 border-zinc-100"
                      }`}
                    >
                      <InsightBadge type={insight.insight_type} />
                      <p
                        className={`text-sm leading-relaxed ${
                          insight.insight_type === "overpaying_flag"
                            ? "text-red-700"
                            : insight.insight_type === "estimated_annual_spend"
                            ? "text-green-700"
                            : "text-zinc-700"
                        }`}
                      >
                        {insight.insight_value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage chart */}
            {bills.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="font-semibold text-zinc-900 mb-5">
                  kWh Usage Over Time
                </h2>
                <UsageChart bills={bills} />
              </div>
            )}

            {/* All bills table */}
            {bills.length > 1 && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="font-semibold text-zinc-900 mb-5">
                  All Bills ({bills.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-zinc-400 border-b border-zinc-100">
                        <th className="pb-3 font-medium">Period</th>
                        <th className="pb-3 font-medium">Provider</th>
                        <th className="pb-3 font-medium text-right">kWh</th>
                        <th className="pb-3 font-medium text-right">Cost</th>
                        <th className="pb-3 font-medium text-right">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {bills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3 text-zinc-700">
                            {new Date(bill.billing_period_start).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 text-zinc-500">
                            {bill.utility_provider ?? "—"}
                          </td>
                          <td className="py-3 text-right text-zinc-700 font-mono">
                            {Number(bill.kwh_used).toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-zinc-700 font-mono">
                            ${Number(bill.total_cost).toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-zinc-500 font-mono text-xs">
                            ${(Number(bill.total_cost) / Number(bill.kwh_used)).toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="bg-zinc-900 rounded-2xl p-8 text-center">
              <h3 className="text-white font-semibold text-lg mb-2">
                Got another bill?
              </h3>
              <p className="text-zinc-400 text-sm mb-5">
                Add more bills to get better insights and track your usage over
                time.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-amber-400 text-zinc-900 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-amber-300 transition-colors"
              >
                Add Another Bill →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
