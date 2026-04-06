"use client";

import DashboardLayout from "@/components/DashboardLayout";
import AnalysisPage from "@/components/AnalysisPage";
import { ClienteData } from "@/lib/types";

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  const group = Object.values(clienteData.entradas_nao_operacionais)[0];
  return (
    <DashboardLayout clienteData={clienteData}>
      <AnalysisPage title="Entradas Não Operacionais" label="Entrada Não Op." categoryGroup={group} />
    </DashboardLayout>
  );
}
