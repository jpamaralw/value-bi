import { ClienteData, ClienteMeta } from "@/lib/types";
import fs from "fs";
import path from "path";

const CLIENTES_DIR = path.join(process.cwd(), "src/data/clientes");

export function getClientesList(): ClienteMeta[] {
  const indexPath = path.join(CLIENTES_DIR, "index.json");
  if (!fs.existsSync(indexPath)) return [];
  return JSON.parse(fs.readFileSync(indexPath, "utf8"));
}

export function getClienteData(slug: string): ClienteData | null {
  const filePath = path.join(CLIENTES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function getAllClienteSlugs(): string[] {
  return getClientesList().map((c) => c.slug);
}
