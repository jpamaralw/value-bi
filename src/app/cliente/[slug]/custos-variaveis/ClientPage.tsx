"use client";

import DashboardLayout from "@/components/DashboardLayout";
import AnalysisPage from "@/components/AnalysisPage";
import { ClienteData } from "@/lib/types";

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  const group = Object.values(clienteData.custos_variaveis)[0];
  return (
    <DashboardLayout clienteData={clienteData}>
      <AnalysisPage title="Custos Variáveis" label="Custo Variável" categoryGroup={group} />
    </DashboardLayout>
  );
}
