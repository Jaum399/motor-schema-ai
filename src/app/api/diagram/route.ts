import path from "node:path";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { ImageResponse } from "next/og";
import { getEngineById } from "@/data/engines";
import { findKnowledgeEntries } from "@/data/knowledge-base";
import { generateAiBlueprint, generateGeminiMechanicalBase } from "@/lib/ai-schema";
import { createAssemblyDiagramElement } from "@/lib/assembly-diagram-template";
import { createValveDiagramElement } from "@/lib/valve-diagram-template";

export const runtime = "nodejs";

let embeddedFontCss = "";
let manualFontDataPromise: Promise<ArrayBuffer | null> | null = null;

async function getManualFontData() {
  if (!manualFontDataPromise) {
    manualFontDataPromise = readFile(path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"))
      .then((buffer) => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer)
      .catch(() => null);
  }

  return manualFontDataPromise;
}

function getEmbeddedFontCss() {
  if (embeddedFontCss) {
    return embeddedFontCss;
  }

  embeddedFontCss = `
    svg, text, tspan {
      font-family: Arial, Helvetica, Liberation Sans, sans-serif !important;
      font-style: normal !important;
    }
  `;

  return embeddedFontCss;
}

function normalizeManualText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/â€¢/g, " - ")
    .replace(/â†’/g, " -> ")
    .replace(/Â°/g, " deg")
    .replace(/[Âª]/g, "a")
    .replace(/[Âº]/g, "o")
    .replace(/[â€œâ€]/g, '"')
    .replace(/[â€˜â€™]/g, "'");
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

  return lines.slice(0, 5);
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
      output += `<text x="${x}" y="${cursorY + index * (size + 6)}" fill="${color}" font-size="${size}" font-family="sans-serif" font-style="normal" font-weight="${weight}">${escapeXml(line)}</text>`;
    });
    cursorY += wrapped.length * (size + 6) + gap;
  }

  return output;
}

function toInches(mmValue: string) {
  const numeric = Number.parseFloat(mmValue.replace(",", "."));
  if (!Number.isFinite(numeric)) {
    return "0.000";
  }

  return (numeric / 25.4).toFixed(3);
}

function inferValveClearances(lines: string[], brand: string, engine: string) {
  const combined = normalizeManualText(lines.join(" | ")).toLowerCase();
  const defaultAdmission = /om352|mercedes/.test(`${brand} ${engine}`.toLowerCase()) ? "0,20" : "0,40";
  const defaultExhaust = /om352|mercedes/.test(`${brand} ${engine}`.toLowerCase()) ? "0,30" : "0,40";

  const admissionMatch = combined.match(/adm(?:issao)?[^0-9]*([0-9]+[\.,][0-9]+)/i);
  const exhaustMatch = combined.match(/esc(?:ape)?[^0-9]*([0-9]+[\.,][0-9]+)/i);

  return {
    admission: (admissionMatch?.[1] || defaultAdmission).replace(".", ","),
    exhaust: (exhaustMatch?.[1] || defaultExhaust).replace(".", ","),
  };
}

function inferFiringOrder(lines: string[]) {
  const combined = normalizeManualText(lines.join(" | "));
  const match = combined.match(/(\d\s*-\s*\d\s*-\s*\d\s*-\s*\d\s*-\s*\d\s*-\s*\d)/);
  return match?.[1] || "1 - 5 - 3 - 6 - 2 - 4";
}

function buildBalanceProcedure() {
  return [
    { balance: "6", regular: "1" },
    { balance: "2", regular: "5" },
    { balance: "4", regular: "3" },
    { balance: "1", regular: "6" },
    { balance: "5", regular: "2" },
    { balance: "3", regular: "4" },
  ];
}

