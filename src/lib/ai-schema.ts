import type { EngineRecord } from "@/data/engines";
import { findKnowledgeEntries } from "@/data/knowledge-base";

export type LayoutHint = "valve" | "inline" | "v-engine" | "gearbox";

export type AiBlueprint = {
  provider: "gemini" | "fallback";
  headline: string;
  narrative: string;
  warnings: string[];
  detailLines: string[];
  recommendedSequence: string[];
  layoutHint: LayoutHint;
  componentFocus: string[];
  imagePrompt: string;
};

function safeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeStringArray(value: unknown, fallback: string[], maxItems = fallback.length) {
  return Array.isArray(value) && value.length
    ? value.map((item) => String(item)).filter(Boolean).slice(0, maxItems)
    : fallback.slice(0, maxItems);
}

function inferLayoutHint({
  record,
  brand,
  engine,
}: {
  record: EngineRecord | null;
  brand?: string;
  engine?: string;
}): LayoutHint {
  const combined = `${record?.brand || brand || ""} ${record?.model || ""} ${record?.engineCode || engine || ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/cambio|transmissao|g211/.test(combined)) return "gearbox";
  if (/v8|dc16|dsc/.test(combined)) return "v-engine";
  if (/om352|x10|6taa|valv|regul|folga|balanc/.test(combined)) return "valve";
  return "inline";
}

function normalizeLayoutHint(value: unknown, fallback: LayoutHint) {
  return value === "valve" || value === "inline" || value === "v-engine" || value === "gearbox"
    ? value
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
  const knowledge = findKnowledgeEntries(brand || record?.brand, engine || record?.engineCode);
  const primaryKnowledge = knowledge[0];
  const layoutHint = inferLayoutHint({ record, brand, engine });

  const componentFocus = layoutHint === "v-engine"
    ? ["bancadas", "sincronismo duplo", "turbo central", "fechamento cruzado"]
    : layoutHint === "gearbox"
      ? ["eixo piloto", "sincronizadores", "calcos", "folga axial"]
      : layoutHint === "valve"
        ? ["balancins", "folga de valvulas", "ordem de regulagem", "motor frio"]
        : ["cabecote", "bielas", "mancais", "sincronismo"];

  return {
    provider: "fallback",
    headline: primaryKnowledge?.title || `Esquema inteligente de ${engineName}`,
    narrative:
      primaryKnowledge?.summary ||
      `A IA montou um esquema técnico com foco em torques, sincronismo, cabeçote e fechamento final do ${engineName}.`,
    warnings: primaryKnowledge?.mountingTips?.slice(0, 4) || [
      "Lubrificar roscas criticas antes do aperto angular.",
      "Conferir planicidade do cabecote e espessura da junta.",
      "Executar sincronismo com o primeiro cilindro em PMS.",
      "Revisar vazamentos e folgas antes da partida.",
    ],
    detailLines: primaryKnowledge?.measurements?.slice(0, 4) || [
      `Aplicacao: ${record?.application || "linha diesel pesada"}`,
      `Familia: ${record?.family || "diesel"}`,
      `Faixa de anos: ${record?.years || "referencia tecnica"}`,
      `Motor/codigo: ${record?.engineCode || engine || "consulta generica"}`,
    ],
    recommendedSequence: record?.checklist?.slice(0, 4) || primaryKnowledge?.torqueHighlights?.slice(0, 4) || [
      "Fechar bloco e mancais em sequencia do centro para fora",
      "Aplicar cabecote com aperto escalonado",
      "Sincronizar comando, virabrequim e injecao",
      "Conferir reaperto e regulagem final",
    ],
    layoutHint,
    componentFocus,
    imagePrompt: `Crie uma ilustracao tecnica de manual de oficina para ${engineName}, com estilo realista, vista mecanica detalhada, etiquetas em portugues brasil, blocos limpos, foco em ${componentFocus.join(", ")} e aparencia parecida com folha de referencia de mecanica diesel.`,
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
  const knowledge = findKnowledgeEntries(brand || record?.brand, engine || record?.engineCode);
  const knowledgeContext = knowledge
    .map(
      (item) =>
        `Titulo: ${item.title}\nResumo: ${item.summary}\nTorques: ${item.torqueHighlights.join(" | ")}\nMedidas: ${item.measurements.join(" | ")}\nValvulas: ${item.valveSpecs.join(" | ")}\nDicas: ${item.mountingTips.join(" | ")}`
    )
    .join("\n\n");

  if (!apiKey) {
    return fallback;
  }

  const prompt = `Atue como especialista em motores diesel pesados e designer de manuais de oficina.
Responda sempre em portugues brasil, com linguagem tecnica e objetiva.

Referencia visual principal: esquema OM352 de regulagem de valvulas, com blocos claros, mais detalhes mecanicos, leitura de oficina e titulos fortes.
Agora adapte esse padrao ao motor consultado.

Marca: ${brand || record?.brand || "nao informado"}
Motor: ${engine || record?.engineCode || record?.model || "nao informado"}
Contexto tecnico confiavel:\n${knowledgeContext || "Sem historico adicional"}

Objetivo:
- definir o melhor layout do manual tecnico
- destacar componentes mecanicos mais importantes
- criar instrucoes curtas para paines do esquema
- sugerir um prompt visual para um gerador de imagem Gemini

Nunca invente valores fora da base disponivel. Se faltar valor, descreva procedimento seguro e tecnico.
Retorne estritamente JSON com as chaves:
headline, narrative, warnings, detailLines, recommendedSequence, layoutHint, componentFocus, imagePrompt.

Regras:
- warnings, detailLines, recommendedSequence e componentFocus com exatamente 4 itens
- layoutHint deve ser apenas: valve, inline, v-engine ou gearbox
- imagePrompt deve pedir uma ilustracao mecanica realista em estilo de manual tecnico diesel.`;

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
            temperature: 0.35,
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
      warnings: safeStringArray(parsed.warnings, fallback.warnings, 4),
      detailLines: safeStringArray(parsed.detailLines, fallback.detailLines, 4),
      recommendedSequence: safeStringArray(parsed.recommendedSequence, fallback.recommendedSequence, 4),
      layoutHint: normalizeLayoutHint(parsed.layoutHint, fallback.layoutHint),
      componentFocus: safeStringArray(parsed.componentFocus, fallback.componentFocus, 4),
      imagePrompt: safeText(parsed.imagePrompt, fallback.imagePrompt),
    };
  } catch {
    return fallback;
  }
}

export async function generateGeminiMechanicalBase({
  brand,
  model,
  engine,
  blueprint,
}: {
  brand: string;
  model: string;
  engine: string;
  blueprint: AiBlueprint;
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const prompt = `${blueprint.imagePrompt}\nMarca: ${brand}\nModelo: ${model}\nMotor: ${engine}\nSem fundo artistico. Formato de pagina tecnica, desenho mecanico realista, limpo e muito explicativo.`;
  const models = [
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp-image-generation",
  ];

  for (const modelName of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              responseModalities: ["TEXT", "IMAGE"],
            },
          }),
        }
      );

      if (!response.ok) {
        continue;
      }

      const payload = await response.json();
      const parts = (payload?.candidates || []).flatMap((candidate: { content?: { parts?: unknown[] } }) => candidate?.content?.parts || []);
      const imagePart = parts.find(
        (part: { inlineData?: { data?: string; mimeType?: string } }) => part?.inlineData?.data && String(part?.inlineData?.mimeType || "").startsWith("image/")
      ) as { inlineData?: { data?: string; mimeType?: string } } | undefined;

      if (imagePart?.inlineData?.data) {
        const mimeType = imagePart.inlineData.mimeType || "image/png";
        return `data:${mimeType};base64,${imagePart.inlineData.data}`;
      }
    } catch {
      continue;
    }
  }

  return null;
}
