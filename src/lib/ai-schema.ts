import type { EngineRecord } from "@/data/engines";
import { findKnowledgeEntries } from "@/data/knowledge-base";

export type LayoutHint = "valve" | "inline" | "v-engine" | "gearbox";

export type AiBlueprint = {
  provider: "gemini" | "openai" | "openrouter" | "fallback";
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

function parseJsonText(rawText: string) {
  const cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

async function tryOpenAiCompatibleBlueprint({
  apiKey,
  endpoint,
  model,
  prompt,
  provider,
  fallback,
  extraHeaders,
}: {
  apiKey: string;
  endpoint: string;
  model: string;
  prompt: string;
  provider: "openai" | "openrouter";
  fallback: AiBlueprint;
  extraHeaders?: Record<string, string>;
}): Promise<AiBlueprint | null> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(extraHeaders || {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.35,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const rawText = payload?.choices?.[0]?.message?.content;
    if (!rawText) {
      return null;
    }

    const parsed = parseJsonText(rawText);

    return {
      provider,
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
    return null;
  }
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
    imagePrompt: `Crie uma ilustracao tecnica hiper-realista de manual de oficina para ${engineName}, com layout exatamente no estilo de prancha explodida industrial de motores diesel: titulo grande no topo, quadro 1 com VISTA EXPLODIDA GERAL, quadro 2 com SUB-MONTAGEM DO BLOCO, quadro 3 com SUB-MONTAGEM DO CABECOTE, quadro 4 com SISTEMA DE DISTRIBUICAO, legenda lateral de pecas e caixa legivel de ESPECIFICACOES TECNICAS. Usar metais escovados, parafusos, dutos, linhas pontilhadas, etiquetas numeradas em portugues brasil e aspecto de manual original escaneado. Sem cartum. Foco em ${componentFocus.join(", ")}.`,
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
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const knowledge = findKnowledgeEntries(brand || record?.brand, engine || record?.engineCode);
  const knowledgeContext = knowledge
    .map(
      (item) =>
        `Titulo: ${item.title}\nResumo: ${item.summary}\nTorques: ${item.torqueHighlights.join(" | ")}\nMedidas: ${item.measurements.join(" | ")}\nValvulas: ${item.valveSpecs.join(" | ")}\nDicas: ${item.mountingTips.join(" | ")}`
    )
    .join("\n\n");

  if (!apiKey && !openAiKey && !openRouterKey) {
    return fallback;
  }

  const prompt = `Atue como especialista em motores diesel pesados e designer de manuais de oficina.
Responda sempre em portugues brasil, com linguagem tecnica, objetiva e visual de oficina.

Referencia visual principal: folha de manual OM352 de regulagem de valvulas, com acabamento industrial limpo, textura de impressao tecnica, setas, cotas, blocos claros e componentes mecanicos reconheciveis.
Agora adapte esse padrao ao motor consultado com aspecto mais realista e fiel ao manual original.

Marca: ${brand || record?.brand || "nao informado"}
Motor: ${engine || record?.engineCode || record?.model || "nao informado"}
Contexto tecnico confiavel:\n${knowledgeContext || "Sem historico adicional"}

Objetivo:
- definir o melhor layout do manual tecnico
- destacar componentes mecanicos mais importantes
- criar instrucoes curtas para paines do esquema
- sugerir um prompt visual para um gerador de imagem Nano Banana 2

Nunca invente valores fora da base disponivel. Se faltar valor, descreva procedimento seguro e tecnico.
Retorne estritamente JSON com as chaves:
headline, narrative, warnings, detailLines, recommendedSequence, layoutHint, componentFocus, imagePrompt.

Regras:
- warnings, detailLines, recommendedSequence e componentFocus com exatamente 4 itens
- layoutHint deve ser apenas: valve, inline, v-engine ou gearbox
- imagePrompt deve pedir uma ilustracao mecanica hiper-realista, com acabamento igual manual original, metais, parafusos, tubulacoes, callouts numerados e pagina de oficina diesel, sem aspecto cartum.`;

  if (apiKey) {
    const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

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
                temperature: 0.35,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (!response.ok) {
          continue;
        }

        const payload = await response.json();
        const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          continue;
        }

        const parsed = parseJsonText(rawText);

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
        continue;
      }
    }
  }

  if (openAiKey) {
    const openAiResult = await tryOpenAiCompatibleBlueprint({
      apiKey: openAiKey,
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      prompt,
      provider: "openai",
      fallback,
    });

    if (openAiResult) {
      return openAiResult;
    }
  }

  if (openRouterKey) {
    const openRouterResult = await tryOpenAiCompatibleBlueprint({
      apiKey: openRouterKey,
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      prompt,
      provider: "openrouter",
      fallback,
      extraHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://motor-schema-ai.vercel.app",
        "X-Title": "MT DIESEL ESQUEMAS",
      },
    });

    if (openRouterResult) {
      return openRouterResult;
    }
  }

  return fallback;
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

  const prompt = `${blueprint.imagePrompt}\nMarca: ${brand}\nModelo: ${model}\nMotor: ${engine}\nGerar como pagina de manual tecnico original de oficina, ultra detalhada, com composicao o mais proxima possivel do manual de referencia: areas numeradas, vista explodida central, subquadros laterais e quadro final de especificacoes tecnicas totalmente legivel. Sem fundo artistico, sem pessoas e sem estilo infantil.`;
  const models = [
    process.env.NANO_BANANA_2_MODEL,
    process.env.NANO_BANANA_MODEL,
    "gemini-2.5-flash-image-preview",
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp-image-generation",
  ].filter((value): value is string => Boolean(value));

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
