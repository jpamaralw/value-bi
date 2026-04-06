"use client";

import DashboardLayout from "@/components/DashboardLayout";
import AnalysisPage from "@/components/AnalysisPage";
import { ClienteData } from "@/lib/types";

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  const group = Object.values(clienteData.despesas_fixas)[0];
  return (
    <DashboardLayout clienteData={clienteData}>
      <AnalysisPage title="Despesas Fixas" label="Despesa Fixa" categoryGroup={group} />
    </DashboardLayout>
  );
}
