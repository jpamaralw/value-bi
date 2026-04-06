"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ComparisonPage from "@/components/ComparisonPage";
import { ClienteData } from "@/lib/types";

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  return (
    <DashboardLayout clienteData={clienteData}>
      <ComparisonPage
        title="Receitas vs Investimentos"
        group1={Object.values(clienteData.receitas)[0]}
        group2={Object.values(clienteData.investimentos)[0]}
        label1="Receita"
        label2="Investimento"
        color1="#1D9E75"
        color2="#3b82f6"
      />
    </DashboardLayout>
  );
}
