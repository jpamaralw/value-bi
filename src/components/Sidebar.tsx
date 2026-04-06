"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "", label: "Home", icon: Home },
  { path: "/receitas", label: "Receitas", icon: TrendingUp },
  { path: "/custos-variaveis", label: "Custos Variáveis", icon: TrendingDown },
  { path: "/rec-vs-custo-var", label: "Rec. vs Custo Var.", icon: ArrowLeftRight },
  { path: "/despesas-fixas", label: "Despesas Fixas", icon: Wallet },
  { path: "/rec-vs-desp-fixas", label: "Rec. vs Desp. Fixas", icon: ArrowLeftRight },
  { path: "/investimentos", label: "Investimentos", icon: PiggyBank },
  { path: "/rec-vs-inv", label: "Rec. vs Inv.", icon: ArrowLeftRight },
  { path: "/entradas-nao-op", label: "Entradas Não Op.", icon: ArrowDownCircle },
  { path: "/saidas-nao-op", label: "Saídas Não Op.", icon: ArrowUpCircle },
  { path: "/saldo-vs-ger-caixa", label: "Saldo vs Ger. de Caixa", icon: Scale },
  { path: "/centros-de-custo", label: "Centros de Custo", icon: Building2 },
  { path: "/plano-de-contas", label: "Plano de Contas", icon: FileText },
];

interface SidebarProps {
  clienteSlug: string;
  clienteNome: string;
}

export default function Sidebar({ clienteSlug, clienteNome }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const base = `/cliente/${clienteSlug}`;

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-value-sidebar border-r border-value-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-value-border">
        <div className="w-8 h-8 bg-value-green rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
          V
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">VALUE BI</h1>
            <p className="text-muted-foreground text-xs truncate">{clienteNome}</p>
          </div>
        )}
      </div>

      {/* Back to clients */}
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-2.5 text-xs text-muted-foreground hover:text-white border-b border-value-border transition-colors"
        title={collapsed ? "Trocar cliente" : undefined}
      >
        <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
        {!collapsed && <span>Trocar cliente</span>}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const href = `${base}${item.path}`;
          const isActive =
            pathname === href ||
            (item.path !== "" && pathname.startsWith(href));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-value-green/15 text-value-green font-medium"
                  : "text-muted-foreground hover:bg-value-card hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-value-border text-muted-foreground hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
