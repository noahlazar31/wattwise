"use client";

import { useState } from "react";
import { captureEmail } from "@/lib/api";

interface EmailCaptureProps {
  householdId?: string;
  source?: string;
}

export default function EmailCapture({ householdId, source = "dashboard" }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    await captureEmail(email, householdId, source);
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-4"
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <span className="text-xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-white">You&apos;re on the list!</p>
          <p className="text-xs text-slate-500 mt-0.5">
            We&apos;ll alert you when better rates appear in your area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
        📬 Rate Alerts
      </p>
      <p className="text-sm text-slate-300 mb-4">
        Get notified when cheaper rates appear in your area — free, no spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:ring-1 focus:ring-blue-500/50"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
          style={{ background: "rgba(59,130,246,0.8)", border: "1px solid rgba(59,130,246,0.4)" }}
        >
          {status === "loading" ? "…" : "Alert me"}
        </button>
      </form>
    </div>
  );
}
