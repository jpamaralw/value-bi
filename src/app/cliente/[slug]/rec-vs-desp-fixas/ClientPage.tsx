"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ComparisonPage from "@/components/ComparisonPage";
import { ClienteData } from "@/lib/types";

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  return (
    <DashboardLayout clienteData={clienteData}>
      <ComparisonPage
        title="Receitas vs Despesas Fixas"
        group1={Object.values(clienteData.receitas)[0]}
        group2={Object.values(clienteData.despesas_fixas)[0]}
        label1="Receita"
        label2="Despesa Fixa"
        color1="#1D9E75"
        color2="#f59e0b"
      />
    </DashboardLayout>
  );
}
