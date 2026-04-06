"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { ClienteData } from "@/lib/types";

export default function ClientWrapper({
  children,
  clienteData,
}: {
  children: React.ReactNode;
  clienteData: ClienteData;
}) {
  return <DashboardLayout clienteData={clienteData}>{children}</DashboardLayout>;
}
