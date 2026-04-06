import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const CLIENTES_DIR = path.join(process.cwd(), "src/data/clientes");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSheet(
  workbook: XLSX.WorkBook,
  sheetName: string
): Record<string, Record<string, number[]>> | null {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return null;

  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (rows.length < 2) return null;

  // Expected format:
  // Row 0: Header — Categoria | Jan | Fev | Mar | ... | Dez
  // Row 1+: Category name | value1 | value2 | ... | value12
  // A blank row or "Previsto" prefix means predicted values
  // Year rows: a row starting with "2024" or "2025" sets the current year context

  const result: Record<string, Record<string, number[]>> = {};
  let currentYear = "2025";

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row[0]) continue;

    const label = String(row[0]).trim();

    // Check for year markers
    if (/^(20\d{2})$/.test(label)) {
      currentYear = label;
      continue;
    }

    // Check for "Previsto" prefix
    let yearKey = currentYear;
    let catName = label;
    if (label.toLowerCase().startsWith("previsto")) {
      yearKey = "previsto_2025";
      catName = label.replace(/^previsto\s*/i, "").trim();
    }

    // Extract 12 monthly values
    const values: number[] = [];
    for (let c = 1; c <= 12; c++) {
      const val = row[c];
      values.push(typeof val === "number" ? val : parseFloat(val) || 0);
    }

    if (!result[catName]) {
      result[catName] = {};
    }
    result[catName][yearKey] = values;
  }

  return result;
}

function buildPlanoDeContas(data: any): any[] {
  const contas: any[] = [];
  const sections = [
    { key: "receitas", codigo: "3.0", desc: "Receita", tipo: "Receita" },
    { key: "custos_variaveis", codigo: "4.0", desc: "Custos Variáveis", tipo: "Custo" },
    { key: "despesas_fixas", codigo: "5.0", desc: "Despesas Fixas", tipo: "Despesa" },
    { key: "investimentos", codigo: "6.0", desc: "Investimentos", tipo: "Investimento" },
    { key: "entradas_nao_operacionais", codigo: "7.0", desc: "Entradas Não Operacionais", tipo: "Entrada" },
    { key: "saidas_nao_operacionais", codigo: "8.0", desc: "Saídas Não Operacionais", tipo: "Saída" },
  ];

  sections.forEach((sec) => {
    contas.push({ codigo: sec.codigo, descricao: sec.desc, tipo: sec.tipo, nivel: 1 });
    const group = data[sec.key];
    if (group) {
      const firstGroup = Object.values(group)[0] as any;
      if (firstGroup) {
        Object.keys(firstGroup).forEach((catName, i) => {
          contas.push({
            codigo: `${sec.codigo.replace(".0", "")}.${i + 1}`,
            descricao: catName,
            tipo: sec.tipo,
            nivel: 2,
            pai: sec.codigo,
          });
        });
      }
    }
  });

  return contas;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Try to get empresa name from a "Config" or "Info" sheet, or use filename
    let empresa = file.name.replace(/\.xlsx?$/i, "").replace(/[-_]/g, " ");
    const configSheet = workbook.Sheets["Config"] || workbook.Sheets["Info"];
    if (configSheet) {
      const configData: any[][] = XLSX.utils.sheet_to_json(configSheet, { header: 1 });
      const nameRow = configData.find((r) => String(r[0]).toLowerCase().includes("empresa"));
      if (nameRow && nameRow[1]) empresa = String(nameRow[1]).trim();
    }

    const slug = slugify(empresa);

    // Parse each sheet
    const receitas = parseSheet(workbook, "Receitas");
    const custos = parseSheet(workbook, "Custos");
    const despesas = parseSheet(workbook, "Despesas");
    const investimentos = parseSheet(workbook, "Investimentos");
    const entradas = parseSheet(workbook, "Entradas");
    const saidas = parseSheet(workbook, "Saidas") || parseSheet(workbook, "Saídas");
    const centrosSheet = parseSheet(workbook, "Centros de Custo") || parseSheet(workbook, "CentrosCusto");

    // Detect years from data
    const allYears = new Set<number>();
    [receitas, custos, despesas, investimentos, entradas, saidas].forEach((group) => {
      if (!group) return;
      Object.values(group).forEach((cat) => {
        Object.keys(cat).forEach((key) => {
          const y = parseInt(key);
          if (!isNaN(y) && y >= 2000 && y <= 2100) allYears.add(y);
        });
      });
    });
    const anos = Array.from(allYears).sort();
    if (anos.length === 0) anos.push(2025);

    const clienteData: any = {
      empresa,
      slug,
      anos,
      receitas: receitas ? { "Receita": receitas } : { "Receita": {} },
      custos_variaveis: custos ? { "Custos Variáveis": custos } : { "Custos Variáveis": {} },
      despesas_fixas: despesas ? { "Despesas Fixas": despesas } : { "Despesas Fixas": {} },
      investimentos: investimentos ? { "Investimentos": investimentos } : { "Investimentos": {} },
      entradas_nao_operacionais: entradas ? { "Entradas Não Operacionais": entradas } : { "Entradas Não Operacionais": {} },
      saidas_nao_operacionais: saidas ? { "Saídas Não Operacionais": saidas } : { "Saídas Não Operacionais": {} },
      centros_de_custo: centrosSheet || {},
      plano_de_contas: [] as any[],
      meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    };

    clienteData.plano_de_contas = buildPlanoDeContas(clienteData);

    // Save client JSON
    fs.mkdirSync(CLIENTES_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(CLIENTES_DIR, `${slug}.json`),
      JSON.stringify(clienteData, null, 2)
    );

    // Update index
    const indexPath = path.join(CLIENTES_DIR, "index.json");
    let index: any[] = [];
    if (fs.existsSync(indexPath)) {
      index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    }
    const existing = index.findIndex((c: any) => c.slug === slug);
    if (existing >= 0) {
      index[existing] = { empresa, slug };
    } else {
      index.push({ empresa, slug });
    }
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    return NextResponse.json({ success: true, empresa, slug });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar arquivo" },
      { status: 500 }
    );
  }
}
