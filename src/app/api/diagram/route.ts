import sharp from "sharp";
import { getEngineById } from "@/data/engines";
import { findKnowledgeEntries } from "@/data/knowledge-base";

export const runtime = "nodejs";

function normalizeManualText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/•/g, " - ")
    .replace(/→/g, " -> ")
    .replace(/°/g, " deg")
    .replace(/[ª]/g, "a")
    .replace(/[º]/g, "o")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function escapeXml(value: string) {
  return normalizeManualText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(value: string, maxChars = 34) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 4);
}

function renderWrappedLines({
  lines,
  x,
  startY,
  color,
  size = 20,
  weight = 500,
  maxChars = 34,
  gap = 12,
}: {
  lines: string[];
  x: number;
  startY: number;
  color: string;
  size?: number;
  weight?: number;
  maxChars?: number;
  gap?: number;
}) {
  let cursorY = startY;
  let output = "";

  for (const item of lines) {
    const wrapped = wrapText(item, maxChars);
    wrapped.forEach((line, index) => {
      output += `<text x="${x}" y="${cursorY + index * (size + 6)}" fill="${color}" font-size="${size}" font-family="DejaVu Sans, sans-serif" font-style="normal" font-weight="${weight}">${escapeXml(line)}</text>`;
    });
    cursorY += wrapped.length * (size + 6) + gap;
  }

  return output;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const brand = searchParams.get("brand") || "Motor";
  const model = searchParams.get("model") || "Esquema técnico";
  const engine = searchParams.get("engine") || "Diesel";
  const download = searchParams.get("download") === "1";
  const aiMode = searchParams.get("mode") === "ai";

  const matched = getEngineById(id);
  const knowledge = findKnowledgeEntries(brand, engine);
  const primaryKnowledge = knowledge[0];
  const isGearbox = primaryKnowledge?.category === "gearbox";

  const checklist = (matched?.checklist || [
    "Validar bronzinas e folgas antes do fechamento final",
    "Aplicar sequência do cabeçote do centro para fora",
    "Sincronizar comando e virabrequim com PMS travado",
    "Conferir injeção, reaperto e vazamentos",
  ]).slice(0, 4);

  const torqueSpecs = (primaryKnowledge?.torqueHighlights?.length
    ? primaryKnowledge.torqueHighlights.slice(0, 4).map((line, index) => {
        const [component, ...rest] = line.split(":");
        return {
          component: component || `Etapa ${index + 1}`,
          sequence: isGearbox ? "Especificação" : "Torque e etapa",
          value: rest.join(":").trim() || line,
        };
      })
    : matched?.torqueSpecs || [
        { component: "Cabeçote", sequence: "1ª, 2ª e angular", value: "80 Nm → 160 Nm → 90°" },
        { component: "Mancais", sequence: "Sequência linear", value: "Pré-carga controlada" },
        { component: "Bielas", sequence: "Par graduado", value: "60 Nm → 120 Nm → 90°" },
      ]).slice(0, 4);

  const noteLines = (primaryKnowledge?.mountingTips?.length
    ? primaryKnowledge.mountingTips
    : matched?.notes || [
        "Usar óleo limpo nas roscas e substituir parafusos com aperto angular.",
        "Conferir planicidade e altura nominal do cabeçote antes da junta.",
        "Executar reaperto e sincronismo somente com referências travadas.",
      ]).slice(0, 4);

  const measureLines = (primaryKnowledge?.measurements?.length
    ? primaryKnowledge.measurements
    : [
        "Verificar altura do cabeçote e planicidade máxima permitida.",
        "Medir projeção do pistão no PMS para escolha correta da junta.",
        "Conferir diferença máxima entre cilindros com relógio comparador.",
        "Registrar todas as medições antes do fechamento final.",
      ]).slice(0, 4);

  const regulationLines = (primaryKnowledge?.valveSpecs?.length ? primaryKnowledge.valveSpecs : checklist).slice(0, 4);

  const referenceLines = (primaryKnowledge?.partCodes?.length
    ? primaryKnowledge.partCodes
    : [
        `Aplicação: ${matched?.application || "linha diesel pesada"}`,
        `Família: ${matched?.family || "diesel pesado"}`,
        `Anos: ${matched?.years || "referência técnica"}`,
      ]).slice(0, 4);

  const title = `${aiMode ? "GUIA TECNICO GERADO POR IA" : "GUIA TECNICO DE MONTAGEM E TORQUES"} - ${brand} ${model}`.toUpperCase();

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1500" viewBox="0 0 2200 1500" role="img" aria-label="Manual tecnico em JPG">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#d97706" />
      </marker>
    </defs>

    <rect width="2200" height="1500" rx="22" fill="#efefea" />
    <text x="60" y="78" fill="#111827" font-size="56" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(title)}</text>
    <text x="60" y="116" fill="#334155" font-size="24" font-family="DejaVu Sans, sans-serif" font-weight="500">${escapeXml(engine.toUpperCase())} - PADRAO VISUAL DE MANUAL TECNICO - PORTUGUES BRASIL</text>

    <rect x="40" y="150" width="920" height="480" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="40" y="150" width="920" height="54" rx="18" fill="#bdebf0" />
    <text x="65" y="187" fill="#111827" font-size="28" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "CONJUNTO PRINCIPAL E EIXOS" : "BLOCO E PARTE INFERIOR")}</text>
    <text x="70" y="245" fill="#111827" font-size="18" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "EIXO PILOTO / EIXO PRINCIPAL" : "BRONZINAS DE MANCAL E VIRABREQUIM")}</text>

    <g transform="translate(85,270)">
      <rect x="0" y="130" width="650" height="150" rx="12" fill="#98a5aa" />
      <rect x="80" y="40" width="460" height="115" rx="20" fill="#dbe4ea" />
      <circle cx="130" cy="100" r="34" fill="#334155" />
      <circle cx="240" cy="100" r="34" fill="#334155" />
      <circle cx="350" cy="100" r="34" fill="#334155" />
      <circle cx="460" cy="100" r="34" fill="#334155" />
      <circle cx="570" cy="100" r="34" fill="#334155" />
      <line x1="130" y1="5" x2="130" y2="52" stroke="#c2410c" stroke-width="4" marker-end="url(#arrow)" />
      <line x1="240" y1="5" x2="240" y2="52" stroke="#c2410c" stroke-width="4" marker-end="url(#arrow)" />
      <line x1="350" y1="5" x2="350" y2="52" stroke="#c2410c" stroke-width="4" marker-end="url(#arrow)" />
      <line x1="460" y1="5" x2="460" y2="52" stroke="#c2410c" stroke-width="4" marker-end="url(#arrow)" />
      <line x1="570" y1="5" x2="570" y2="52" stroke="#c2410c" stroke-width="4" marker-end="url(#arrow)" />
      <circle cx="130" cy="0" r="18" fill="#f59e0b" /><text x="124" y="6" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="600">1</text>
      <circle cx="240" cy="0" r="18" fill="#f59e0b" /><text x="234" y="6" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="600">2</text>
      <circle cx="350" cy="0" r="18" fill="#f59e0b" /><text x="344" y="6" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="600">3</text>
      <circle cx="460" cy="0" r="18" fill="#f59e0b" /><text x="454" y="6" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="600">4</text>
      <circle cx="570" cy="0" r="18" fill="#f59e0b" /><text x="564" y="6" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="600">5</text>
    </g>

    <rect x="740" y="285" width="190" height="215" rx="12" fill="#fff7ed" stroke="#d6d3d1" stroke-width="2" />
    <text x="760" y="318" fill="#111827" font-size="18" font-family="DejaVu Sans, sans-serif" font-weight="700">SEQUENCIA</text>
    <text x="760" y="348" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="500">DO CENTRO PARA FORA</text>
    ${renderWrappedLines({ lines: torqueSpecs.map((item, index) => `${index + 1}ª etapa: ${item.value}`), x: 760, startY: 390, color: "#7c2d12", size: 16, weight: 700, maxChars: 20, gap: 10 })}

    <rect x="980" y="150" width="540" height="250" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="980" y="150" width="540" height="54" rx="18" fill="#bdebf0" />
    <text x="1005" y="187" fill="#111827" font-size="28" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "REGULAGEM E FOLGAS" : "MONTAGEM SUPERIOR")}</text>
    <text x="1010" y="240" fill="#111827" font-size="18" font-family="DejaVu Sans, sans-serif" font-weight="700">PARA FUSOS / PONTO DE APERTO</text>
    <g transform="translate(1010,255)">
      ${Array.from({ length: 12 }).map((_, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const cx = 30 + col * 110 + (row % 2 ? 18 : 0);
        const cy = 26 + row * 48;
        return `<circle cx="${cx}" cy="${cy}" r="18" fill="#f4a261" stroke="#374151" stroke-width="2" />
                <text x="${cx - 7}" y="${cy + 6}" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="600">${index + 1}</text>`;
      }).join("")}
    </g>
    <text x="1085" y="378" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="500">PADRAO CARACOL / APERTO ESCALONADO</text>

    <rect x="980" y="425" width="540" height="395" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="980" y="425" width="540" height="54" rx="18" fill="#bdebf0" />
    <text x="1005" y="462" fill="#111827" font-size="28" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "SINCRONISMO E AJUSTE FINAL" : "SINCRONISMO E REGULAGEM")}</text>
    <text x="1015" y="520" fill="#111827" font-size="18" font-family="DejaVu Sans, sans-serif" font-weight="700">SINCRONISMO DO COMANDO</text>
    <g transform="translate(1035,540)">
      <circle cx="90" cy="80" r="68" fill="#d1d5db" stroke="#374151" stroke-width="7" />
      <circle cx="270" cy="80" r="68" fill="#d1d5db" stroke="#374151" stroke-width="7" />
      <circle cx="180" cy="218" r="52" fill="#94a3b8" stroke="#374151" stroke-width="7" />
      <path d="M90 12 L270 12 L222 216 L138 216 Z" fill="none" stroke="#0f766e" stroke-width="9" />
    </g>
    ${renderWrappedLines({ lines: regulationLines, x: 1240, startY: 560, color: "#1f2937", size: 17, weight: 700, maxChars: 23, gap: 12 })}

    <rect x="1545" y="150" width="615" height="670" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="1545" y="150" width="615" height="54" rx="18" fill="#bdebf0" />
    <text x="1570" y="187" fill="#111827" font-size="28" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "ESPECIFICACOES ADICIONAIS" : "ESPECIFICACOES DO CABECOTE")}</text>
    <g transform="translate(1620,250)">
      <rect x="95" y="10" width="125" height="85" rx="8" fill="#b9c7cf" stroke="#374151" stroke-width="3" />
      <path d="M85 95 L230 95 L280 165 L35 165 Z" fill="#dbe4ea" stroke="#374151" stroke-width="3" />
      <rect x="115" y="165" width="90" height="120" rx="8" fill="#f4a261" opacity="0.75" />
      <rect x="90" y="285" width="140" height="160" rx="6" fill="#c7d2da" stroke="#374151" stroke-width="3" />
      <circle cx="160" cy="338" r="18" fill="#94a3b8" stroke="#374151" stroke-width="3" />
      <line x1="280" y1="52" x2="355" y2="52" stroke="#b45309" stroke-width="3" />
      <line x1="280" y1="165" x2="355" y2="165" stroke="#b45309" stroke-width="3" />
      <line x1="332" y1="52" x2="332" y2="165" stroke="#b45309" stroke-width="3" />
      <text x="368" y="72" fill="#111827" font-size="18" font-family="DejaVu Sans, sans-serif" font-weight="700">ALTURA</text>
      <text x="368" y="96" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="500">NOMINAL</text>
      <text x="368" y="188" fill="#374151" font-size="17" font-family="DejaVu Sans, sans-serif" font-weight="500">PLAINICIDADE</text>
    </g>
    ${renderWrappedLines({ lines: measureLines, x: 1575, startY: 610, color: "#7c2d12", size: 16, weight: 700, maxChars: 30, gap: 10 })}

    <rect x="40" y="655" width="920" height="305" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="40" y="655" width="920" height="54" rx="18" fill="#bdebf0" />
    <text x="65" y="692" fill="#111827" font-size="28" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "FIXACAO E FECHAMENTO" : "BIELAS E TORQUES")}</text>
    <g transform="translate(70,735)">
      <circle cx="85" cy="145" r="48" fill="none" stroke="#374151" stroke-width="12" />
      <rect x="118" y="30" width="82" height="165" rx="18" transform="rotate(25 159 110)" fill="#d8dee6" stroke="#374151" stroke-width="4" />
      <circle cx="216" cy="45" r="28" fill="none" stroke="#374151" stroke-width="10" />
      <text x="270" y="55" fill="#111827" font-size="18" font-family="DejaVu Sans, sans-serif" font-weight="700">APERTO EM ESTAGIOS</text>
      ${renderWrappedLines({ lines: torqueSpecs.map((item) => `${item.component}: ${item.value}`), x: 270, startY: 95, color: "#1f2937", size: 18, weight: 700, maxChars: 38, gap: 8 })}
    </g>

    <rect x="1545" y="845" width="615" height="115" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="1545" y="845" width="615" height="46" rx="18" fill="#bdebf0" />
    <text x="1570" y="877" fill="#111827" font-size="28" font-family="DejaVu Sans, sans-serif" font-weight="700">${escapeXml(isGearbox ? "VERIFICACAO FINAL" : "REGULAGEM FINAL")}</text>
    ${renderWrappedLines({ lines: noteLines, x: 1575, startY: 920, color: "#1f2937", size: 15, weight: 700, maxChars: 36, gap: 7 })}

    <rect x="40" y="988" width="2120" height="360" rx="18" fill="#0b2d3b" />
    <text x="70" y="1038" fill="#f8fafc" font-size="30" font-family="DejaVu Sans, sans-serif" font-weight="700">RESUMO DA IA E REFERENCIAS TECNICAS</text>
    ${renderWrappedLines({ lines: [
      `Família: ${matched?.family || (isGearbox ? "transmissão pesada" : "diesel pesado")}`,
      `Aplicação: ${matched?.application || primaryKnowledge?.summary || "consulta técnica assistida"}`,
      `Anos de referência: ${matched?.years || "base técnica consolidada"}`,
      referenceLines[0] || "Consulta cruzada em bases públicas e internas.",
      aiMode ? "Modo IA ativo com síntese técnica e linguagem de oficina." : "Modo catálogo técnico com estrutura pronta para consulta rápida.",
    ], x: 80, startY: 1085, color: "#dbeafe", size: 20, weight: 700, maxChars: 100, gap: 12 })}

    <rect x="40" y="1370" width="2120" height="70" rx="14" fill="#facc15" opacity="0.22" />
    <text x="70" y="1415" fill="#111827" font-size="24" font-family="DejaVu Sans, sans-serif" font-weight="700">DICA: USE OLEO LIMPO NAS ROSCAS, CONFIRA REFERENCIAS DE PMS E SUBSTITUA FIXADORES COM APERTO ANGULAR SEMPRE QUE NECESSARIO.</text>
  </svg>`;

  const imageBuffer = await sharp(Buffer.from(svg, "utf8"))
    .jpeg({ quality: 97, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(imageBuffer), {
    headers: {
      "Content-Type": "image/jpeg",
      ...(download ? { "Content-Disposition": `attachment; filename="esquema-${brand}-${engine}.jpg"` } : {}),
    },
  });
}
