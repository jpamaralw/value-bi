"use client";

import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { formatCurrency } from "@/lib/financial";

interface ComparisonChartProps {
  data: { mes: string; [key: string]: number | string }[];
  label1: string;
  label2: string;
  color1?: string;
  color2?: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-value-sidebar border border-value-border rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value as number)}
        </p>
      ))}
    </div>
  );
}

export default function ComparisonChart({
  data,
  label1,
  label2,
  color1 = "#1D9E75",
  color2 = "#ef4444",
}: ComparisonChartProps) {
  return (
    <div className="bg-value-card border border-value-border rounded-xl p-5 mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        {label1} vs {label2}
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickFormatter={(v) =>
              v >= 1000000
                ? `${(v / 1000000).toFixed(1)}M`
                : v >= 1000
                ? `${(v / 1000).toFixed(0)}K`
                : String(v)
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey={label1} fill={color1} radius={[4, 4, 0, 0]} opacity={0.8} />
          <Bar dataKey={label2} fill={color2} radius={[4, 4, 0, 0]} opacity={0.8} />
          <Line
            type="monotone"
            dataKey="margem"
            name="Margem"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
