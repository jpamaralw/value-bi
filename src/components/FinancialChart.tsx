"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/financial";

interface ChartDataPoint {
  mes: string;
  atual: number;
  previsto: number;
  anterior: number;
}

interface FinancialChartProps {
  data: ChartDataPoint[];
  label: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-value-sidebar border border-value-border rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function FinancialChart({ data, label }: FinancialChartProps) {
  return (
    <div className="bg-value-card border border-value-border rounded-xl p-5 mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{label} — Evolução Temporal</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
          />
          <Line
            type="monotone"
            dataKey="atual"
            name={`${label} Atual`}
            stroke="#1D9E75"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#1D9E75" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="previsto"
            name={`${label} Previsto`}
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: "#3b82f6" }}
          />
          <Line
            type="monotone"
            dataKey="anterior"
            name="Ano Anterior"
            stroke="#6b7280"
            strokeWidth={1.5}
            dot={{ r: 3, fill: "#6b7280" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
