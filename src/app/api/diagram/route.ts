import { getEngineById } from "@/data/engines";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
    "Conferir injeção e reaperto",
  ]).slice(0, 4);

  const torqueLine = matched?.torqueSpecs
    ?.slice(0, 3)
    .map((item) => `${item.component}: ${item.value}`)
    .join(" • ");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900" role="img" aria-label="Esquema técnico gerado">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#07111f" />
        <stop offset="100%" stop-color="#10325d" />
      </linearGradient>
      <linearGradient id="card" x1="0" x2="1">
        <stop offset="0%" stop-color="#eff6ff" />
        <stop offset="100%" stop-color="#dbeafe" />
      </linearGradient>
    </defs>
    <rect width="1400" height="900" fill="url(#bg)" rx="28" />
    <text x="60" y="80" fill="#f8fafc" font-size="34" font-family="Arial" font-weight="700">ESQUEMA DE MONTAGEM GERADO</text>
    <text x="60" y="122" fill="#bfdbfe" font-size="24" font-family="Arial">${escapeXml(brand)} • ${escapeXml(model)} • ${escapeXml(engine)}</text>

    <rect x="50" y="160" width="630" height="320" rx="22" fill="url(#card)" />
    <text x="80" y="205" fill="#0f172a" font-size="28" font-family="Arial" font-weight="700">Bloco e parte inferior</text>
    <rect x="110" y="250" width="420" height="120" rx="24" fill="#94a3b8" />
    <circle cx="170" cy="310" r="38" fill="#334155" />
    <circle cx="270" cy="310" r="38" fill="#334155" />
    <circle cx="370" cy="310" r="38" fill="#334155" />
    <circle cx="470" cy="310" r="38" fill="#334155" />
    <rect x="135" y="282" width="360" height="56" rx="18" fill="#cbd5e1" />
    <text x="80" y="410" fill="#0f172a" font-size="20" font-family="Arial">Torque-chave</text>
    <foreignObject x="80" y="425" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial;font-size:16px;color:#1e293b;">${escapeXml(
        torqueLine || "Torque progressivo com conferência final e reaperto conforme boletim técnico."
      )}</div>
    </foreignObject>

    <rect x="720" y="160" width="630" height="220" rx="22" fill="#e0f2fe" />
    <text x="750" y="205" fill="#0f172a" font-size="28" font-family="Arial" font-weight="700">Montagem superior</text>
    <text x="750" y="245" fill="#0f172a" font-size="18" font-family="Arial">Sequência sugerida: espiral do centro para fora</text>
    <g fill="#0f766e">
      <circle cx="810" cy="300" r="22"/><circle cx="870" cy="260" r="22"/><circle cx="930" cy="300" r="22"/>
      <circle cx="990" cy="260" r="22"/><circle cx="1050" cy="300" r="22"/><circle cx="1110" cy="260" r="22"/>
      <circle cx="1170" cy="300" r="22"/><circle cx="1230" cy="260" r="22"/>
    </g>
    <text x="750" y="350" fill="#0f172a" font-size="18" font-family="Arial">Cabeçote, juntas e válvulas devem ser fechados com controle angular.</text>

    <rect x="720" y="410" width="630" height="260" rx="22" fill="#f8fafc" />
    <text x="750" y="455" fill="#0f172a" font-size="28" font-family="Arial" font-weight="700">Checklist da IA</text>
    <text x="770" y="505" fill="#1e293b" font-size="18" font-family="Arial">1. ${escapeXml(checklist[0] || "Inspeção inicial")}</text>
    <text x="770" y="545" fill="#1e293b" font-size="18" font-family="Arial">2. ${escapeXml(checklist[1] || "Torque do cabeçote")}</text>
    <text x="770" y="585" fill="#1e293b" font-size="18" font-family="Arial">3. ${escapeXml(checklist[2] || "Sincronismo")}</text>
    <text x="770" y="625" fill="#1e293b" font-size="18" font-family="Arial">4. ${escapeXml(checklist[3] || "Reaperto final")}</text>

    <rect x="50" y="520" width="630" height="150" rx="22" fill="#fef3c7" />
    <text x="80" y="565" fill="#78350f" font-size="26" font-family="Arial" font-weight="700">Observações críticas</text>
    <text x="80" y="605" fill="#78350f" font-size="18" font-family="Arial">• Lubrificar roscas recomendadas e conferir planicidade</text>
    <text x="80" y="635" fill="#78350f" font-size="18" font-family="Arial">• Trocar fixadores angulares quando exigido</text>
    <text x="80" y="665" fill="#78350f" font-size="18" font-family="Arial">• Validar o chassi/VIN em API pública antes do fechamento final</text>

    <text x="60" y="840" fill="#cbd5e1" font-size="16" font-family="Arial">Gerado automaticamente pelo Motor Schema AI • versão demonstrativa para consulta técnica</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      ...(download
        ? { "Content-Disposition": `attachment; filename="esquema-${brand}-${model}.svg"` }
        : {}),
    },
  });
}
