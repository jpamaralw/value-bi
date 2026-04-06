"use client";

import { useFilters } from "@/contexts/FilterContext";
import GlobalFilters from "./GlobalFilters";
import KPICards from "./KPICards";
import FinancialChart from "./FinancialChart";
import FinancialTable from "./FinancialTable";
import {
  CategoryData,
  calcKPIs,
  getChartData,
  getTableData,
} from "@/lib/financial";

interface AnalysisPageProps {
  title: string;
  label: string;
  categoryGroup: CategoryData;
}

export default function AnalysisPage({ title, label, categoryGroup }: AnalysisPageProps) {
  const { ano, getMesesFiltrados } = useFilters();
  const meses = getMesesFiltrados();

  const kpis = calcKPIs(categoryGroup, ano, meses);
  const chartData = getChartData(categoryGroup, ano, meses);
  const tableRows = getTableData(categoryGroup, ano, meses);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Análise de {label.toLowerCase()} — {ano}
      </p>

      <GlobalFilters />
      <KPICards data={kpis} label={label} />
      <FinancialChart data={chartData} label={label} />
      <FinancialTable rows={tableRows} mesesIndices={meses} title={label} />
    </div>
  );
}
