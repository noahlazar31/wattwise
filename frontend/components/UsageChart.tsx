"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Bill } from "@/lib/api";

interface UsageChartProps {
  bills: Bill[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: "rgba(15,20,40,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold">
        {Number(payload[0].value).toLocaleString()}{" "}
        <span className="text-slate-400 font-normal text-xs">kWh</span>
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#0A0F1E" stroke="#3B82F6" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3} fill="#3B82F6" />
    </g>
  );
}

export default function UsageChart({ bills }: UsageChartProps) {
  const data = [...bills]
    .sort(
      (a, b) =>
        new Date(a.billing_period_start).getTime() -
        new Date(b.billing_period_start).getTime()
    )
    .map((b) => ({
      period: new Date(b.billing_period_start).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      kWh: Number(b.kwh_used),
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-600">
        No usage data yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="kwhGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />

          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
            dx={-4}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="kWh"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#kwhGradient)"
            filter="url(#glow)"
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
