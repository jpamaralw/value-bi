"use client";

import { FilterProvider } from "@/contexts/FilterContext";
import { ClientProvider, useCliente } from "@/contexts/ClientContext";
import Sidebar from "./Sidebar";
import { ClienteData } from "@/lib/types";

function InnerLayout({ children }: { children: React.ReactNode }) {
  const cliente = useCliente();
  return (
    <div className="flex min-h-screen bg-value-bg">
      <Sidebar clienteSlug={cliente.slug} clienteNome={cliente.empresa} />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
  clienteData,
}: {
  children: React.ReactNode;
  clienteData: ClienteData;
}) {
  return (
    <ClientProvider data={clienteData}>
      <FilterProvider>
        <InnerLayout>{children}</InnerLayout>
      </FilterProvider>
    </ClientProvider>
  );
}
