"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useCliente } from "@/contexts/ClientContext";
import { ClienteData } from "@/lib/types";
import { formatCurrency } from "@/lib/financial";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, FolderOpen } from "lucide-react";

const tipoColors: Record<string, string> = {
  Receita: "text-emerald-400 bg-emerald-400/10",
  Custo: "text-red-400 bg-red-400/10",
  Despesa: "text-yellow-400 bg-yellow-400/10",
  Investimento: "text-blue-400 bg-blue-400/10",
  Entrada: "text-purple-400 bg-purple-400/10",
  "Saída": "text-orange-400 bg-orange-400/10",
};

function getGroupTotal(cliente: any, codigo: string, ano: number): number {
  const groupMap: Record<string, string> = {
    "3.0": "receitas",
    "4.0": "custos_variaveis",
    "5.0": "despesas_fixas",
    "6.0": "investimentos",
    "7.0": "entradas_nao_operacionais",
    "8.0": "saidas_nao_operacionais",
  };

  const section = groupMap[codigo];
  if (!section || !cliente[section]) return 0;

  let total = 0;
  const groups = Object.values(cliente[section]) as any[];
  groups.forEach((group: any) => {
    Object.values(group).forEach((cat: any) => {
      const data = cat[String(ano)];
      if (data && Array.isArray(data)) {
        total += data.reduce((a: number, b: number) => a + b, 0);
      }
    });
  });
  return total;
}

function getSubcatTotal(cliente: any, parentCodigo: string, subcatName: string, ano: number): number {
  const groupMap: Record<string, string> = {
    "3.0": "receitas",
    "4.0": "custos_variaveis",
    "5.0": "despesas_fixas",
    "6.0": "investimentos",
    "7.0": "entradas_nao_operacionais",
    "8.0": "saidas_nao_operacionais",
  };

  const section = groupMap[parentCodigo];
  if (!section || !cliente[section]) return 0;

  let total = 0;
  const groups = Object.values(cliente[section]) as any[];
  groups.forEach((group: any) => {
    Object.entries(group).forEach(([name, cat]: [string, any]) => {
      if (name.toLowerCase().includes(subcatName.toLowerCase())) {
        const data = cat[String(ano)];
        if (data && Array.isArray(data)) {
          total += data.reduce((a: number, b: number) => a + b, 0);
        }
      }
    });
  });
  return total;
}

function PlanoContent() {
  const cliente = useCliente();
  const contas = cliente.plano_de_contas;
  const ano = cliente.anos[cliente.anos.length - 1] || 2025;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Plano de Contas</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Estrutura hierárquica com totalizadores — {ano}
      </p>

      <div className="bg-value-card border border-value-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-value-border flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Plano de Contas</h3>
          <span className="text-xs text-muted-foreground">{contas.length} contas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-value-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium w-24">Código</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Descrição</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium w-32">Tipo</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium w-20">Nível</th>
                <th className="text-right px-4 py-3 text-xs text-value-green font-medium w-40">Total {ano}</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta, i) => {
                const total = conta.nivel === 1
                  ? getGroupTotal(cliente, conta.codigo, ano)
                  : getSubcatTotal(cliente, conta.pai || "", conta.descricao, ano);

                return (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-value-border/50 hover:bg-value-sidebar/30 transition-colors",
                      conta.nivel === 1 && "bg-value-green/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <span className={cn("font-mono text-sm font-medium", conta.nivel === 1 ? "text-value-green" : "text-gray-400")}>
                        {conta.codigo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {conta.nivel === 2 && <ChevronRight className="w-3 h-3 text-gray-600 ml-4" />}
                        {conta.nivel === 1
                          ? <FolderOpen className="w-4 h-4 text-value-green" />
                          : <FileText className="w-4 h-4 text-gray-500" />
                        }
                        <span className={cn(conta.nivel === 1 ? "text-white font-medium" : "text-gray-300")}>
                          {conta.descricao}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", tipoColors[conta.tipo] || "text-gray-400 bg-gray-400/10")}>
                        {conta.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                        conta.nivel === 1 ? "bg-value-green/20 text-value-green" : "bg-value-border text-gray-400"
                      )}>
                        {conta.nivel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn("font-mono text-sm", conta.nivel === 1 ? "text-value-green font-bold" : "text-gray-400")}>
                        {total > 0 ? formatCurrency(total) : "—"}
                      </span>
                    </td>
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

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  return (
    <DashboardLayout clienteData={clienteData}>
      <PlanoContent />
    </DashboardLayout>
  );
}
