export type SearchParams = {
  brand?: string;
  model?: string;
  engine?: string;
  chassis?: string;
};

export type TorqueSpec = {
  component: string;
  sequence: string;
  value: string;
};

export type EngineRecord = {
  id: string;
  brand: string;
  model: string;
  engineCode: string;
  family: string;
  years: string;
  application: string;
  summary: string;
  torqueSpecs: TorqueSpec[];
  notes: string[];
  checklist: string[];
  tags: string[];
};

export const engineCatalog: EngineRecord[] = [
  {
    id: "iveco-cursor-13",
    brand: "Iveco",
    model: "Cursor 13",
    engineCode: "F3B / 380",
    family: "Diesel pesado",
    years: "2008-2022",
    application: "Caminhões e aplicações rodoviárias",
    summary:
      "Motor de alto torque com foco em sincronismo, cabeçote e bronzinas. Ideal para consulta de montagem técnica pesada.",
    torqueSpecs: [
      { component: "Bronzinas de mancal", sequence: "Centro para fora", value: "80 Nm > 160 Nm > 90°" },
      { component: "Bielas", sequence: "Fraturada", value: "60 Nm > 120 Nm > 90°" },
      { component: "Cabeçote", sequence: "Espiral/caracol", value: "Aperto angular controlado" },
      { component: "Sincronismo", sequence: "1º cilindro em PMS", value: "0° com ferramenta de trava" },
    ],
    notes: [
      "Usar óleo limpo nas roscas críticas.",
      "Substituir parafusos de aperto angular.",
      "Verificar altura e planicidade do cabeçote antes da montagem final.",
    ],
    checklist: [
      "Conferir bronzinas e folga axial",
      "Aplicar sequência de torque do cabeçote",
      "Alinhar comando e virabrequim em PMS",
      "Regular injetores e reapertos finais",
    ],
    tags: ["iveco", "cursor", "cursor 13", "380", "f3b", "diesel", "cabeçote"],
  },
  {
    id: "cummins-isx",
    brand: "Cummins",
    model: "ISX 450",
    engineCode: "ISX / X15",
    family: "Diesel pesado",
    years: "2010-2024",
    application: "Cavalos mecânicos e frotas de longa distância",
    summary:
      "Conjunto robusto para linhas pesadas, com atenção especial ao comando e pré-carga de parafusos estruturais.",
    torqueSpecs: [
      { component: "Mancais", sequence: "Centro para extremidades", value: "Pré-torque progressivo + ângulo" },
      { component: "Bielas", sequence: "Etapas progressivas", value: "Torque controlado conforme revisão" },
      { component: "Cabeçote", sequence: "Espiral de dentro para fora", value: "Multiestágio" },
    ],
    notes: [
      "Validar folga das camisas e integridade do sistema EGR.",
      "Verificar atualização de revisão técnica por série.",
    ],
    checklist: [
      "Inspecionar camisas e assentos",
      "Sincronizar trem de válvulas",
      "Verificar bomba e sistema de lubrificação",
    ],
    tags: ["cummins", "isx", "x15", "450", "diesel"],
  },
  {
    id: "mercedes-om457",
    brand: "Mercedes-Benz",
    model: "OM457",
    engineCode: "OM 457 LA",
    family: "Diesel pesado",
    years: "2004-2020",
    application: "Ônibus e caminhões extrapesados",
    summary:
      "Motor conhecido pela durabilidade, exigindo atenção em junta, cabeçote e regulagem de válvulas.",
    torqueSpecs: [
      { component: "Cabeçote", sequence: "Cruzado em caracol", value: "Sequência escalonada" },
      { component: "Bielas", sequence: "Pré-carga e conferência", value: "Torque nominal conforme classe" },
      { component: "Volante", sequence: "Estrela", value: "Torque com trava química" },
    ],
    notes: [
      "Revisar planicidade após superaquecimento.",
      "Checar assentamento e folga de válvulas.",
    ],
    checklist: [
      "Conferir cabeçote e junta",
      "Ajustar válvulas e comando",
      "Fechar tampa e validar vazamentos",
    ],
    tags: ["mercedes", "om457", "la", "benz", "diesel"],
  },
  {
    id: "volvo-d13",
    brand: "Volvo",
    model: "D13",
    engineCode: "D13C / D13K",
    family: "Diesel pesado",
    years: "2011-2025",
    application: "Linha FH/FM e aplicações mistas",
    summary:
      "Plataforma moderna com grande foco em precisão de sincronismo e vedação do cabeçote.",
    torqueSpecs: [
      { component: "Cabeçote", sequence: "Centro para fora", value: "Aperto em estágios com ângulo" },
      { component: "Mancais", sequence: "Sequencial", value: "Pré-torque + conferência final" },
      { component: "Bicos/Injetores", sequence: "Uniforme", value: "Torque controlado para evitar fuga" },
    ],
    notes: [
      "Monitorar sequência de sincronismo após substituição de engrenagens.",
      "Validar vedação e reaperto onde o manual exigir.",
    ],
    checklist: [
      "Posicionar motor em PMS",
      "Fechar cabeçote e sequência angular",
      "Ajustar periféricos e teste a frio",
    ],
    tags: ["volvo", "d13", "fh", "fm", "diesel"],
  },
];

function normalizeValue(value?: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getEngineById(id?: string | null) {
  return engineCatalog.find((item) => item.id === id) || null;
}

export function searchEngineCatalog(params: SearchParams) {
  const tokens = [params.brand, params.model, params.engine, params.chassis]
    .map(normalizeValue)
    .flatMap((item) => item.split(/\s+/).filter(Boolean));

  const scored = engineCatalog
    .map((record) => {
      const haystack = normalizeValue(
        [record.brand, record.model, record.engineCode, record.family, record.application, ...record.tags].join(" ")
      );

      let score = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) {
          score += token.length > 3 ? 3 : 1;
        }
      }

      if (normalizeValue(record.brand) === normalizeValue(params.brand)) score += 4;
      if (normalizeValue(record.model).includes(normalizeValue(params.model))) score += 3;
      if (normalizeValue(record.engineCode).includes(normalizeValue(params.engine))) score += 3;

      return { record, score };
    })
    .filter((item) => (tokens.length === 0 ? true : item.score > 0))
    .sort((a, b) => b.score - a.score);

  return scored.length ? scored.map((item) => item.record).slice(0, 3) : engineCatalog.slice(0, 3);
}

export function buildSearchSuggestions(results: EngineRecord[], params: SearchParams) {
  if (results.length > 0) {
    return [
      `Revisar sequência de torque do ${results[0].model}`,
      "Baixar imagem técnica gerada",
      "Validar dados do chassi com API pública",
    ];
  }

  return [
    `Tente combinar marca e modelo, por exemplo: ${params.brand || "Iveco"} ${params.model || "Cursor 13"}`,
    "Use um chassi/VIN com 8 a 17 caracteres para enriquecer a busca",
    "Pesquise também pelo código do motor",
  ];
}

export function createAiAssemblySummary(record: EngineRecord | null, decodedVin?: Record<string, string> | null) {
  if (!record) {
    return "A IA não encontrou um esquema exato, mas já organizou sugestões e fontes públicas para ampliar a consulta.";
  }

  const vinMake = decodedVin?.Make ? ` e o fabricante decodificado foi ${decodedVin.Make}` : "";
  return `A IA sugere iniciar pela conferência do cabeçote, sincronismo e sequência de torque do ${record.brand} ${record.model}. O sistema cruzou catálogo técnico${vinMake} para montar um esquema visual pronto para consulta.`;
}
