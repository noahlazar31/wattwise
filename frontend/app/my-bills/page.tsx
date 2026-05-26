"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserHouseholds, type HouseholdSummary } from "@/lib/api";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export default function MyBillsPage() {
  // useUser is only available when Clerk is configured
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clerkUser, setClerkUser] = useState<any>(null);
  const [households, setHouseholds] = useState<HouseholdSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically access Clerk only if it's available
    async function loadUser() {
      try {
        const { useUser } = await import("@clerk/nextjs");
        // We can't call hooks dynamically, so we use the Clerk global
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clerk = (window as any).Clerk;
        if (clerk?.user) {
          setClerkUser(clerk.user);
          const res = await getUserHouseholds(clerk.user.id);
          setHouseholds(res.households);
        }
      } catch {
        // Clerk not available
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <div className="dark-page relative min-h-screen overflow-x-hidden" style={{ background: "#0A0F1E" }}>
      <div className="orb orb-blue" style={{ top: "-100px", left: "-150px" }} />

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
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-blue-400">+</span> Add bill
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-10">
        <div className="fade-up fade-up-1 mb-8">
          <h1 className="text-2xl font-bold text-white">My Bills</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {clerkUser?.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonBlock key={i} className="h-24" />)}
          </div>
        )}

        {!loading && households.length === 0 && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-3xl mb-4">📄</p>
            <h2 className="text-lg font-bold text-white mb-2">No bills yet</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              Upload your first utility bill to start tracking your energy costs and finding savings.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: "rgba(59,130,246,0.8)", border: "1px solid rgba(59,130,246,0.4)" }}
            >
              Upload Your First Bill →
            </Link>
          </div>
        )}

        {!loading && households.length > 0 && (
          <div className="space-y-3">
            {households.map((h, i) => {
              const bill = h.latest_bill;
              const rate = bill
                ? Number(bill.total_cost) / Number(bill.kwh_used)
                : null;
              const isOver = rate !== null && rate > 0.192;

              return (
                <Link
                  key={h.id}
                  href={`/dashboard/${h.id}`}
                  className={`fade-up fade-up-${Math.min(i + 2, 6)} block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {bill?.utility_provider ?? "Unknown Provider"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {bill
                          ? new Date(bill.billing_period_start).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })
                          : "No bills yet"}
                      </p>
                    </div>
                    <div className="text-right">
                      {bill && (
                        <>
                          <p className="text-lg font-bold text-white">
                            ${Number(bill.total_cost).toFixed(2)}
                          </p>
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-semibold"
                            style={{
                              background: isOver ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                              color: isOver ? "#F87171" : "#4ADE80",
                            }}
                          >
                            ${rate?.toFixed(3)}/kWh · {isOver ? "↑ High" : "✓ Good"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
