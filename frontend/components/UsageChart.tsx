"use client";

import {
  LineChart,
  Line,
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
      cost: Number(b.total_cost),
    }));

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-zinc-400 text-sm">
        No usage data yet
      </div>
    );
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f4f4f5",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
            }}
            formatter={(value) => [`${value} kWh`, "Usage"]}
          />
          <Line
            type="monotone"
            dataKey="kWh"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
