"use client";

import { KPIData, formatCurrency, formatPercent } from "@/lib/financial";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  data: KPIData;
  label: string;
}

function KPIBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const isPositive = value > 0;
  const isNeutral = Math.abs(value) < 0.1;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        isNeutral
          ? "bg-gray-500/20 text-gray-400"
          : isPositive
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-red-500/20 text-red-400"
      )}
    >
      <Icon className="w-3 h-3" />
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

export default function KPICards({ data, label }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total */}
      <div className="bg-value-card border border-value-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label} Total</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(data.total)}</p>
      </div>

      {/* Média Mensal */}
      <div className="bg-value-card border border-value-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Média Mensal</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(data.mediaMensal)}</p>
      </div>

      {/* Ano Anterior (PY) */}
      <div className="bg-value-card border border-value-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ano Anterior (PY)</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(data.py)}</p>
      </div>

      {/* YoY */}
      <div className="bg-value-card border border-value-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">YoY</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl font-bold text-white">{formatPercent(data.yoy)}</p>
          <KPIBadge value={data.yoy} />
        </div>
      </div>

      {/* MM YoY */}
      <div className="bg-value-card border border-value-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">MM YoY</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl font-bold text-white">{formatPercent(data.mmYoY)}</p>
          <KPIBadge value={data.mmYoY} />
        </div>
      </div>
    </div>
  );
}
