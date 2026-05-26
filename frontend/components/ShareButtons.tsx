"use client";

import { useState } from "react";

interface ShareButtonsProps {
  householdId: string;
  annualSavings?: number;
}

export default function ShareButtons({ householdId, annualSavings = 0 }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/result/${householdId}`
      : `/result/${householdId}`;

  const twitterText =
    annualSavings > 0
      ? `I just found out I could save $${Math.round(annualSavings)}/year on my electricity bill by switching providers 🔋 Check your rate for free:`
      : `I just analyzed my electricity bill with WattWise — find out if you're overpaying:`;

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-105"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        𝕏 Share
      </a>
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:scale-105"
        style={{
          background: copied ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.06)",
          border: copied ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.08)",
          color: copied ? "#22C55E" : "#94A3B8",
        }}
      >
        {copied ? "✓ Copied!" : "🔗 Copy link"}
      </button>
    </div>
  );
}
