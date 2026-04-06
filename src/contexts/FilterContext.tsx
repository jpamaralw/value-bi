"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TipoAnalise = "anual" | "trimestral" | "mensal" | "mes_a_mes";

interface FilterState {
  ano: number;
  trimestre: number | null;
  mes: number | null;
  tipoAnalise: TipoAnalise;
}

interface FilterContextType extends FilterState {
  setAno: (ano: number) => void;
  setTrimestre: (tri: number | null) => void;
  setMes: (mes: number | null) => void;
  setTipoAnalise: (tipo: TipoAnalise) => void;
  getMesesFiltrados: () => number[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [ano, setAno] = useState(2025);
  const [trimestre, setTrimestre] = useState<number | null>(null);
  const [mes, setMes] = useState<number | null>(null);
  const [tipoAnalise, setTipoAnalise] = useState<TipoAnalise>("anual");

  const getMesesFiltrados = (): number[] => {
    if (mes !== null) return [mes];
    if (trimestre !== null) {
      const start = (trimestre - 1) * 3;
      return [start, start + 1, start + 2];
    }
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  };

  return (
    <FilterContext.Provider
      value={{
        ano,
        trimestre,
        mes,
        tipoAnalise,
        setAno,
        setTrimestre: (tri) => {
          setTrimestre(tri);
          if (tri !== null) setMes(null);
        },
        setMes: (m) => {
          setMes(m);
          if (m !== null) setTrimestre(null);
        },
        setTipoAnalise,
        getMesesFiltrados,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be inside FilterProvider");
  return ctx;
}