function mergeUniqueLines(...groups: Array<string[] | undefined>) {
  const seen = new Set<string>();

  return groups
    .flatMap((group) => group || [])
    .map((line) => normalizeManualText(line).trim())
    .filter(Boolean)
    .filter((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

type LayoutFlavor = "valve" | "inline" | "v-engine" | "gearbox";
type VisualTheme = "iveco" | "scania" | "mercedes" | "volvo" | "cummins" | "mwm" | "generic";

function normalizeRequestedLayout(value: string | null): LayoutFlavor | null {
  return value === "valve" || value === "inline" || value === "v-engine" || value === "gearbox"
    ? value
    : null;
}

function normalizeVisualTheme(value: string | null, brand: string, model: string, engine: string): VisualTheme {
  if (value === "iveco" || value === "scania" || value === "mercedes" || value === "volvo" || value === "cummins" || value === "mwm" || value === "generic") {
    return value;
  }

  const combined = normalizeManualText([brand, model, engine].join(" ")).toLowerCase();
  if (combined.includes("scania")) return "scania";
  if (combined.includes("mercedes") || combined.includes("om")) return "mercedes";
  if (combined.includes("volvo")) return "volvo";
  if (combined.includes("cummins") || combined.includes("isx") || combined.includes("x15")) return "cummins";
  if (combined.includes("mwm")) return "mwm";
  if (combined.includes("iveco") || combined.includes("cursor")) return "iveco";
  return "generic";
}

function inferLayoutFlavor({
  brand,
  model,
  engine,
  title,
  isGearbox,
}: {
  brand: string;
  model: string;
  engine: string;
  title?: string;
  isGearbox: boolean;
}) {
  if (isGearbox) return "gearbox" as const;

  const combined = normalizeManualText([brand, model, engine, title || ""].join(" ")).toLowerCase();
  const normalizedTitle = normalizeManualText(title || "").toLowerCase();

  if (/v8|dc16|dsc/.test(combined)) return "v-engine" as const;

  const valveHints = /valv|regul|folga|balanc|admiss|escap/.test(normalizedTitle) ||
    /valv|regul|folga|balanc|admiss|escap/.test(combined);

  if (valveHints) return "valve" as const;
  return "inline" as const;
}

function renderValveRegulationSheet({
  brand,
  model,
  engine,
  regulationLines,
  measureLines,
  noteLines,
}: {
  brand: string;
  model: string;
  engine: string;
  regulationLines: string[];
  measureLines: string[];
  noteLines: string[];
}) {
  const clearances = inferValveClearances([...regulationLines, ...measureLines, ...noteLines], brand, engine);
  const firingOrder = inferFiringOrder(regulationLines);
  const balanceProcedure = buildBalanceProcedure();

  const fontCss = getEmbeddedFontCss();

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1500" viewBox="0 0 2200 1500" role="img" aria-label="Esquema tecnico de regulagem de valvulas">
    <defs>
      <linearGradient id="softBg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#ecf1f4" />
        <stop offset="100%" stop-color="#dbe5eb" />
      </linearGradient>
      <linearGradient id="metal" x1="0" x2="1">
        <stop offset="0%" stop-color="#b6bec6" />
        <stop offset="50%" stop-color="#e7ecef" />
        <stop offset="100%" stop-color="#8f99a2" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#1f2937" flood-opacity="0.18" />
      </filter>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#000" />
      </marker>
    </defs>
    <style>${fontCss}</style>

    <rect width="2200" height="1500" rx="18" fill="url(#softBg)" stroke="#111827" stroke-width="3" />

    <rect x="18" y="14" width="2164" height="98" rx="14" fill="#f8fafc" stroke="#111827" stroke-width="3" />
    <text x="1100" y="72" text-anchor="middle" fill="#111827" font-size="50" font-family="sans-serif" font-weight="800">
      ${escapeXml(`ESQUEMA DE REGULAGEM DE VALVULAS: MOTOR ${brand} ${model || engine}`.toUpperCase())}
    </text>

    <g filter="url(#shadow)">
      <rect x="48" y="160" width="760" height="1030" rx="18" fill="#f8fafc" stroke="#1f2937" stroke-width="3" />
      <rect x="860" y="160" width="560" height="720" rx="18" fill="#f8fafc" stroke="#1f2937" stroke-width="3" />
      <rect x="1460" y="160" width="690" height="860" rx="18" fill="#f8fafc" stroke="#1f2937" stroke-width="3" />
      <rect x="890" y="920" width="520" height="250" rx="18" fill="#e5eef5" stroke="#1f2937" stroke-width="3" />
    </g>

    <g transform="translate(120,230)">
      <rect x="160" y="0" width="280" height="720" rx="18" fill="url(#metal)" stroke="#222" stroke-width="3" />
      <rect x="200" y="40" width="200" height="640" rx="18" fill="#cfd6dc" stroke="#222" stroke-width="3" />
      ${[1, 2, 3, 4, 5, 6].map((num, index) => {
        const cy = 80 + index * 95;
        const green = clearances.admission;
        const red = clearances.exhaust;
        return `
          <circle cx="300" cy="${cy}" r="46" fill="#d1d5db" stroke="#222" stroke-width="4" />
          <circle cx="300" cy="${cy}" r="30" fill="#9ca3af" stroke="#111827" stroke-width="3" />
          <text x="300" y="${cy + 12}" text-anchor="middle" fill="#fff" font-size="32" font-family="sans-serif" font-weight="700">${num}</text>
          <circle cx="405" cy="${cy - 18}" r="20" fill="#66bb6a" stroke="#1b5e20" stroke-width="3" />
          <circle cx="405" cy="${cy + 18}" r="20" fill="#d6453d" stroke="#7f1d1d" stroke-width="3" />
          <line x1="50" y1="${cy - 10}" x2="205" y2="${cy - 10}" stroke="#0f7a2a" stroke-width="3" />
          <line x1="50" y1="${cy + 20}" x2="205" y2="${cy + 20}" stroke="#c62828" stroke-width="3" />
          <rect x="0" y="${cy - 44}" width="96" height="44" rx="8" fill="#1f9d39" />
          <text x="48" y="${cy - 14}" text-anchor="middle" fill="#fff" font-size="18" font-family="sans-serif" font-weight="700">ADM</text>
          <rect x="0" y="${cy - 2}" width="96" height="44" rx="8" fill="#d63c35" />
          <text x="48" y="${cy + 28}" text-anchor="middle" fill="#fff" font-size="18" font-family="sans-serif" font-weight="700">ESC</text>
          ${index === 0 || index === 3 ? `<text x="110" y="${cy - 12}" fill="#1f9d39" font-size="17" font-family="sans-serif" font-weight="700">${escapeXml(`${green} mm`)}</text>` : ""}
          ${index === 1 || index === 5 ? `<text x="110" y="${cy + 24}" fill="#d63c35" font-size="17" font-family="sans-serif" font-weight="700">${escapeXml(`${red} mm`)}</text>` : ""}
        `;
      }).join("")}
      <path d="M-20 620 C-60 490 -50 350 0 240" fill="none" stroke="#111827" stroke-width="6" marker-end="url(#arrow)" />
      <text x="-90" y="500" transform="rotate(-90 -90 500)" fill="#111827" font-size="24" font-family="sans-serif" font-weight="800">SENTIDO DE ROTACAO</text>
    </g>

    <g transform="translate(910,210)">
      <polygon points="40,400 350,270 520,340 215,470" fill="#d9bf96" stroke="#6b4f2c" stroke-width="3" />
      <rect x="60" y="410" width="12" height="240" fill="#7f8c97" stroke="#222" stroke-width="2" />
      <rect x="300" y="320" width="12" height="330" fill="#7f8c97" stroke="#222" stroke-width="2" />
      <rect x="480" y="370" width="12" height="280" fill="#7f8c97" stroke="#222" stroke-width="2" />
      <rect x="60" y="520" width="250" height="12" fill="#7f8c97" stroke="#222" stroke-width="2" />
      <rect x="310" y="520" width="180" height="12" fill="#7f8c97" stroke="#222" stroke-width="2" />

      <g transform="translate(85,40)">
        <rect x="80" y="15" width="220" height="62" rx="10" fill="url(#metal)" stroke="#222" stroke-width="3" />
        ${Array.from({ length: 6 }).map((_, index) => `<rect x="${95 + index * 34}" y="-6" width="24" height="18" rx="6" fill="#cbd5db" stroke="#222" stroke-width="2" />`).join("")}
        <path d="M65 110 L340 180 L340 390 L115 460 L40 390 L40 185 Z" fill="url(#metal)" stroke="#222" stroke-width="3" />
        <rect x="80" y="120" width="220" height="70" rx="10" fill="#bfc7cd" stroke="#222" stroke-width="2" />
        ${Array.from({ length: 6 }).map((_, index) => `<circle cx="${98 + index * 38}" cy="155" r="13" fill="#7d8c98" stroke="#222" stroke-width="2" />`).join("")}
        <circle cx="55" cy="285" r="68" fill="url(#metal)" stroke="#222" stroke-width="3" />
        <circle cx="55" cy="285" r="40" fill="#8b98a2" stroke="#222" stroke-width="3" />
        <circle cx="300" cy="255" r="54" fill="url(#metal)" stroke="#222" stroke-width="3" />
        <circle cx="300" cy="255" r="26" fill="#8b98a2" stroke="#222" stroke-width="3" />
        <rect x="120" y="470" width="250" height="100" rx="12" fill="url(#metal)" stroke="#222" stroke-width="3" transform="rotate(-12 245 520)" />
        ${Array.from({ length: 6 }).map((_, index) => `<circle cx="${142 + index * 34}" cy="515" r="12" fill="#9daab3" stroke="#222" stroke-width="2" transform="rotate(-12 245 520)" />`).join("")}
        <path d="M-10 250 L-40 210" stroke="#444" stroke-width="6" />
        <path d="M-40 210 L-60 190" stroke="#444" stroke-width="6" />
        <path d="M330 500 L380 470" stroke="#555" stroke-width="5" />
        <path d="M300 502 L350 472" stroke="#555" stroke-width="5" />
      </g>
    </g>

    <g transform="translate(1475,180)">
      <text x="330" y="0" text-anchor="middle" fill="#111827" font-size="34" font-family="sans-serif" font-weight="800">PROCEDIMENTO DE REGULAGEM</text>
      <text x="330" y="38" text-anchor="middle" fill="#111827" font-size="26" font-family="sans-serif" font-weight="700">BALANCO EM CRUZ</text>
      <rect x="20" y="56" width="630" height="64" fill="#e6edf2" stroke="#111827" stroke-width="3" />
      <text x="335" y="102" text-anchor="middle" fill="#111827" font-size="48" font-family="sans-serif" font-weight="800">${escapeXml(firingOrder)}</text>
      ${balanceProcedure.map((item, index) => {
        const top = 120 + index * 112;
        return `
          <rect x="20" y="${top}" width="630" height="112" fill="#f8fafc" stroke="#111827" stroke-width="2" />
          <text x="48" y="${top + 42}" fill="#111827" font-size="26" font-family="sans-serif" font-weight="800">${index + 1}</text>
          <text x="80" y="${top + 28}" fill="#111827" font-size="21" font-family="sans-serif" font-weight="700">CILINDRO</text>
          <text x="78" y="${top + 78}" fill="#111827" font-size="19" font-family="sans-serif" font-weight="700">EM BALANCO</text>
          <circle cx="180" cy="${top + 47}" r="24" fill="#dbe6ef" stroke="#111827" stroke-width="3" />
          <text x="180" y="${top + 56}" text-anchor="middle" fill="#111827" font-size="24" font-family="sans-serif" font-weight="800">${item.balance}</text>
          <path d="M220 ${top + 44} L465 ${top + 44}" stroke="#111827" stroke-width="4" marker-end="url(#arrow)" />
          <text x="495" y="${top + 28}" fill="#111827" font-size="21" font-family="sans-serif" font-weight="700">CILINDRO</text>
          <text x="495" y="${top + 78}" fill="#111827" font-size="19" font-family="sans-serif" font-weight="700">REGULAR ADM E ESCAPE</text>
          <circle cx="590" cy="${top + 47}" r="24" fill="#e4efe7" stroke="#111827" stroke-width="3" />
          <text x="590" y="${top + 56}" text-anchor="middle" fill="#111827" font-size="24" font-family="sans-serif" font-weight="800">${item.regular}</text>
        `;
      }).join("")}
    </g>

    <rect x="54" y="1240" width="760" height="104" rx="14" fill="#f8fafc" stroke="#111827" stroke-width="3" />
    <text x="434" y="1308" text-anchor="middle" fill="#111827" font-size="54" font-family="sans-serif" font-weight="800">CONDICAO: MOTOR FRIO</text>

    <g transform="translate(920,940)">
      <text x="230" y="-10" text-anchor="middle" fill="#111827" font-size="34" font-family="sans-serif" font-weight="800">COMO MEDIR</text>
      <rect x="20" y="20" width="420" height="170" rx="12" fill="#d7e1e8" stroke="#111827" stroke-width="3" />
      <path d="M70 140 L70 80 L150 80" fill="none" stroke="#111827" stroke-width="6" />
      <path d="M150 80 C180 50, 230 50, 250 84" fill="none" stroke="#111827" stroke-width="6" />
      <line x1="160" y1="78" x2="160" y2="150" stroke="#222" stroke-width="6" />
      <line x1="155" y1="150" x2="120" y2="180" stroke="#222" stroke-width="5" />
      <rect x="196" y="52" width="72" height="20" rx="8" fill="#8f9ca6" stroke="#111827" stroke-width="3" />
      <path d="M260 100 L390 116" stroke="#111827" stroke-width="12" stroke-linecap="round" />
      <rect x="280" y="106" width="82" height="14" rx="6" fill="#cfd6dc" stroke="#111827" stroke-width="2" />
      <path d="M345 95 C390 80, 410 110, 405 145" fill="none" stroke="#111827" stroke-width="6" />
      <text x="42" y="210" fill="#111827" font-size="18" font-family="sans-serif" font-weight="700">USAR LAMINA CALIBRADORA COM LEVE RESISTENCIA</text>
    </g>

    <rect x="1460" y="1050" width="690" height="294" rx="18" fill="#f8fafc" stroke="#111827" stroke-width="3" />
    <text x="1805" y="1110" text-anchor="middle" fill="#111827" font-size="32" font-family="sans-serif" font-weight="800">FOLGAS ESPECIFICADAS (FRIO)</text>
    <text x="1500" y="1188" fill="#108a2f" font-size="28" font-family="sans-serif" font-weight="800">ADM (ADMISSAO): ${escapeXml(clearances.admission)} mm (${toInches(clearances.admission)}")</text>
    <text x="1500" y="1252" fill="#c62828" font-size="28" font-family="sans-serif" font-weight="800">ESC (ESCAPE): ${escapeXml(clearances.exhaust)} mm (${toInches(clearances.exhaust)}")</text>
    ${renderWrappedLines({ lines: noteLines.slice(0, 3), x: 1500, startY: 1295, color: "#334155", size: 17, weight: 700, maxChars: 58, gap: 8 })}
  </svg>`;
}

function renderAssemblySheet({
  title,
  engine,
  isGearbox,
  torqueSpecs,
  regulationLines,
  measureLines,
  noteLines,
  referenceLines,
  matchedFamily,
  matchedApplication,
  matchedYears,
  aiMode,
  geminiIllustration,
  componentFocus,
}: {
  title: string;
  engine: string;
  isGearbox: boolean;
  torqueSpecs: { component: string; sequence: string; value: string }[];
  regulationLines: string[];
  measureLines: string[];
  noteLines: string[];
  referenceLines: string[];
  matchedFamily: string;
  matchedApplication: string;
  matchedYears: string;
  aiMode: boolean;
  geminiIllustration?: string | null;
  componentFocus?: string[];
}) {
  const fontCss = getEmbeddedFontCss();
  const componentLegend = (componentFocus?.length
    ? componentFocus
    : isGearbox
      ? ["eixo piloto", "sincronizadores", "calcos", "folga axial"]
      : ["cabecote", "unidades injetoras", "camisas", "biela fraturada"]
  ).slice(0, 4);
  const torqueOrder = isGearbox
    ? ["1", "3", "5", "7", "8", "6", "4", "2"]
    : ["9", "5", "1", "3", "7", "11", "12", "8", "4", "2", "6", "10"];

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1500" viewBox="0 0 2200 1500" role="img" aria-label="Manual tecnico em JPG">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#d97706" />
      </marker>
    </defs>
    <style>${fontCss}</style>

    <rect width="2200" height="1500" rx="22" fill="#ece7db" />
    <rect x="20" y="18" width="2160" height="106" rx="16" fill="#f8f5ee" stroke="#1f2937" stroke-width="3" />
    <text x="60" y="76" fill="#111827" font-size="54" font-family="sans-serif" font-weight="700">${escapeXml(title)}</text>
    <text x="60" y="110" fill="#334155" font-size="23" font-family="sans-serif" font-weight="600">${escapeXml(engine.toUpperCase())} - ACABAMENTO DE MANUAL ORIGINAL - PORTUGUES BRASIL</text>

    <rect x="40" y="150" width="920" height="480" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="40" y="150" width="920" height="54" rx="18" fill="#bdebf0" />
    <text x="65" y="187" fill="#111827" font-size="28" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "CONJUNTO PRINCIPAL E EIXOS" : "BLOCO, CABECOTE E DESENHO MECANICO")}</text>
    <text x="70" y="245" fill="#111827" font-size="18" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "EIXO PILOTO / EIXO PRINCIPAL" : "VISTA MECANICA COMPLETA COM REFERENCIA DE OFICINA")}</text>
    ${geminiIllustration ? `
      <rect x="72" y="268" width="620" height="290" rx="16" fill="#dbe4ea" stroke="#334155" stroke-width="2" />
      <image x="82" y="278" width="600" height="270" href="${geminiIllustration}" preserveAspectRatio="xMidYMid slice" />
      <text x="84" y="585" fill="#0f172a" font-size="16" font-family="sans-serif" font-weight="700">ILUSTRACAO TECNICA REFINADA VIA NANO BANANA 2</text>
    ` : ""}

    <g transform="translate(60,224)">
      <rect x="30" y="38" width="600" height="70" rx="18" fill="#d9e2e8" stroke="#334155" stroke-width="3" />
      <rect x="85" y="102" width="500" height="84" rx="16" fill="#c6d1d8" stroke="#334155" stroke-width="3" />
      ${Array.from({ length: 6 }).map((_, index) => {
        const x = 110 + index * 76;
        return `<rect x="${x}" y="48" width="18" height="30" rx="6" fill="#95a4ae" stroke="#334155" stroke-width="2" />
                <circle cx="${x + 9}" cy="124" r="13" fill="#7a8a95" stroke="#334155" stroke-width="2" />
                <line x1="${x + 9}" y1="18" x2="${x + 9}" y2="48" stroke="#d97706" stroke-width="3" marker-end="url(#arrow)" />
                <circle cx="${x + 9}" cy="12" r="15" fill="#f1a24e" stroke="#9a5808" stroke-width="2" />
                <text x="${x + 4}" y="17" fill="#1f2937" font-size="15" font-family="sans-serif" font-weight="800">${index + 1}</text>`;
      }).join("")}
      <rect x="58" y="180" width="556" height="172" rx="18" fill="#95a4ae" stroke="#334155" stroke-width="3" />
      <rect x="120" y="208" width="360" height="64" rx="12" fill="#bcc8cf" stroke="#334155" stroke-width="3" />
      ${Array.from({ length: 6 }).map((_, index) => `<circle cx="${145 + index * 55}" cy="240" r="11" fill="#8796a1" stroke="#334155" stroke-width="2" />`).join("")}
      ${Array.from({ length: 6 }).map((_, index) => {
        const x = 118 + index * 72;
        return `<rect x="${x}" y="282" width="32" height="58" rx="8" fill="#dfe5ea" stroke="#334155" stroke-width="2" />
                <rect x="${x + 4}" y="300" width="24" height="32" rx="6" fill="#f3c58d" stroke="#8c5a2b" stroke-width="2" />`;
      }).join("")}
      <path d="M118 350 C180 390, 490 390, 548 350" fill="none" stroke="#475569" stroke-width="8" />
      <path d="M145 350 Q175 372 205 350 T265 350 T325 350 T385 350 T445 350 T505 350" fill="none" stroke="#1f2937" stroke-width="6" />
      <circle cx="58" cy="250" r="56" fill="#d7dee4" stroke="#334155" stroke-width="4" />
      <circle cx="58" cy="250" r="24" fill="#94a3ad" stroke="#334155" stroke-width="3" />
      <circle cx="608" cy="238" r="50" fill="#d7dee4" stroke="#334155" stroke-width="4" />
      <circle cx="608" cy="238" r="22" fill="#94a3ad" stroke="#334155" stroke-width="3" />
      <path d="M610 186 C660 150, 695 148, 730 170" fill="none" stroke="#475569" stroke-width="5" />
      <line x1="650" y1="116" x2="720" y2="116" stroke="#475569" stroke-width="3" />
      <line x1="650" y1="170" x2="720" y2="170" stroke="#475569" stroke-width="3" />
      <text x="660" y="109" fill="#1f2937" font-size="16" font-family="sans-serif" font-weight="700">TURBO / GEAR</text>
      <text x="662" y="189" fill="#1f2937" font-size="16" font-family="sans-serif" font-weight="700">TREM DIANTEIRO</text>
      <rect x="390" y="16" width="250" height="180" rx="12" fill="#efe5d0" stroke="#c5b89c" stroke-width="2" />
      <text x="406" y="46" fill="#1f2937" font-size="16" font-family="sans-serif" font-weight="800">LEGENDA DE MONTAGEM</text>
      ${componentLegend.map((item, index) => `<text x="408" y="${78 + index * 30}" fill="#7c2d12" font-size="16" font-family="sans-serif" font-weight="700">${index + 1}. ${escapeXml(item.toUpperCase())}</text>`).join("")}
      <text x="164" y="390" fill="#111827" font-size="17" font-family="sans-serif" font-weight="700">VISTA EXPLODIDA DE BLOCO, CAMISAS, CABECOTE E ACIONAMENTO</text>
    </g>

    <rect x="720" y="250" width="220" height="285" rx="12" fill="#fff7ed" stroke="#d6d3d1" stroke-width="2" />
    <text x="742" y="282" fill="#111827" font-size="18" font-family="sans-serif" font-weight="800">SEQUENCIA DE APERTO</text>
    <text x="742" y="306" fill="#374151" font-size="15" font-family="sans-serif" font-weight="700">CENTRO PARA FORA</text>
    ${torqueOrder.map((num, index) => {
      const columns = isGearbox ? 4 : 6;
      const col = index % columns;
      const row = Math.floor(index / columns);
      const cx = 742 + col * 30;
      const cy = 336 + row * 38;
      return `<circle cx="${cx}" cy="${cy}" r="12" fill="#f1a24e" stroke="#9a5808" stroke-width="2" /><text x="${cx - 4}" y="${cy + 5}" fill="#1f2937" font-size="13" font-family="sans-serif" font-weight="800">${num}</text>`;
    }).join("")}
    ${renderWrappedLines({ lines: torqueSpecs.map((item, index) => `${index + 1}a etapa: ${item.value}`), x: 742, startY: 420, color: "#7c2d12", size: 15, weight: 700, maxChars: 24, gap: 8 })}

    <rect x="980" y="150" width="540" height="250" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="980" y="150" width="540" height="54" rx="18" fill="#bdebf0" />
    <text x="1005" y="187" fill="#111827" font-size="28" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "REGULAGEM E FOLGAS" : "MONTAGEM SUPERIOR")}</text>
    <text x="1010" y="240" fill="#111827" font-size="18" font-family="sans-serif" font-weight="700">PARA FUSOS / PONTO DE APERTO</text>
    <g transform="translate(1010,255)">
      ${Array.from({ length: 12 }).map((_, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const cx = 30 + col * 110 + (row % 2 ? 18 : 0);
        const cy = 26 + row * 48;
        return `<circle cx="${cx}" cy="${cy}" r="18" fill="#f4a261" stroke="#374151" stroke-width="2" />
                <text x="${cx - 7}" y="${cy + 6}" fill="#374151" font-size="17" font-family="sans-serif" font-weight="600">${index + 1}</text>`;
      }).join("")}
    </g>
    <text x="1085" y="378" fill="#374151" font-size="17" font-family="sans-serif" font-weight="500">PADRAO CARACOL / APERTO ESCALONADO</text>

    <rect x="980" y="425" width="540" height="395" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="980" y="425" width="540" height="54" rx="18" fill="#bdebf0" />
    <text x="1005" y="462" fill="#111827" font-size="28" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "SINCRONISMO E AJUSTE FINAL" : "SINCRONISMO E REGULAGEM")}</text>
    <text x="1015" y="520" fill="#111827" font-size="18" font-family="sans-serif" font-weight="700">SINCRONISMO DO COMANDO</text>
    <g transform="translate(1035,540)">
      <circle cx="90" cy="80" r="68" fill="#d1d5db" stroke="#374151" stroke-width="7" />
      <circle cx="270" cy="80" r="68" fill="#d1d5db" stroke="#374151" stroke-width="7" />
      <circle cx="180" cy="218" r="52" fill="#94a3b8" stroke="#374151" stroke-width="7" />
      <path d="M90 12 L270 12 L222 216 L138 216 Z" fill="none" stroke="#0f766e" stroke-width="9" />
    </g>
    ${renderWrappedLines({ lines: regulationLines, x: 1240, startY: 560, color: "#1f2937", size: 17, weight: 700, maxChars: 23, gap: 12 })}

    <rect x="1545" y="150" width="615" height="670" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="1545" y="150" width="615" height="54" rx="18" fill="#bdebf0" />
    <text x="1570" y="187" fill="#111827" font-size="28" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "ESPECIFICACOES ADICIONAIS" : "ESPECIFICACOES DO CABECOTE")}</text>
    <g transform="translate(1620,250)">
      <rect x="95" y="10" width="125" height="85" rx="8" fill="#b9c7cf" stroke="#374151" stroke-width="3" />
      <path d="M85 95 L230 95 L280 165 L35 165 Z" fill="#dbe4ea" stroke="#374151" stroke-width="3" />
      <rect x="115" y="165" width="90" height="120" rx="8" fill="#f4a261" opacity="0.75" />
      <rect x="90" y="285" width="140" height="160" rx="6" fill="#c7d2da" stroke="#374151" stroke-width="3" />
      <circle cx="160" cy="338" r="18" fill="#94a3b8" stroke="#374151" stroke-width="3" />
      <line x1="280" y1="52" x2="355" y2="52" stroke="#b45309" stroke-width="3" />
      <line x1="280" y1="165" x2="355" y2="165" stroke="#b45309" stroke-width="3" />
      <line x1="332" y1="52" x2="332" y2="165" stroke="#b45309" stroke-width="3" />
      <text x="368" y="72" fill="#111827" font-size="18" font-family="sans-serif" font-weight="700">ALTURA</text>
      <text x="368" y="96" fill="#374151" font-size="17" font-family="sans-serif" font-weight="500">NOMINAL</text>
      <text x="368" y="188" fill="#374151" font-size="17" font-family="sans-serif" font-weight="500">PLAINICIDADE</text>
    </g>
    ${renderWrappedLines({ lines: measureLines, x: 1575, startY: 610, color: "#7c2d12", size: 16, weight: 700, maxChars: 30, gap: 10 })}

    <rect x="40" y="655" width="920" height="305" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="40" y="655" width="920" height="54" rx="18" fill="#bdebf0" />
    <text x="65" y="692" fill="#111827" font-size="28" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "FIXACAO E FECHAMENTO" : "BIELAS E TORQUES")}</text>
    <g transform="translate(70,720)">
      <circle cx="88" cy="150" r="44" fill="none" stroke="#374151" stroke-width="10" />
      <rect x="124" y="42" width="84" height="162" rx="18" transform="rotate(25 166 123)" fill="#d8dee6" stroke="#374151" stroke-width="4" />
      <circle cx="218" cy="52" r="26" fill="none" stroke="#374151" stroke-width="9" />
      <rect x="28" y="228" width="230" height="42" rx="10" fill="#efe5d0" stroke="#c5b89c" stroke-width="2" />
      <text x="48" y="255" fill="#7c2d12" font-size="16" font-family="sans-serif" font-weight="800">BIELA, PISTAO E ORIENTACAO</text>
      <text x="290" y="55" fill="#111827" font-size="18" font-family="sans-serif" font-weight="800">TORQUES DE FECHAMENTO</text>
      ${renderWrappedLines({ lines: torqueSpecs.map((item) => `${item.component}: ${item.value}`), x: 290, startY: 94, color: "#1f2937", size: 18, weight: 700, maxChars: 40, gap: 8 })}
      ${renderWrappedLines({ lines: noteLines.slice(0, 2), x: 290, startY: 220, color: "#7c2d12", size: 16, weight: 700, maxChars: 48, gap: 8 })}
    </g>

    <rect x="1545" y="845" width="615" height="115" rx="18" fill="#f8fafc" stroke="#d1d5db" stroke-width="3" />
    <rect x="1545" y="845" width="615" height="46" rx="18" fill="#bdebf0" />
    <text x="1570" y="877" fill="#111827" font-size="28" font-family="sans-serif" font-weight="700">${escapeXml(isGearbox ? "VERIFICACAO FINAL" : "REGULAGEM FINAL")}</text>
    ${renderWrappedLines({ lines: noteLines, x: 1575, startY: 920, color: "#1f2937", size: 15, weight: 700, maxChars: 36, gap: 7 })}

    <rect x="40" y="988" width="2120" height="360" rx="18" fill="#0b2d3b" />
    <text x="70" y="1038" fill="#f8fafc" font-size="30" font-family="sans-serif" font-weight="700">RESUMO DA IA E REFERENCIAS TECNICAS</text>
    ${renderWrappedLines({ lines: [
      `Familia: ${matchedFamily}`,
      `Aplicacao: ${matchedApplication}`,
      `Anos de referencia: ${matchedYears}`,
      referenceLines[0] || "Consulta cruzada em bases publicas e internas.",
      ...(componentFocus?.slice(0, 2).map((item) => `Foco mecanico: ${item}`) || []),
      aiMode ? "Modo IA ativo com sintese tecnica, referencia OM352 e estilo de manual." : "Modo catalogo tecnico com estrutura pronta para consulta rapida.",
    ], x: 80, startY: 1085, color: "#dbeafe", size: 20, weight: 700, maxChars: 100, gap: 12 })}

    <rect x="40" y="1370" width="2120" height="70" rx="14" fill="#facc15" opacity="0.22" />
    <text x="70" y="1415" fill="#111827" font-size="24" font-family="sans-serif" font-weight="700">DICA: USE OLEO LIMPO NAS ROSCAS, CONFIRA REFERENCIAS DE PMS E SUBSTITUA FIXADORES COM APERTO ANGULAR SEMPRE QUE NECESSARIO.</text>
  </svg>`;
}

function renderVEngineServiceSheet({
  title,
  engine,
  torqueSpecs,
  measureLines,
  noteLines,
  referenceLines,
  geminiIllustration,
  componentFocus,
}: {
  title: string;
  engine: string;
  torqueSpecs: { component: string; sequence: string; value: string }[];
  measureLines: string[];
  noteLines: string[];
  referenceLines: string[];
  geminiIllustration?: string | null;
  componentFocus?: string[];
}) {
  const fontCss = getEmbeddedFontCss();

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1500" viewBox="0 0 2200 1500" role="img" aria-label="Manual tecnico motor V8">
    <style>${fontCss}</style>
    <rect width="2200" height="1500" rx="24" fill="#eef2f4" />
    <rect x="20" y="16" width="2160" height="94" rx="14" fill="#f8fafc" stroke="#0f172a" stroke-width="3" />
    <text x="1100" y="76" text-anchor="middle" fill="#0f172a" font-size="48" font-family="sans-serif" font-weight="800">${escapeXml(title)}</text>

    <rect x="40" y="150" width="840" height="700" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />
    <rect x="920" y="150" width="1240" height="700" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />
    <rect x="40" y="890" width="2120" height="420" rx="18" fill="#0f2f3d" />

    <text x="70" y="195" fill="#111827" font-size="28" font-family="sans-serif" font-weight="800">VISTA EXPLODIDA DAS BANCADAS</text>
    <text x="960" y="195" fill="#111827" font-size="28" font-family="sans-serif" font-weight="800">TORQUES, SINCRONISMO E CONTROLES</text>

    <g transform="translate(120,240)">
      <rect x="120" y="70" width="200" height="340" rx="24" fill="#d7dee4" stroke="#334155" stroke-width="3" transform="rotate(-18 220 240)" />
      <rect x="400" y="70" width="200" height="340" rx="24" fill="#d7dee4" stroke="#334155" stroke-width="3" transform="rotate(18 500 240)" />
      ${[1, 2, 3, 4].map((num, index) => `
        <circle cx="${185 + index * 28}" cy="${120 + index * 72}" r="26" fill="#9aa8b4" stroke="#334155" stroke-width="3" />
        <text x="${185 + index * 28}" y="${129 + index * 72}" text-anchor="middle" fill="#ffffff" font-size="20" font-family="sans-serif" font-weight="700">${num}</text>
      `).join("")}
      ${[5, 6, 7, 8].map((num, index) => `
        <circle cx="${535 - index * 28}" cy="${120 + index * 72}" r="26" fill="#9aa8b4" stroke="#334155" stroke-width="3" />
        <text x="${535 - index * 28}" y="${129 + index * 72}" text-anchor="middle" fill="#ffffff" font-size="20" font-family="sans-serif" font-weight="700">${num}</text>
      `).join("")}
      <rect x="250" y="210" width="220" height="80" rx="20" fill="#c7d2da" stroke="#334155" stroke-width="3" />
      <circle cx="360" cy="250" r="44" fill="#8a98a3" stroke="#334155" stroke-width="4" />
      <text x="360" y="257" text-anchor="middle" fill="#ffffff" font-size="18" font-family="sans-serif" font-weight="800">TURBO</text>
      <text x="100" y="460" fill="#111827" font-size="20" font-family="sans-serif" font-weight="700">BANCO A</text>
      <text x="520" y="460" fill="#111827" font-size="20" font-family="sans-serif" font-weight="700">BANCO B</text>
    </g>

    ${geminiIllustration ? `
      <rect x="88" y="590" width="740" height="220" rx="16" fill="#dbe4ea" stroke="#334155" stroke-width="2" />
      <image x="98" y="600" width="720" height="200" href="${geminiIllustration}" preserveAspectRatio="xMidYMid slice" />
      <text x="105" y="832" fill="#0f172a" font-size="16" font-family="sans-serif" font-weight="700">REFERENCIA MECANICA V8 VIA NANO BANANA 2</text>
    ` : ""}

    <rect x="960" y="230" width="530" height="260" rx="16" fill="#eef6fa" stroke="#334155" stroke-width="2" />
    <text x="985" y="268" fill="#111827" font-size="22" font-family="sans-serif" font-weight="800">SEQUENCIA DE APERTO</text>
    ${renderWrappedLines({ lines: torqueSpecs.map((item) => `${item.component}: ${item.value}`), x: 985, startY: 308, color: "#0f172a", size: 18, weight: 700, maxChars: 34, gap: 8 })}

    <rect x="1515" y="230" width="600" height="260" rx="16" fill="#eef6fa" stroke="#334155" stroke-width="2" />
    <text x="1540" y="268" fill="#111827" font-size="22" font-family="sans-serif" font-weight="800">PONTOS DE CONTROLE</text>
    ${renderWrappedLines({ lines: componentFocus?.length ? componentFocus : referenceLines, x: 1540, startY: 308, color: "#0f172a", size: 18, weight: 700, maxChars: 36, gap: 8 })}

    <rect x="960" y="520" width="1155" height="290" rx="16" fill="#f8fafc" stroke="#334155" stroke-width="2" />
    <text x="985" y="560" fill="#111827" font-size="22" font-family="sans-serif" font-weight="800">MEDICOES E OBSERVACOES</text>
    ${renderWrappedLines({ lines: [...measureLines, ...noteLines].slice(0, 8), x: 985, startY: 602, color: "#1f2937", size: 18, weight: 700, maxChars: 72, gap: 10 })}

    <text x="70" y="950" fill="#f8fafc" font-size="30" font-family="sans-serif" font-weight="800">RESUMO TECNICO DO ${escapeXml(engine.toUpperCase())}</text>
    ${renderWrappedLines({ lines: [
      referenceLines[0] || "Aplicacao pesada com bancada dupla e sincronismo rigoroso.",
      referenceLines[1] || "Executar travamento correto das referencias antes do torque final.",
      noteLines[0] || "Conferir fechamento cruzado das bancadas.",
      noteLines[1] || "Revisar folgas, lubrificacao e vedacao final.",
    ], x: 80, startY: 1000, color: "#dbeafe", size: 22, weight: 700, maxChars: 95, gap: 12 })}
  </svg>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const brand = searchParams.get("brand") || "Motor";
  const model = searchParams.get("model") || "Esquema tÃ©cnico";
  const engine = searchParams.get("engine") || "Diesel";
  const download = searchParams.get("download") === "1";
  const aiMode = searchParams.get("mode") === "ai";
  const requestedTitle = normalizeManualText(searchParams.get("title") || "").trim();
  const requestedLayout = normalizeRequestedLayout(searchParams.get("layout"));
  const visualTheme = normalizeVisualTheme(searchParams.get("theme"), brand, model, engine);

  const matched = getEngineById(id);
  const knowledge = findKnowledgeEntries(brand, engine);
  const primaryKnowledge = knowledge[0];
  const isGearbox = primaryKnowledge?.category === "gearbox";
  const aiBlueprint = aiMode
    ? await generateAiBlueprint({
        record: matched,
        brand,
        engine,
      })
    : null;
  const layoutFlavor = requestedLayout || aiBlueprint?.layoutHint || inferLayoutFlavor({
    brand,
    model,
    engine,
    title: requestedTitle || primaryKnowledge?.title,
    isGearbox,
  });
  const isValveFocused = layoutFlavor === "valve";
  const isVEngine = layoutFlavor === "v-engine";

  const checklist = (matched?.checklist || [
    "Validar bronzinas e folgas antes do fechamento final",
    "Aplicar sequÃªncia do cabeÃ§ote do centro para fora",
    "Sincronizar comando e virabrequim com PMS travado",
    "Conferir injeÃ§Ã£o, reaperto e vazamentos",
  ]).slice(0, 4);

  const torqueSpecs = (primaryKnowledge?.torqueHighlights?.length
    ? primaryKnowledge.torqueHighlights.slice(0, 4).map((line, index) => {
        const [component, ...rest] = line.split(":");
        return {
          component: component || `Etapa ${index + 1}`,
          sequence: isGearbox ? "EspecificaÃ§Ã£o" : "Torque e etapa",
          value: rest.join(":").trim() || line,
        };
      })
    : matched?.torqueSpecs || [
        { component: "CabeÃ§ote", sequence: "1a, 2a e angular", value: "80 Nm -> 160 Nm -> 90 deg" },
        { component: "Mancais", sequence: "SequÃªncia linear", value: "Pre-carga controlada" },
        { component: "Bielas", sequence: "Par graduado", value: "60 Nm -> 120 Nm -> 90 deg" },
      ]).slice(0, 4);

  const referenceLines = mergeUniqueLines(
    primaryKnowledge?.partCodes?.length
      ? primaryKnowledge.partCodes
      : [
          `Aplicacao: ${matched?.application || "linha diesel pesada"}`,
          `Familia: ${matched?.family || "diesel pesado"}`,
          `Anos: ${matched?.years || "referencia tecnica"}`,
        ]
  ).slice(0, 4);

  const noteLines = mergeUniqueLines(
    aiBlueprint?.warnings,
    primaryKnowledge?.mountingTips?.length
      ? primaryKnowledge.mountingTips
      : matched?.notes || [
          "Usar oleo limpo nas roscas e substituir parafusos com aperto angular.",
          "Conferir planicidade e altura nominal do cabecote antes da junta.",
          "Executar reaperto e sincronismo somente com referencias travadas.",
        ]
  ).slice(0, 4);

  const measureLines = mergeUniqueLines(
    aiBlueprint?.detailLines,
    primaryKnowledge?.measurements?.length
      ? primaryKnowledge.measurements
      : [
          "Verificar altura do cabecote e planicidade maxima permitida.",
          "Medir projecao do pistao no PMS para escolha correta da junta.",
          "Conferir diferenca maxima entre cilindros com relogio comparador.",
          "Registrar todas as medicoes antes do fechamento final.",
        ]
  ).slice(0, 4);

  const regulationLines = mergeUniqueLines(
    aiBlueprint?.recommendedSequence,
    primaryKnowledge?.valveSpecs?.length ? primaryKnowledge.valveSpecs : checklist
  ).slice(0, 6);

  const componentFocus = mergeUniqueLines(aiBlueprint?.componentFocus, referenceLines).slice(0, 4);

  const normalizedModel = normalizeManualText(model).trim();
  const normalizedEngine = normalizeManualText(engine).trim();
  const displayEngineLabel = normalizedModel && normalizedEngine && normalizedModel.toLowerCase() !== normalizedEngine.toLowerCase()
    ? `${brand} ${normalizedEngine} (${normalizedModel})`
    : `${brand} ${normalizedModel || normalizedEngine}`;

  const title = (requestedTitle || `GUIA TECNICO DE MONTAGEM E TORQUES - MOTOR ${displayEngineLabel}`).toUpperCase();
  const geminiIllustration = aiMode && aiBlueprint
    ? await generateGeminiMechanicalBase({
        brand,
        model,
        engine,
        blueprint: aiBlueprint,
      })
    : null;

  const fontData = await getManualFontData();
  const imageOptions = {
    width: 2200,
    height: 1500,
    ...(fontData
      ? {
          fonts: [
            {
              name: "MTManual",
              data: fontData,
              style: "normal" as const,
              weight: 400 as const,
            },
          ],
        }
      : {}),
  };

  let imageBuffer: Buffer;

  if (isValveFocused) {
    const clearances = inferValveClearances([...regulationLines, ...measureLines, ...noteLines], brand, engine);
    const response = new ImageResponse(
      createValveDiagramElement({
        title,
        brand,
        model,
        firingOrder: inferFiringOrder(regulationLines),
        admission: clearances.admission,
        exhaust: clearances.exhaust,
        notes: mergeUniqueLines(noteLines, measureLines, regulationLines).slice(0, 6),
        procedure: buildBalanceProcedure(),
        illustrationDataUrl: geminiIllustration,
        visualTheme,
      }),
      imageOptions,
    );

    imageBuffer = await sharp(Buffer.from(await response.arrayBuffer()))
      .png({ compressionLevel: 4, palette: false })
      .sharpen()
      .toBuffer();
  } else {
    const response = new ImageResponse(
      createAssemblyDiagramElement({
        title,
        brand,
        model,
        engine,
        variant: isGearbox ? "gearbox" : isVEngine ? "v-engine" : "inline",
        visualTheme,
        torqueSpecs,
        regulationLines,
        measureLines,
        noteLines,
        referenceLines,
        matchedFamily: matched?.family || (isGearbox ? "Transmissao pesada" : "Diesel pesado"),
        matchedApplication: matched?.application || primaryKnowledge?.summary || "Consulta tecnica assistida",
        matchedYears: matched?.years || "Base tecnica consolidada",
        aiMode,
        illustrationDataUrl: geminiIllustration,
        componentFocus,
      }),
      imageOptions,
    );

    imageBuffer = await sharp(Buffer.from(await response.arrayBuffer()))
      .png({ compressionLevel: 4, palette: false })
      .sharpen()
      .toBuffer();
  }

  return new Response(new Uint8Array(imageBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      ...(download ? { "Content-Disposition": `attachment; filename="esquema-${brand}-${engine}.png"` } : {}),
    },
  });
}

