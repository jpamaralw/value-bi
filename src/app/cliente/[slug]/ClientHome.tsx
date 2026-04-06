"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { ClienteData } from "@/lib/types";
import { BarChart3, TrendingUp, Wallet, PiggyBank, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { path: "/receitas", label: "Receitas", icon: TrendingUp, color: "#1D9E75" },
  { path: "/custos-variaveis", label: "Custos Variáveis", icon: BarChart3, color: "#ef4444" },
  { path: "/despesas-fixas", label: "Despesas Fixas", icon: Wallet, color: "#f59e0b" },
  { path: "/investimentos", label: "Investimentos", icon: PiggyBank, color: "#3b82f6" },
  { path: "/saldo-vs-ger-caixa", label: "Saldo vs Ger. de Caixa", icon: ArrowLeftRight, color: "#8b5cf6" },
];

export default function ClientHome({ clienteData }: { clienteData: ClienteData }) {
  const base = `/cliente/${clienteData.slug}`;

  return (
    <DashboardLayout clienteData={clienteData}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-value-green rounded-2xl flex items-center justify-center font-bold text-white text-4xl mx-auto mb-6 shadow-lg shadow-value-green/30">
            {clienteData.empresa.charAt(0)}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{clienteData.empresa}</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Business Intelligence Financeiro
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-4xl">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                href={`${base}${link.path}`}
                className="bg-value-card border border-value-border rounded-xl p-5 hover:border-value-green/50 transition-all group text-center"
              >
                <Icon className="w-8 h-8 mx-auto mb-3 transition-colors" style={{ color: link.color }} />
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {link.label}
                </p>
              </Link>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-12">
          Selecione uma análise no menu lateral para começar
        </p>
      </div>
    </DashboardLayout>
  );
}
