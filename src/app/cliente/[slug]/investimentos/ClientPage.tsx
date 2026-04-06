"use client";

import DashboardLayout from "@/components/DashboardLayout";
import AnalysisPage from "@/components/AnalysisPage";
import { ClienteData } from "@/lib/types";

export default function ClientPage({ clienteData }: { clienteData: ClienteData }) {
  const group = Object.values(clienteData.investimentos)[0];
  return (
    <DashboardLayout clienteData={clienteData}>
      <AnalysisPage title="Investimentos" label="Investimento" categoryGroup={group} />
    </DashboardLayout>
  );
}
