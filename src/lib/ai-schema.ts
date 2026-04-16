import type { EngineRecord } from "@/data/engines";

export type AiBlueprint = {
  provider: "gemini" | "fallback";
  headline: string;
  narrative: string;
  warnings: string[];
  detailLines: string[];
  recommendedSequence: string[];
};

function safeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.length
    ? value.map((item) => String(item)).filter(Boolean).slice(0, fallback.length)
    : fallback;
}

export function buildFallbackBlueprint({
  record,
  brand,
  engine,
}: {
  record: EngineRecord | null;
  brand?: string;
  engine?: string;
}): AiBlueprint {
  const engineName = `${record?.brand || brand || "Motor"} ${record?.model || engine || "diesel"}`.trim();

  return {
    provider: "fallback",
    headline: `Esquema inteligente de ${engineName}`,
    narrative: `A IA montou um esquema técnico com foco em torques, sincronismo, cabeçote e fechamento final do ${engineName}.`,
    warnings: [
      "Lubrificar roscas críticas antes do aperto angular.",
      "Conferir planicidade do cabeçote e espessura da junta.",
      "Executar sincronismo com o primeiro cilindro em PMS.",
    ],
    detailLines: [
      `Aplicação: ${record?.application || "linha diesel pesada"}`,
      `Família: ${record?.family || "diesel"}`,
      `Faixa de anos: ${record?.years || "referência técnica"}`,
      `Motor/código: ${record?.engineCode || engine || "consulta genérica"}`,
    ],
    recommendedSequence: record?.checklist?.slice(0, 4) || [
      "Fechar bloco e mancais em sequência do centro para fora",
      "Aplicar cabeçote com aperto escalonado",
      "Sincronizar comando, virabrequim e injeção",
      "Conferir reaperto e regulagem final",
    ],
  };
}

export async function generateAiBlueprint({
  record,
  brand,
  engine,
}: {
  record: EngineRecord | null;
  brand?: string;
  engine?: string;
}): Promise<AiBlueprint> {
  const fallback = buildFallbackBlueprint({ record, brand, engine });
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  const prompt = `Gere um JSON técnico em português para um esquema visual de montagem de motor diesel.
Marca: ${brand || record?.brand || "não informado"}
Motor: ${engine || record?.engineCode || record?.model || "não informado"}
Contexto: criar um infográfico técnico semelhante a manual de torque e montagem.
Retorne estritamente JSON com as chaves: headline, narrative, warnings, detailLines, recommendedSequence.
Cada array deve ter exatamente 4 itens curtos e objetivos.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      return fallback;
    }

    const payload = await response.json();
    const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return fallback;
    }

    const parsed = JSON.parse(rawText);

    return {
      provider: "gemini",
      headline: safeText(parsed.headline, fallback.headline),
      narrative: safeText(parsed.narrative, fallback.narrative),
      warnings: safeStringArray(parsed.warnings, fallback.warnings),
      detailLines: safeStringArray(parsed.detailLines, fallback.detailLines),
      recommendedSequence: safeStringArray(parsed.recommendedSequence, fallback.recommendedSequence),
    };
  } catch {
    return fallback;
  }
}
