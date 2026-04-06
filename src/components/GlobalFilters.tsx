"use client";

import { useFilters, TipoAnalise } from "@/contexts/FilterContext";
import { cn } from "@/lib/utils";

const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const trimestres = [
  { value: 1, label: "1 Tri" },
  { value: 2, label: "2 Tri" },
  { value: 3, label: "3 Tri" },
  { value: 4, label: "4 Tri" },
];
const tiposAnalise: { value: TipoAnalise; label: string }[] = [
  { value: "anual", label: "Anual" },
  { value: "trimestral", label: "Trimestral" },
  { value: "mensal", label: "Mensal" },
  { value: "mes_a_mes", label: "Mês a Mês" },
];

function FilterButton({
  active,
  onClick,
  children,
  size = "md",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md font-medium transition-all",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        active
          ? "bg-value-green text-white shadow-lg shadow-value-green/25"
          : "bg-value-card text-muted-foreground hover:bg-value-border hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export default function GlobalFilters() {
  const { ano, trimestre, mes, tipoAnalise, setAno, setTrimestre, setMes, setTipoAnalise } = useFilters();

  return (
    <div className="bg-value-sidebar border border-value-border rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-6">
        {/* Ano */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ano</span>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="bg-value-card border border-value-border text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-value-green"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        {/* Trimestre */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Trimestre</span>
          <div className="flex gap-1">
            {trimestres.map((t) => (
              <FilterButton
                key={t.value}
                active={trimestre === t.value}
                onClick={() => setTrimestre(trimestre === t.value ? null : t.value)}
                size="sm"
              >
                {t.label}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Mês */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Mês</span>
          <div className="flex gap-1 flex-wrap">
            {mesesLabels.map((m, i) => (
              <FilterButton
                key={i}
                active={mes === i}
                onClick={() => setMes(mes === i ? null : i)}
                size="sm"
              >
                {m}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Tipo de Análise */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Análise</span>
          <div className="flex gap-1">
            {tiposAnalise.map((t) => (
              <FilterButton
                key={t.value}
                active={tipoAnalise === t.value}
                onClick={() => setTipoAnalise(t.value)}
              >
                {t.label}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
