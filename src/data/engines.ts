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
  {
    id: "scania-dc12-420",
    brand: "Scania",
    model: "124 420",
    engineCode: "DC12 420",
    family: "Diesel pesado",
    years: "1998-2006",
    application: "Linha rodoviária Scania série 4",
    summary:
      "Motor focado em aperto de biela, altura de camisa, cabeçote e unidades PDE.",
    torqueSpecs: [
      { component: "Bielas", sequence: "3 etapas", value: "20 Nm > 60 Nm > 90°" },
      { component: "Mancais", sequence: "Progressivo", value: "50 Nm > 150 Nm > 90°" },
      { component: "Cabeçote", sequence: "Caracol", value: "60 Nm > 150 Nm > 250 Nm > 90°" },
      { component: "PDE", sequence: "Ajuste final", value: "20 Nm > 75°" },
    ],
    notes: [
      "Projetar camisa entre 0,20 e 0,30 mm acima do bloco.",
      "Diferença máxima entre camisas: 0,02 mm.",
      "Lubrificar roscas com óleo de motor antes do aperto.",
    ],
    checklist: [
      "Conferir lado correto da biela e da capa",
      "Medir altura das camisas com relógio comparador",
      "Aplicar sequência do cabeçote em caracol",
      "Regular PDE e verificar sincronismo",
    ],
    tags: ["scania", "dc12", "420", "124", "pde"],
  },
  {
    id: "mwm-x10-6c",
    brand: "MWM",
    model: "X10",
    engineCode: "X10 6 cilindros",
    family: "Diesel médio/pesado",
    years: "2012-2025",
    application: "Caminhões, ônibus e aplicações industriais",
    summary:
      "Base técnica de válvulas do MWM X10 com regulagem por método de balanço.",
    torqueSpecs: [
      { component: "Válvulas admissão", sequence: "Motor frio", value: "0,40 mm" },
      { component: "Válvulas escape", sequence: "Motor frio", value: "0,40 mm" },
      { component: "Ordem de ignição", sequence: "Regulagem", value: "1 - 5 - 3 - 6 - 2 - 4" },
    ],
    notes: [
      "Regular pelo método de balanço, cilindro em cruzamento regula o correspondente.",
      "Marcar os balancins já ajustados para evitar erro.",
    ],
    checklist: [
      "Colocar 6º em balanço e regular 1º",
      "Seguir a tabela 2-5 / 4-3 / 1-6 / 5-2 / 3-4",
      "Conferir folga com leve resistência na lâmina",
    ],
    tags: ["mwm", "x10", "6 cilindros", "valvula"],
  },
  {
    id: "cummins-6taa-6304",
    brand: "Cummins",
    model: "6TAA 6.304",
    engineCode: "6TAA 6.304",
    family: "Diesel série B",
    years: "1998-2015",
    application: "Caminhões e máquinas",
    summary:
      "Motor Cummins com forte foco em sequência do cabeçote, projeção do pistão e saliência da camisa.",
    torqueSpecs: [
      { component: "Cabeçote", sequence: "Caracol 1 a 26", value: "70 Nm > 105 Nm > 90°" },
      { component: "Bielas", sequence: "3 etapas", value: "35 Nm > 70 Nm > 60°" },
      { component: "Mancais", sequence: "3 etapas", value: "60 Nm > 115 Nm > 90°" },
      { component: "Volante", sequence: "Direto", value: "137 Nm" },
    ],
    notes: [
      "Projeção do pistão entre 0,40 e 0,65 mm.",
      "Saliência da camisa entre 0,03 e 0,12 mm.",
      "Folga a frio: adm 0,25 mm / esc 0,50 mm.",
    ],
    checklist: [
      "Apertar cabeçote do centro para fora",
      "Marcar ângulo final de todos os parafusos",
      "Medir pistão e camisa com relógio comparador",
      "Regular válvulas em duas etapas, PMS 1 e PMS 6",
    ],
    tags: ["cummins", "6taa", "6304", "serie b"],
  },
  {
    id: "mercedes-om352",
    brand: "Mercedes-Benz",
    model: "OM352",
    engineCode: "OM352",
    family: "Diesel clássico",
    years: "1960-1990",
    application: "1113 e linha Mercedes clássica",
    summary:
      "Motor robusto com foco em seta dos pistões, ponto da distribuição e fechamento profissional do cabeçote.",
    torqueSpecs: [
      { component: "Cabeçote", sequence: "Centro para extremidades", value: "Consultar revisão do OM352" },
      { component: "Distribuição", sequence: "Marcas alinhadas", value: "Sincronismo obrigatório" },
    ],
    notes: [
      "Seta do pistão apontada para a frente do motor.",
      "Limpar galerias e bomba de óleo antes de fechar o cárter.",
    ],
    checklist: [
      "Alinhar marcas das engrenagens",
      "Conferir vedação da lubrificação",
      "Aplicar torque do cabeçote em cruz",
    ],
    tags: ["mercedes", "om352", "1113", "352"],
  },
  {
    id: "mercedes-g211-16",
    brand: "Mercedes-Benz",
    model: "G211-16",
    engineCode: "Câmbio 16 marchas",
    family: "Transmissão pesada",
    years: "2000-2025",
    application: "Câmbio Mercedes de 16 marchas com splitter e range",
    summary:
      "Transmissão com foco em calços, folga axial, sincronizadores e códigos de peças principais.",
    torqueSpecs: [
      { component: "Carcaça central M12", sequence: "Fechamento", value: "80 a 95 Nm" },
      { component: "Tampa traseira GP", sequence: "Final", value: "50 Nm + 45°" },
      { component: "Tulipa de saída", sequence: "Final", value: "600 Nm com trava química" },
    ],
    notes: [
      "Folga axial K2 entre 0,02 e 0,08 mm.",
      "Pré-carga de rolamentos novos entre 0,00 e 0,15 mm.",
      "Sincronizador deve manter folga superior a 0,3 mm.",
    ],
    checklist: [
      "Montar eixo piloto, splitter e eixo secundário em sequência",
      "Medir calços com relógio comparador",
      "Lubrificar roletes e conjunto planetário",
      "Confirmar posição dos sincronizadores e luvas",
    ],
    tags: ["g211", "g211-16", "cambio", "mercedes", "16 marchas"],
  },
  {
    id: "scania-v8",
    brand: "Scania",
    model: "V8",
    engineCode: "DC16 / DSC V8",
    family: "Diesel pesado V8",
    years: "2005-2025",
    application: "Linha Scania V8 rodoviária e fora de estrada",
    summary:
      "Motor V8 com foco em fechamento dos bancos, sincronismo dos comandos e conferência de torques estruturais.",
    torqueSpecs: [
      { component: "Cabeçotes", sequence: "Cruzado", value: "Torque angular conforme série" },
      { component: "Mancais", sequence: "Centro para fora", value: "Pré-carga progressiva" },
      { component: "Sincronismo", sequence: "Ferramentas de trava", value: "PMS e alinhamento duplo" },
    ],
    notes: [
      "Identificar corretamente os dois bancos do motor V.",
      "Conferir posição das capas e sincronismo dos comandos.",
    ],
    checklist: [
      "Separar bancadas e sequência de montagem",
      "Aplicar aperto cruzado no cabeçote",
      "Sincronizar os dois comandos",
      "Conferir vedação e reaperto final",
    ],
    tags: ["scania", "v8", "dc16", "dsc", "motor v8"],
  },
  {
    id: "cummins-serie-x",
    brand: "Cummins",
    model: "Série X",
    engineCode: "X15 / ISX",
    family: "Diesel pesado",
    years: "2010-2025",
    application: "Linha pesada de alta carga e longa distância",
    summary:
      "Família com foco em cabeçote multiestágio, bielas estruturais, sincronismo e conferência dos sistemas auxiliares.",
    torqueSpecs: [
      { component: "Cabeçote", sequence: "Multiestágio", value: "Conforme boletim técnico" },
      { component: "Bielas", sequence: "Controle de alongamento", value: "Parafusos estruturais" },
      { component: "Mancais", sequence: "Centro para extremidades", value: "Pré-torque + ângulo" },
    ],
    notes: [
      "Conferir EGR, assentamento de camisas e lubrificação.",
      "Aplicar revisão específica do submodelo X15 ou ISX.",
    ],
    checklist: [
      "Inspecionar camisas e assentos",
      "Aplicar torques conforme série X",
      "Sincronizar válvulas e injeção",
      "Testar sistema de lubrificação",
    ],
    tags: ["cummins", "serie x", "x15", "isx", "cummins x"],
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
