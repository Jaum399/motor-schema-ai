import sharp from "sharp";
import { getEngineById } from "@/data/engines";

export const runtime = "nodejs";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderLines(lines: string[], x: number, startY: number, color: string, size = 20, weight = 400) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * (size + 10)}" fill="${color}" font-size="${size}" font-family="Arial" font-weight="${weight}">${escapeXml(line)}</text>`
    )
    .join("");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const brand = searchParams.get("brand") || "Motor";
  const model = searchParams.get("model") || "Esquema técnico";
  const engine = searchParams.get("engine") || "Diesel";
  const download = searchParams.get("download") === "1";

  const matched = getEngineById(id);
  const checklist = (matched?.checklist || [
    "Validar bronzinas e folgas",
    "Aplicar sequência do cabeçote",
    "Sincronizar comando em PMS",
    "Conferir injeção e reaperto final",
  ]).slice(0, 4);

  const torqueSpecs = (matched?.torqueSpecs || [
    { component: "Cabeçote", sequence: "Centro para fora", value: "Aperto progressivo + angular" },
    { component: "Mancais", sequence: "Sequência linear", value: "Pré-carga controlada" },
    { component: "Bielas", sequence: "Par graduado", value: "Torque em estágios" },
  ]).slice(0, 4);

  const noteLines = (matched?.notes || [
    "Usar lubrificação limpa nas roscas críticas.",
    "Conferir planicidade e altura do cabeçote.",
    "Substituir parafusos com aperto angular.",
  ]).slice(0, 3);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200" role="img" aria-label="Esquema técnico detalhado em JPG">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#06101d" />
        <stop offset="100%" stop-color="#123d63" />
      </linearGradient>
      <linearGradient id="panelLight" x1="0" x2="1">
        <stop offset="0%" stop-color="#eff6ff" />
        <stop offset="100%" stop-color="#dbeafe" />
      </linearGradient>
      <linearGradient id="panelWarn" x1="0" x2="1">
        <stop offset="0%" stop-color="#fff7ed" />
        <stop offset="100%" stop-color="#ffedd5" />
      </linearGradient>
    </defs>

    <rect width="1800" height="1200" rx="28" fill="url(#bg)" />
    <text x="60" y="80" fill="#f8fafc" font-size="40" font-family="Arial" font-weight="700">GUIA TÉCNICO DE MONTAGEM - IMAGEM JPG GERADA</text>
    <text x="60" y="122" fill="#bfdbfe" font-size="28" font-family="Arial">${escapeXml(brand)} • ${escapeXml(model)} • ${escapeXml(engine)}</text>

    <rect x="50" y="160" width="820" height="460" rx="24" fill="url(#panelLight)" />
    <text x="80" y="210" fill="#0f172a" font-size="30" font-family="Arial" font-weight="700">BLOCO E CONJUNTO INFERIOR</text>
    <rect x="140" y="300" width="470" height="150" rx="30" fill="#93a4b8" />
    <rect x="170" y="345" width="410" height="60" rx="18" fill="#dbe3ec" />
    <circle cx="210" cy="375" r="42" fill="#334155" />
    <circle cx="320" cy="375" r="42" fill="#334155" />
    <circle cx="430" cy="375" r="42" fill="#334155" />
    <circle cx="540" cy="375" r="42" fill="#334155" />
    <rect x="650" y="250" width="160" height="250" rx="24" fill="#e2e8f0" stroke="#64748b" stroke-width="4" />
    <text x="675" y="300" fill="#0f172a" font-size="20" font-family="Arial" font-weight="700">LEGENDA</text>
    ${renderLines([
      "1. Mancais principais",
      "2. Bielas e capas",
      "3. Folga axial",
      "4. Aperto angular",
      "5. Conferência final",
    ], 675, 335, "#1e293b", 18)}
    <text x="80" y="520" fill="#0f172a" font-size="22" font-family="Arial" font-weight="700">Pontos de inspeção</text>
    ${renderLines(checklist, 90, 555, "#1e293b", 20)}

    <rect x="900" y="160" width="850" height="300" rx="24" fill="#e0f2fe" />
    <text x="930" y="210" fill="#0f172a" font-size="30" font-family="Arial" font-weight="700">MONTAGEM SUPERIOR E SINCRONISMO</text>
    <circle cx="1080" cy="315" r="75" fill="#cbd5e1" stroke="#334155" stroke-width="8" />
    <circle cx="1260" cy="315" r="75" fill="#cbd5e1" stroke="#334155" stroke-width="8" />
    <circle cx="1170" cy="410" r="55" fill="#94a3b8" stroke="#334155" stroke-width="8" />
    <path d="M1080 240 L1260 240 L1210 410 L1130 410 Z" fill="none" stroke="#0f766e" stroke-width="10" />
    <text x="1380" y="270" fill="#0f172a" font-size="20" font-family="Arial">• Sequência: caracol do centro para fora</text>
    <text x="1380" y="305" fill="#0f172a" font-size="20" font-family="Arial">• PMS no 1º cilindro</text>
    <text x="1380" y="340" fill="#0f172a" font-size="20" font-family="Arial">• Trava de comando recomendada</text>
    <text x="1380" y="375" fill="#0f172a" font-size="20" font-family="Arial">• Conferir vedação da junta</text>

    <rect x="900" y="490" width="850" height="320" rx="24" fill="#f8fafc" />
    <text x="930" y="540" fill="#0f172a" font-size="30" font-family="Arial" font-weight="700">TORQUES E ETAPAS CRÍTICAS</text>
    <rect x="940" y="570" width="250" height="180" rx="18" fill="#e2e8f0" />
    <rect x="1210" y="570" width="250" height="180" rx="18" fill="#e2e8f0" />
    <rect x="1480" y="570" width="230" height="180" rx="18" fill="#e2e8f0" />
    ${renderLines(torqueSpecs.map((item) => `${item.component}`), 960, 610, "#0f172a", 18, 700)}
    ${renderLines(torqueSpecs.map((item) => `${item.sequence}`), 1230, 610, "#334155", 17, 600)}
    ${renderLines(torqueSpecs.map((item) => `${item.value}`), 1500, 610, "#0369a1", 17, 700)}

    <rect x="50" y="650" width="820" height="250" rx="24" fill="url(#panelWarn)" />
    <text x="80" y="700" fill="#7c2d12" font-size="30" font-family="Arial" font-weight="700">OBSERVAÇÕES TÉCNICAS IMPORTANTES</text>
    ${renderLines(noteLines, 90, 745, "#7c2d12", 21, 600)}
    <text x="90" y="860" fill="#9a3412" font-size="19" font-family="Arial">A imagem foi sintetizada para consulta rápida com foco em montagem, reaperto e sincronismo.</text>

    <rect x="50" y="930" width="1700" height="210" rx="24" fill="#082f49" />
    <text x="80" y="980" fill="#e0f2fe" font-size="28" font-family="Arial" font-weight="700">RESUMO DA IA</text>
    ${renderLines([
      `Família: ${matched?.family || "Diesel pesado"}`,
      `Aplicação: ${matched?.application || "Caminhões, ônibus e linha rodoviária"}`,
      `Anos de referência: ${matched?.years || "Consulta técnica"}`,
      "Foco do esquema: cabeçote, mancal, biela, sincronismo e regulagem final.",
    ], 90, 1020, "#dbeafe", 21)}

    <text x="1180" y="1110" fill="#93c5fd" font-size="16" font-family="Arial">Motor Schema AI • JPG técnico gerado automaticamente</text>
  </svg>`;

  const imageBuffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(imageBuffer), {
    headers: {
      "Content-Type": "image/jpeg",
      ...(download
        ? { "Content-Disposition": `attachment; filename="esquema-${brand}-${engine}.jpg"` }
        : {}),
    },
  });
}
