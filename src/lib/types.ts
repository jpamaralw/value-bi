export interface CategoryEntry {
  [key: string]: number[];
}

export interface CategoryData {
  [key: string]: CategoryEntry;
}

export interface CategoryGroup {
  [groupName: string]: CategoryData;
}

export interface CentroCustoData {
  [name: string]: {
    [year: string]: number[];
  };
}

export interface ContaItem {
  codigo: string;
  descricao: string;
  tipo: string;
  nivel: number;
  pai?: string;
}

export interface ClienteData {
  empresa: string;
  slug: string;
  anos: number[];
  receitas: CategoryGroup;
  custos_variaveis: CategoryGroup;
  despesas_fixas: CategoryGroup;
  investimentos: CategoryGroup;
  entradas_nao_operacionais: CategoryGroup;
  saidas_nao_operacionais: CategoryGroup;
  centros_de_custo: CentroCustoData;
  plano_de_contas: ContaItem[];
  meses: string[];
}

export interface ClienteMeta {
  empresa: string;
  slug: string;
}
