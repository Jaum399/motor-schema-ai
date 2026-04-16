export type KnowledgeEntry = {
  id: string;
  brand: string;
  engine: string;
  title: string;
  category: "engine" | "gearbox";
  aliases: string[];
  summary: string;
  torqueHighlights: string[];
  measurements: string[];
  valveSpecs: string[];
  mountingTips: string[];
  partCodes: string[];
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "iveco-cursor-13",
    brand: "Iveco",
    engine: "Cursor 13 380",
    title: "Iveco Cursor 13 380 - montagem completa, cabeçote e biela fraturada",
    category: "engine",
    aliases: ["iveco 380", "cursor 13", "f3b 380", "iveco cursor"],
    summary: "Motor pesado com foco em aperto de mancal, biela fraturada, projeção do pistão, sincronismo, regulagem de válvulas e unidades injetoras.",
    torqueHighlights: [
      "Mancais: 80 Nm + 160 Nm + 90°",
      "Bielas: 60 Nm + 120 Nm + 90°",
      "Cabeçote: 60 Nm + 120 Nm + 90° + 90°",
      "Volante: 120 Nm + 90°",
    ],
    measurements: [
      "Projeção do pistão: 0,28 mm a 0,52 mm",
      "Altura nominal do cabeçote: 130,00 mm + 0,05 mm",
      "Planicidade do cabeçote: menor que 0,05 mm",
      "Junta do cabeçote: 1,30 mm a 1,40 mm conforme projeção",
    ],
    valveSpecs: [
      "Folga a frio: admissão 0,40 mm / escape 0,60 mm",
      "Ordem de ignição: 1 - 4 - 2 - 6 - 3 - 5",
      "Injetores PDA: soltar 180° e travar conforme revisão",
      "Sincronismo com 1º cilindro em PMS e ponto 0°",
    ],
    mountingTips: [
      "Usar óleo limpo nas roscas e substituir parafusos de aperto angular",
      "Biela fraturada exige encaixe perfeito e orientação correta",
      "Conferir folga entre engrenagens de 0,07 a 0,22 mm",
      "Dar duas voltas manuais no virabrequim antes da partida",
    ],
    partCodes: [
      "Biela do tipo fraturada com marcação de orientação",
      "Parafuso máximo do cabeçote: 205,00 mm",
      "Regulagem de injetor com contraporca controlada",
    ],
  },
  {
    id: "scania-dc12-420",
    brand: "Scania",
    engine: "DC12 420",
    title: "Scania 124 420 - biela, camisas e cabeçote",
    category: "engine",
    aliases: ["scania 420", "dc12", "124 420", "scania 124"],
    summary: "Motor de linha pesada com foco em biela, alturas de camisa, cabeçote e unidades injetoras.",
    torqueHighlights: [
      "Bielas: 20 Nm + 60 Nm + 90°",
      "Mancais principais: 50 Nm + 150 Nm + 90°",
      "Cabeçote: 60 Nm + 150 Nm + 250 Nm + 90°",
      "Volante: 130 Nm + 90°",
    ],
    measurements: [
      "Projeção da camisa: 0,20 mm a 0,30 mm",
      "Diferença máxima na mesma camisa: 0,02 mm",
      "Diferença máxima entre camisas adjacentes: 0,02 mm",
      "Válvulas a frio: admissão 0,40 mm / escape 0,40 mm",
    ],
    valveSpecs: [
      "Ordem de ignição: 1 - 5 - 3 - 6 - 2 - 4",
      "Usar método de balanço para regulagem",
      "Regular com motor frio e lâmina justa",
    ],
    mountingTips: [
      "Lubrificar roscas e face de apoio do parafuso com óleo de motor",
      "Garantir números da biela e da capa voltados para o mesmo lado",
      "Limpar alojamento das camisas para não alterar a altura",
    ],
    partCodes: [],
  },
  {
    id: "mwm-x10-6c",
    brand: "MWM",
    engine: "X10 6 cilindros",
    title: "MWM X10 6 cilindros - regulagem de válvulas",
    category: "engine",
    aliases: ["mwm x10", "x10 6 cilindros", "x10"],
    summary: "Conjunto com regulagem por balanço e folga de válvulas uniforme para admissão e escape.",
    torqueHighlights: [
      "Consultar revisão específica para biela e cabeçote por aplicação",
      "Foco principal do histórico: regulagem de válvulas",
    ],
    measurements: [
      "Folga a frio: admissão 0,40 mm",
      "Folga a frio: escape 0,40 mm",
    ],
    valveSpecs: [
      "Ordem de ignição: 1 - 5 - 3 - 6 - 2 - 4",
      "6 em balanço regula 1",
      "2 em balanço regula 5; 4 regula 3; 1 regula 6; 5 regula 2; 3 regula 4",
    ],
    mountingTips: [
      "Marcar balancins já regulados para evitar erro",
      "Inspecionar desgaste e borra com a tampa aberta",
      "A lâmina deve passar com leve resistência",
    ],
    partCodes: [],
  },
  {
    id: "scania-v8",
    brand: "Scania",
    engine: "V8",
    title: "Scania V8 - histórico técnico de montagem",
    category: "engine",
    aliases: ["scania v8", "v8 scania"],
    summary: "Base técnica preparada para esquemas de motores V8 da linha Scania com foco em fechamento e sincronismo.",
    torqueHighlights: [
      "Aplicar sequência cruzada nos dois bancos do V",
      "Mancais e cabeçotes devem usar aperto angular controlado",
      "Confirmar torques conforme série DSC ou DC16 da aplicação",
    ],
    measurements: [
      "Validar projeção de pistão e altura do cabeçote em ambos os bancos",
      "Controlar diferença entre bancadas e sincronismo entre eixos",
    ],
    valveSpecs: [
      "Regular válvulas conforme série DSC/DC16 da aplicação",
      "Executar sincronismo com o cilindro mestre em PMS",
    ],
    mountingTips: [
      "Identificar corretamente os bancos do V",
      "Executar sincronismo com ferramentas de trava",
      "Conferir numeração das capas e alinhamento dos comandos",
    ],
    partCodes: [],
  },
  {
    id: "cummins-serie-x",
    brand: "Cummins",
    engine: "Série X",
    title: "Cummins Série X - linha pesada",
    category: "engine",
    aliases: ["cummins serie x", "cummins x", "x15", "isx"],
    summary: "Família de motores pesados com aperto multiestágio e grande atenção aos sistemas de válvulas e injeção.",
    torqueHighlights: [
      "Cabeçote e mancais devem seguir boletim técnico por série",
      "Aperto angular e reaperto controlado são críticos",
      "Bielas da série X exigem conferência do alongamento dos parafusos",
    ],
    measurements: [
      "Folgas e projeções dependem do submodelo X15/ISX",
      "Conferir altura de camisa, assentamento e compressão por cilindro",
    ],
    valveSpecs: [
      "Regular conforme ordem de ignição e revisão do comando",
      "Ajustar unidades injetoras conforme revisão eletrônica e mecânica",
    ],
    mountingTips: [
      "Conferir EGR, lubrificação e assentamento das camisas",
      "Aplicar o boletim técnico correto para a série X encontrada",
    ],
    partCodes: [],
  },
  {
    id: "cummins-6taa-6304",
    brand: "Cummins",
    engine: "6TAA 6.304",
    title: "Cummins 6TAA 6.304 - cabeça, biela, camisa e válvulas",
    category: "engine",
    aliases: ["6taa6304", "6taa 6.304", "cummins 6304", "série b"],
    summary: "Motor seis cilindros em linha com sequência de cabeçote em caracol e regulagem de válvulas em duas etapas.",
    torqueHighlights: [
      "Cabeçote: 70 Nm + 105 Nm + 90°",
      "Bielas: 35 Nm + 70 Nm + 60°",
      "Mancais principais: 60 Nm + 115 Nm + 90°",
      "Volante: 137 Nm",
    ],
    measurements: [
      "Projeção do pistão: 0,40 mm a 0,65 mm",
      "Limite máximo do pistão: 0,66 mm",
      "Saliência da camisa: 0,03 mm a 0,12 mm",
      "Diferença entre camisas adjacentes: máximo 0,05 mm",
    ],
    valveSpecs: [
      "Folga a frio: admissão 0,25 mm / escape 0,50 mm",
      "PMS 1 regula: 1 adm/esc, 2 adm, 3 esc, 4 adm, 5 esc",
      "PMS 6 regula: 2 esc, 3 adm, 4 esc, 5 adm, 6 adm/esc",
    ],
    mountingTips: [
      "Limpar furos do bloco e instalar junta com TOP para cima",
      "Usar relógio comparador na medição de pistão e camisa",
      "Marcar a cabeça dos parafusos no aperto angular final",
    ],
    partCodes: [],
  },
  {
    id: "mercedes-om352",
    brand: "Mercedes-Benz",
    engine: "OM352",
    title: "Mercedes OM352 - esquema de regulagem de válvulas",
    category: "engine",
    aliases: ["om352", "mercedes 352", "1113", "om 352"],
    summary: "Layout de regulagem de válvulas com foco em motor frio, balanço em cruz, folgas de admissão e escape e procedimento visual de oficina.",
    torqueHighlights: [
      "Admissão: 0,20 mm",
      "Escape: 0,30 mm",
      "Ordem de regulagem: 1 - 5 - 3 - 6 - 2 - 4",
      "Condição: motor frio",
    ],
    measurements: [
      "Motor frio para toda a conferência",
      "Lâmina com leve resistência na medição",
      "Conferir folga após reaperto da porca de regulagem",
      "Executar duas voltas manuais e revisar os pontos críticos",
    ],
    valveSpecs: [
      "Folga a frio: admissão 0,20 mm",
      "Folga a frio: escape 0,30 mm",
      "6 em balanço regula 1; 2 regula 5; 4 regula 3",
      "1 em balanço regula 6; 5 regula 2; 3 regula 4",
    ],
    mountingTips: [
      "Girar o motor no sentido correto de rotação até o cilindro indicado entrar em balanço",
      "Ajustar primeiro admissão e depois escape no cilindro correspondente",
      "Fechar a tampa somente após a conferência completa do jogo de válvulas",
    ],
    partCodes: [
      "Procedimento: balanço em cruz",
      "Leitura rápida para oficina diesel",
    ],
  },
  {
    id: "mercedes-om457",
    brand: "Mercedes-Benz",
    engine: "OM457",
    title: "Mercedes OM457 - cabeçote, sincronismo e fechamento de linha pesada",
    category: "engine",
    aliases: ["om457", "om 457", "om457la", "457 mercedes"],
    summary: "Motor de linha pesada com foco em cabeçote, sequência cruzada, altura, sincronismo e fechamento final em padrão de oficina diesel.",
    torqueHighlights: [
      "Cabeçote: aperto cruzado em etapas e ângulo",
      "Bielas: pré-torque com conferência final por revisão",
      "Mancais: centro para fora com controle de pré-carga",
      "Volante: torque com trava química e reaperto controlado",
    ],
    measurements: [
      "Conferir planicidade do cabeçote e altura nominal antes do fechamento",
      "Medir projeção do pistão no PMS para definir junta correta",
      "Verificar folga das válvulas com motor frio após montagem",
      "Executar duas voltas manuais e revisar alinhamento final",
    ],
    valveSpecs: [
      "Regular válvulas com referência travada e motor frio",
      "Executar sincronismo entre comando e virabrequim no PMS",
      "Confirmar fechamento da tampa e ausência de interferência mecânica",
      "Revisar admissão, escape e assento dos balancins",
    ],
    mountingTips: [
      "Lubrificar roscas e faces de apoio antes do aperto angular",
      "Aplicar sequência do centro para fora em cabeçote e mancais",
      "Checar alinhamento dos tuchos e posição do comando antes da partida",
      "Registrar medições críticas no padrão de oficina",
    ],
    partCodes: [
      "Layout sugerido: manual de linha pesada com cabeçote e sincronismo",
      "Foco visual: tuchos, balancins, engrenagens e parafusos estruturais",
    ],
  },
  {
    id: "volvo-d13",
    brand: "Volvo",
    engine: "D13",
    title: "Volvo D13 - esquema de montagem, sincronismo e vedação",
    category: "engine",
    aliases: ["d13", "d13c", "d13k", "fh 540", "volvo fh"],
    summary: "Motor moderno com foco em cabeçote, camisas, trem de engrenagens, vedação e conferência fina do sincronismo.",
    torqueHighlights: [
      "Cabeçote: aperto em estágios com sequência do centro para fora",
      "Mancais: pré-torque progressivo e conferência angular",
      "Injetores: torque controlado para evitar fuga e desalinhamento",
      "Periféricos: fechamento final após revisão de vedação",
    ],
    measurements: [
      "Validar altura de camisa e projeção do pistão antes da junta",
      "Conferir planicidade do cabeçote e alinhamento do conjunto",
      "Revisar folgas do trem de válvulas com motor frio",
      "Controlar sincronismo entre engrenagens principais e comando",
    ],
    valveSpecs: [
      "Ajustar conforme referência da série D13 e ponto de PMS",
      "Executar conferência de balancins e comando após duas voltas manuais",
      "Revisar turbo, admissão e escape antes da liberação final",
      "Confirmar ausência de toque mecânico em toda a volta",
    ],
    mountingTips: [
      "Usar lubrificação limpa nos elementos de aperto e vedação",
      "Fechar cabeçote com sequência escalonada uniforme",
      "Checar pontos de vazamento na linha de óleo e água",
      "Finalizar com teste a frio e inspeção visual completa",
    ],
    partCodes: [
      "Layout sugerido: motor em linha moderno com turbo e engrenagens",
      "Foco visual: cabeçote, trem de válvulas, bloco e fluxo de lubrificação",
    ],
  },
  {
    id: "mercedes-g211-16",
    brand: "Mercedes-Benz",
    engine: "G211-16 Câmbio",
    title: "Câmbio Mercedes G211-16 - montagem, calços e códigos",
    category: "gearbox",
    aliases: ["g211", "g211-16", "cambio mercedes 16 marchas", "mercedes g211 16"],
    summary: "Transmissão de 16 marchas com splitter e range, exigindo medição de folgas, calços e sincronizadores.",
    torqueHighlights: [
      "Carcaça central M12: 80 a 95 Nm",
      "Tampa traseira GP: 50 Nm + 45°",
      "Bujão dreno/enchimento: 60 Nm",
      "Porca da tulipa: 600 Nm com trava química",
    ],
    measurements: [
      "Folga axial constante K2: 0,02 mm a 0,08 mm",
      "Pré-carga de rolamentos novos: 0,00 mm a 0,15 mm",
      "Interlock total: 0,20 mm a 0,40 mm",
      "Folga mínima do sincronizador: superior a 0,3 mm",
    ],
    valveSpecs: [],
    mountingTips: [
      "Lubrificar rolamentos de agulha e planetárias na montagem",
      "A luva do splitter tem lado e deve respeitar a ranhura interna",
      "Ao trocar rolamento cônico, medir novamente a constante K",
    ],
    partCodes: [
      "Eixo piloto: A9302620403",
      "Anel sincronizador GV: A9472601945",
      "Luva de engate splitter: A9452626523",
      "Eixo secundário: A9302620805",
      "Retentor de saída: A0209971347",
    ],
  },
];

function normalize(value?: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function findKnowledgeEntries(brand?: string, engine?: string) {
  const tokens = [brand, engine]
    .map(normalize)
    .flatMap((item) => item.split(/\s+/).filter(Boolean));

  if (!tokens.length) {
    return knowledgeBase.slice(0, 4);
  }

  return knowledgeBase
    .map((entry) => {
      const haystack = normalize([
        entry.brand,
        entry.engine,
        entry.title,
        entry.summary,
        ...entry.aliases,
        ...entry.torqueHighlights,
        ...entry.measurements,
        ...entry.valveSpecs,
        ...entry.mountingTips,
        ...entry.partCodes,
      ].join(" "));

      const score = tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 3 : 0), 0);
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry)
    .slice(0, 3);
}
