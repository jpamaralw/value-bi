"use client";

import DashboardLayout from "@/components/DashboardLayout";
import AnalysisPage from "@/components/AnalysisPage";
import { ClienteData } from "@/lib/types";

export default function ReceitasClient({ clienteData }: { clienteData: ClienteData }) {
  const group = Object.values(clienteData.receitas)[0];
  return (
    <DashboardLayout clienteData={clienteData}>
      <AnalysisPage title="Receitas" label="Receita" categoryGroup={group} />
    </DashboardLayout>
  );
}
