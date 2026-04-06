"use client";

import DashboardLayout from "@/components/DashboardLayout";
import GlobalFilters from "@/components/GlobalFilters";
import { useFilters } from "@/contexts/FilterContext";
import { useCliente } from "@/contexts/ClientContext";
import { formatCurrency, sumArray } from "@/lib/financial";
import { ClienteData } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#1D9E75", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];
const MESES_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

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

function CentrosCustoContent() {
  const cliente = useCliente();
  const { ano, getMesesFiltrados } = useFilters();
  const meses = getMesesFiltrados();
  const centros = cliente.centros_de_custo;

  const pieData = Object.entries(centros).map(([name, values], i) => {
    const anoData = (values as Record<string, number[]>)[String(ano)] || [];
    return {
      name: name.replace(/^CC\d+\s/, ""),
      value: sumArray(anoData, meses),
      color: COLORS[i % COLORS.length],
    };
  });

  const grandTotal = pieData.reduce((s, d) => s + d.value, 0);

  const barData = meses.map((m) => {
    const row: Record<string, string | number> = { mes: MESES_LABELS[m] };
    Object.entries(centros).forEach(([name, values]) => {
      const anoData = (values as Record<string, number[]>)[String(ano)] || [];
      row[name.replace(/^CC\d+\s/, "")] = anoData[m] || 0;
    });
    return row;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Centros de Custo</h2>
      <p className="text-muted-foreground text-sm mb-6">Distribuição de custos por centro — {ano}</p>

      <GlobalFilters />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {pieData.map((cc, i) => (
          <div key={i} className="bg-value-card border border-value-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cc.color }} />
              <p className="text-xs text-muted-foreground">{cc.name}</p>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(cc.value)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {grandTotal > 0 ? ((cc.value / grandTotal) * 100).toFixed(1) : 0}%
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-value-card border border-value-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição por Centro</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value"
                label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                {pieData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-value-card border border-value-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Evolução Mensal por Centro</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {pieData.map((cc, i) => (<Bar key={i} dataKey={cc.name} stackId="a" fill={cc.color} />))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-value-card border border-value-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-value-border">
          <h3 className="text-sm font-medium text-muted-foreground">Tabela Cruzada: Departamentos x Meses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-value-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium sticky left-0 bg-value-card z-10">Centro de Custo</th>
                {meses.map((m) => (
                  <th key={m} className="text-right px-3 py-3 text-xs text-muted-foreground font-medium">{MESES_LABELS[m]}</th>
                ))}
                <th className="text-right px-4 py-3 text-xs text-value-green font-medium">Total</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(centros).map(([name, values], i) => {
                const anoData = (values as Record<string, number[]>)[String(ano)] || [];
                const total = sumArray(anoData, meses);
                return (
                  <tr key={name} className="border-b border-value-border/50 hover:bg-value-sidebar/30">
                    <td className="px-4 py-2.5 text-gray-300 sticky left-0 bg-value-card z-10">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        {name}
                      </span>
                    </td>
                    {meses.map((m) => (
                      <td key={m} className="px-3 py-2.5 text-right text-xs text-gray-400">{formatCurrency(anoData[m] || 0)}</td>
                    ))}
                    <td className="px-4 py-2.5 text-right text-sm font-medium text-white">{formatCurrency(total)}</td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                      {grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-value-green/5 font-medium">
                <td className="px-4 py-2.5 text-value-green sticky left-0 bg-value-green/5 z-10">Total Geral</td>
                {meses.map((m) => {
                  let monthTotal = 0;
                  Object.values(centros).forEach((values) => {
                    const anoData = (values as Record<string, number[]>)[String(ano)] || [];
                    monthTotal += anoData[m] || 0;
                  });
                  return (<td key={m} className="px-3 py-2.5 text-right text-xs text-value-green">{formatCurrency(monthTotal)}</td>);
                })}
                <td className="px-4 py-2.5 text-right text-sm font-bold text-value-green">{formatCurrency(grandTotal)}</td>
                <td className="px-4 py-2.5 text-right text-xs text-value-green">100%</td>
              </tr>
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
      <CentrosCustoContent />
    </DashboardLayout>
  );
}
