"use client";

import { useFilters } from "@/contexts/FilterContext";
import GlobalFilters from "./GlobalFilters";
import ComparisonChart from "./ComparisonChart";
import {
  CategoryData,
  calcKPIs,
  getComparisonChartData,
  formatCurrency,
  formatPercent,
} from "@/lib/financial";
import { cn } from "@/lib/utils";

interface ComparisonPageProps {
  title: string;
  group1: CategoryData;
  group2: CategoryData;
  label1: string;
  label2: string;
  color1?: string;
  color2?: string;
}

export default function ComparisonPage({
  title,
  group1,
  group2,
  label1,
  label2,
  color1 = "#1D9E75",
  color2 = "#ef4444",
}: ComparisonPageProps) {
  const { ano, getMesesFiltrados } = useFilters();
  const meses = getMesesFiltrados();

  const kpi1 = calcKPIs(group1, ano, meses);
  const kpi2 = calcKPIs(group2, ano, meses);
  const chartData = getComparisonChartData(group1, group2, label1, label2, ano, meses);

  const margem = kpi1.total - kpi2.total;
  const margemPct = kpi1.total > 0 ? (margem / kpi1.total) * 100 : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Comparação {label1} vs {label2} — {ano}
      </p>

      <GlobalFilters />

      {/* Comparison KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-value-card border border-value-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label1}</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(kpi1.total)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            YoY: <span className={cn(kpi1.yoy >= 0 ? "text-emerald-400" : "text-red-400")}>{formatPercent(kpi1.yoy)}</span>
          </p>
        </div>

        <div className="bg-value-card border border-value-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label2}</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(kpi2.total)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            YoY: <span className={cn(kpi2.yoy >= 0 ? "text-emerald-400" : "text-red-400")}>{formatPercent(kpi2.yoy)}</span>
          </p>
        </div>

        <div className="bg-value-card border border-value-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Margem</p>
          <p className={cn("text-2xl font-bold", margem >= 0 ? "text-emerald-400" : "text-red-400")}>
            {formatCurrency(margem)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {margemPct.toFixed(1)}% da {label1.toLowerCase()}
          </p>
        </div>
      </div>

      <ComparisonChart
        data={chartData}
        label1={label1}
        label2={label2}
        color1={color1}
        color2={color2}
      />

      {/* Summary table */}
      <div className="bg-value-card border border-value-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-value-border">
          <h3 className="text-sm font-medium text-muted-foreground">Resumo por Mês</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-value-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Mês</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: color1 }}>{label1}</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: color2 }}>{label2}</th>
                <th className="text-right px-4 py-3 text-xs text-yellow-400 font-medium">Margem</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Margem %</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => {
                const v1 = row[label1] as number;
                const v2 = row[label2] as number;
                const m = v1 - v2;
                const mPct = v1 > 0 ? (m / v1) * 100 : 0;
                return (
                  <tr key={i} className="border-b border-value-border/50 hover:bg-value-sidebar/30">
                    <td className="px-4 py-2.5 text-gray-300">{row.mes}</td>
                    <td className="px-4 py-2.5 text-right text-gray-300">{formatCurrency(v1)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-300">{formatCurrency(v2)}</td>
                    <td className={cn("px-4 py-2.5 text-right font-medium", m >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {formatCurrency(m)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">{mPct.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
