import { CategoryData } from "@/lib/types";

const MESES_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export type { CategoryData };

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function sumArray(arr: number[], indices?: number[]): number {
  if (!indices) return arr.reduce((a, b) => a + b, 0);
  return indices.reduce((sum, i) => sum + (arr[i] || 0), 0);
}

export function avgArray(arr: number[], indices?: number[]): number {
  const subset = indices ? indices.map((i) => arr[i] || 0) : arr;
  return subset.reduce((a, b) => a + b, 0) / subset.length;
}

export function calcYoY(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calcAV(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calcAH(current: number, base: number): number {
  if (base === 0) return 0;
  return ((current - base) / base) * 100;
}

export interface KPIData {
  total: number;
  mediaMensal: number;
  py: number;
  yoy: number;
  mmYoY: number;
}

export function calcKPIs(
  categoryGroup: CategoryData,
  ano: number,
  meses: number[]
): KPIData {
  let totalAtual = 0;
  let totalPY = 0;

  Object.values(categoryGroup).forEach((cat) => {
    const currentData = cat[String(ano)];
    const pyData = cat[String(ano - 1)];
    if (currentData) totalAtual += sumArray(currentData, meses);
    if (pyData) totalPY += sumArray(pyData, meses);
  });

  const mediaMensal = totalAtual / (meses.length || 1);
  const yoy = calcYoY(totalAtual, totalPY);

  let mmYoYSum = 0;
  let mmCount = 0;
  meses.forEach((m) => {
    let curMonth = 0;
    let pyMonth = 0;
    Object.values(categoryGroup).forEach((cat) => {
      const currentData = cat[String(ano)];
      const pyData = cat[String(ano - 1)];
      if (currentData) curMonth += currentData[m] || 0;
      if (pyData) pyMonth += pyData[m] || 0;
    });
    if (pyMonth > 0) {
      mmYoYSum += calcYoY(curMonth, pyMonth);
      mmCount++;
    }
  });

  return {
    total: totalAtual,
    mediaMensal,
    py: totalPY,
    yoy,
    mmYoY: mmCount > 0 ? mmYoYSum / mmCount : 0,
  };
}

export function getChartData(
  categoryGroup: CategoryData,
  ano: number,
  meses: number[]
): { mes: string; atual: number; previsto: number; anterior: number }[] {
  return meses.map((m) => {
    let atual = 0;
    let previsto = 0;
    let anterior = 0;

    Object.values(categoryGroup).forEach((cat) => {
      const currentData = cat[String(ano)];
      const pyData = cat[String(ano - 1)];
      const previstoData = cat["previsto_2025"];
      if (currentData) atual += currentData[m] || 0;
      if (pyData) anterior += pyData[m] || 0;
      if (previstoData) previsto += previstoData[m] || 0;
    });

    return {
      mes: MESES_LABELS[m],
      atual,
      previsto,
      anterior,
    };
  });
}

export interface TableRow {
  categoria: string;
  isParent: boolean;
  meses: {
    valor: number;
    av: number;
    ah: number;
    yoy: number;
  }[];
  total: number;
  totalAV: number;
  totalAH: number;
  totalYoY: number;
}

export function getTableData(
  categoryGroup: CategoryData,
  ano: number,
  mesesIndices: number[]
): TableRow[] {
  const rows: TableRow[] = [];

  let grandTotal = 0;
  Object.values(categoryGroup).forEach((cat) => {
    const d = cat[String(ano)];
    if (d) grandTotal += sumArray(d, mesesIndices);
  });

  const parentMeses = mesesIndices.map((m) => {
    let valor = 0;
    let pyValor = 0;
    let baseValor = 0;
    Object.values(categoryGroup).forEach((cat) => {
      const d = cat[String(ano)];
      const py = cat[String(ano - 1)];
      if (d) valor += d[m] || 0;
      if (py) pyValor += py[m] || 0;
    });
    Object.values(categoryGroup).forEach((cat) => {
      const d = cat[String(ano)];
      if (d) baseValor += d[mesesIndices[0]] || 0;
    });
    return {
      valor,
      av: calcAV(valor, grandTotal / mesesIndices.length),
      ah: calcAH(valor, baseValor),
      yoy: calcYoY(valor, pyValor),
    };
  });

  const parentTotal = parentMeses.reduce((s, m) => s + m.valor, 0);
  let pyTotal = 0;
  Object.values(categoryGroup).forEach((cat) => {
    const py = cat[String(ano - 1)];
    if (py) pyTotal += sumArray(py, mesesIndices);
  });

  rows.push({
    categoria: "Total",
    isParent: true,
    meses: parentMeses,
    total: parentTotal,
    totalAV: 100,
    totalAH: 0,
    totalYoY: calcYoY(parentTotal, pyTotal),
  });

  Object.entries(categoryGroup).forEach(([name, cat]) => {
    const currentData = cat[String(ano)];
    const pyData = cat[String(ano - 1)];
    if (!currentData) return;

    const childMeses = mesesIndices.map((m, idx) => {
      const valor = currentData[m] || 0;
      const pyValor = pyData ? pyData[m] || 0 : 0;
      const baseValor = currentData[mesesIndices[0]] || 0;
      return {
        valor,
        av: calcAV(valor, parentMeses[idx]?.valor || 1),
        ah: calcAH(valor, baseValor),
        yoy: calcYoY(valor, pyValor),
      };
    });

    const childTotal = sumArray(currentData, mesesIndices);
    const childPY = pyData ? sumArray(pyData, mesesIndices) : 0;

    rows.push({
      categoria: name,
      isParent: false,
      meses: childMeses,
      total: childTotal,
      totalAV: calcAV(childTotal, parentTotal),
      totalAH: calcAH(childTotal, sumArray(currentData, [mesesIndices[0]]) * mesesIndices.length),
      totalYoY: calcYoY(childTotal, childPY),
    });
  });

  return rows;
}

export function getComparisonChartData(
  group1: CategoryData,
  group2: CategoryData,
  label1: string,
  label2: string,
  ano: number,
  meses: number[]
): { mes: string; [key: string]: number | string }[] {
  return meses.map((m) => {
    let val1 = 0;
    let val2 = 0;

    Object.values(group1).forEach((cat) => {
      const d = cat[String(ano)];
      if (d) val1 += d[m] || 0;
    });
    Object.values(group2).forEach((cat) => {
      const d = cat[String(ano)];
      if (d) val2 += d[m] || 0;
    });

    return {
      mes: MESES_LABELS[m],
      [label1]: val1,
      [label2]: val2,
      margem: val1 - val2,
    };
  });
}
