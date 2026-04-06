"use client";

import React from "react";
import { TableRow, formatCurrency } from "@/lib/financial";
import { cn } from "@/lib/utils";

const MESES_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

interface FinancialTableProps {
  rows: TableRow[];
  mesesIndices: number[];
  title: string;
}

function PercentCell({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "text-xs",
        value > 0 ? "text-emerald-400" : value < 0 ? "text-red-400" : "text-gray-500"
      )}
    >
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

export default function FinancialTable({ rows, mesesIndices, title }: FinancialTableProps) {
  return (
    <div className="bg-value-card border border-value-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-value-border">
        <h3 className="text-sm font-medium text-muted-foreground">{title} — Detalhamento</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-value-border">
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium sticky left-0 bg-value-card z-10 min-w-[180px]">
                Categoria
              </th>
              {mesesIndices.map((m) => (
                <th
                  key={m}
                  colSpan={4}
                  className="text-center px-1 py-3 text-xs text-muted-foreground font-medium border-l border-value-border"
                >
                  {MESES_LABELS[m]}
                </th>
              ))}
              <th
                colSpan={4}
                className="text-center px-1 py-3 text-xs text-value-green font-medium border-l border-value-border"
              >
                Total
              </th>
            </tr>
            <tr className="border-b border-value-border bg-value-sidebar/50">
              <th className="sticky left-0 bg-value-sidebar/50 z-10"></th>
              {[...mesesIndices, -1].map((_, idx) => (
                <React.Fragment key={`sub-${idx}`}>
                  <th className="px-2 py-2 text-[10px] text-muted-foreground font-normal border-l border-value-border">
                    Valor
                  </th>
                  <th className="px-2 py-2 text-[10px] text-muted-foreground font-normal">AV%</th>
                  <th className="px-2 py-2 text-[10px] text-muted-foreground font-normal">AH%</th>
                  <th className="px-2 py-2 text-[10px] text-muted-foreground font-normal">YoY%</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-value-border/50 hover:bg-value-sidebar/30 transition-colors",
                  row.isParent && "bg-value-green/5 font-medium"
                )}
              >
                <td
                  className={cn(
                    "px-4 py-2.5 text-sm sticky left-0 z-10",
                    row.isParent
                      ? "bg-value-green/5 text-value-green font-medium"
                      : "bg-value-card pl-8 text-gray-300"
                  )}
                >
                  {row.categoria}
                </td>
                {row.meses.map((m, j) => (
                  <React.Fragment key={j}>
                    <td className="px-2 py-2.5 text-right text-xs text-gray-300 border-l border-value-border/50 whitespace-nowrap">
                      {formatCurrency(m.valor)}
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <PercentCell value={m.av} />
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <PercentCell value={m.ah} />
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <PercentCell value={m.yoy} />
                    </td>
                  </React.Fragment>
                ))}
                {/* Total columns */}
                <td className="px-2 py-2.5 text-right text-xs font-medium text-white border-l border-value-border whitespace-nowrap">
                  {formatCurrency(row.total)}
                </td>
                <td className="px-2 py-2.5 text-right">
                  <PercentCell value={row.totalAV} />
                </td>
                <td className="px-2 py-2.5 text-right">
                  <PercentCell value={row.totalAH} />
                </td>
                <td className="px-2 py-2.5 text-right">
                  <PercentCell value={row.totalYoY} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
