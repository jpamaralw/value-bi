"use client";

import DashboardLayout from "@/components/DashboardLayout";
import GlobalFilters from "@/components/GlobalFilters";
import { useFilters } from "@/contexts/FilterContext";
import { useCliente } from "@/contexts/ClientContext";
import { formatCurrency } from "@/lib/financial";
import { ClienteData } from "@/lib/types";
import { cn } from "@/lib/utils";
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

const MESES_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function getTotals(group: Record<string, Record<string, number[]>>, ano: number, mesIdx: number): number {
  let total = 0;
  Object.values(group).forEach((cat) => {
    const d = (cat as Record<string, number[]>)[String(ano)];
    if (d) total += d[mesIdx] || 0;
  });
  return total;
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

function SaldoContent() {
  const cliente = useCliente();
  const { ano, getMesesFiltrados } = useFilters();
  const meses = getMesesFiltrados();

  const receitas = Object.values(cliente.receitas)[0];
  const custos = Object.values(cliente.custos_variaveis)[0];
  const despesas = Object.values(cliente.despesas_fixas)[0];
  const investimentos = Object.values(cliente.investimentos)[0];
  const entradas = Object.values(cliente.entradas_nao_operacionais)[0];
  const saidas = Object.values(cliente.saidas_nao_operacionais)[0];

  let saldoAcumulado = 0;
  const chartData = meses.map((m) => {
    const rec = getTotals(receitas, ano, m);
    const cst = getTotals(custos, ano, m);
    const desp = getTotals(despesas, ano, m);
    const inv = getTotals(investimentos, ano, m);
    const ent = getTotals(entradas, ano, m);
    const sai = getTotals(saidas, ano, m);

    const totalEntradas = rec + ent;
    const totalSaidas = cst + desp + inv + sai;
    const saldo = totalEntradas - totalSaidas;
    const gerCaixa = rec - cst - desp;
    saldoAcumulado += saldo;

    return {
      mes: MESES_LABELS[m],
      "Total Entradas": totalEntradas,
      "Total Saídas": totalSaidas,
      Saldo: saldo,
      "Saldo Acumulado": saldoAcumulado,
      "Geração de Caixa": gerCaixa,
    };
  });

  const totalEntradas = chartData.reduce((s, d) => s + d["Total Entradas"], 0);
  const totalSaidas = chartData.reduce((s, d) => s + d["Total Saídas"], 0);
  const totalSaldo = chartData.reduce((s, d) => s + d.Saldo, 0);
  const totalGerCaixa = chartData.reduce((s, d) => s + d["Geração de Caixa"], 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Saldo vs Geração de Caixa</h2>
      <p className="text-muted-foreground text-sm mb-6">Visão consolidada do fluxo financeiro — {ano}</p>

      <GlobalFilters />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-value-card border border-value-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Entradas</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalEntradas)}</p>
        </div>
        <div className="bg-value-card border border-value-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Saídas</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalSaidas)}</p>
        </div>
        <div className="bg-value-card border border-value-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Saldo</p>
          <p className={cn("text-2xl font-bold", totalSaldo >= 0 ? "text-emerald-400" : "text-red-400")}>
            {formatCurrency(totalSaldo)}
          </p>
        </div>
        <div className="bg-value-card border border-value-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Geração de Caixa</p>
          <p className={cn("text-2xl font-bold", totalGerCaixa >= 0 ? "text-value-green" : "text-red-400")}>
            {formatCurrency(totalGerCaixa)}
          </p>
        </div>
      </div>

      <div className="bg-value-card border border-value-border rounded-xl p-5 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Barras Empilhadas + Saldo Acumulado</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="Total Entradas" stackId="stack" fill="#1D9E75" radius={[0, 0, 0, 0]} opacity={0.8} />
            <Bar dataKey="Total Saídas" stackId="stack" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Line type="monotone" dataKey="Saldo Acumulado" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Geração de Caixa" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-value-card border border-value-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-value-border">
          <h3 className="text-sm font-medium text-muted-foreground">Detalhamento Mensal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-value-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Mês</th>
                <th className="text-right px-4 py-3 text-xs text-emerald-400 font-medium">Entradas</th>
                <th className="text-right px-4 py-3 text-xs text-red-400 font-medium">Saídas</th>
                <th className="text-right px-4 py-3 text-xs text-yellow-400 font-medium">Saldo</th>
                <th className="text-right px-4 py-3 text-xs text-yellow-500 font-medium">Acumulado</th>
                <th className="text-right px-4 py-3 text-xs text-purple-400 font-medium">Ger. Caixa</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => (
                <tr key={i} className="border-b border-value-border/50 hover:bg-value-sidebar/30">
                  <td className="px-4 py-2.5 text-gray-300">{row.mes}</td>
                  <td className="px-4 py-2.5 text-right text-gray-300">{formatCurrency(row["Total Entradas"])}</td>
                  <td className="px-4 py-2.5 text-right text-gray-300">{formatCurrency(row["Total Saídas"])}</td>
                  <td className={cn("px-4 py-2.5 text-right font-medium", row.Saldo >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {formatCurrency(row.Saldo)}
                  </td>
                  <td className={cn("px-4 py-2.5 text-right font-medium", row["Saldo Acumulado"] >= 0 ? "text-yellow-400" : "text-red-400")}>
                    {formatCurrency(row["Saldo Acumulado"])}
                  </td>
                  <td className={cn("px-4 py-2.5 text-right font-medium", row["Geração de Caixa"] >= 0 ? "text-purple-400" : "text-red-400")}>
                    {formatCurrency(row["Geração de Caixa"])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  return (
    <DashboardLayout clienteData={clienteData}>
      <SaldoContent />
    </DashboardLayout>
  );
}
