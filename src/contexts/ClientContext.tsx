"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { ClienteData } from "@/lib/types";

interface ClientContextType {
  cliente: ClienteData;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: ClienteData;
}) {
  return (
    <ClientContext.Provider value={{ cliente: data }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useCliente() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useCliente must be inside ClientProvider");
  return ctx.cliente;
}
