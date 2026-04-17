"use client";

import { FormEvent, useEffect, useState } from "react";

type TorqueSpec = {
  component: string;
  sequence: string;
  value: string;
};

type ResultItem = {
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
};

type SearchResponse = {
  aiSummary: string;
  aiProvider?: string;
  aiBlueprint?: {
    headline: string;
    warnings: string[];
    detailLines: string[];
    recommendedSequence: string[];
  };
  generatedAt: string;
  schemaImageUrl: string;
  storageMode: "mongodb" | "demo";
  suggestions: string[];
  publicData: {
    sourceLabel: string;
    sourceList?: string[];
    duckAnswer?: string | null;
    modelHints?: string[];
    photoGallery?: {
      src: string;
      title: string;
      source: string;
      sourceUrl?: string | null;
    }[];
    wiki?: {
      title: string;
      extract: string;
      image?: string | null;
      url?: string | null;
    } | null;
  };
  results: ResultItem[];
};

type SearchForm = {
  label: string;
  brand: string;
  engine: string;
  model?: string;
};

const presets: SearchForm[] = [
  { label: "Iveco F3B 380", brand: "Iveco", engine: "F3B 380", model: "Cursor 13" },
  { label: "Mercedes OM352", brand: "Mercedes-Benz", engine: "OM352", model: "OM352" },
  { label: "Mercedes OM457", brand: "Mercedes-Benz", engine: "OM457", model: "OM457" },
  { label: "Volvo D13", brand: "Volvo", engine: "D13", model: "D13" },
  { label: "Scania DC12 420", brand: "Scania", engine: "DC12 420", model: "124 420" },
  { label: "Scania V8", brand: "Scania", engine: "V8", model: "V8" },
  { label: "MWM X10", brand: "MWM", engine: "X10 6 cilindros", model: "X10" },
  { label: "Cummins 6TAA", brand: "Cummins", engine: "6TAA 6.304", model: "6TAA 6.304" },
  { label: "Mercedes G211", brand: "Mercedes-Benz", engine: "G211-16 Câmbio", model: "G211-16" },
];

const initialFilters: SearchForm = presets[0];

async function parseJsonSafe(response: Response) {
  const raw = await response.text();

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function Home() {
  const [filters, setFilters] = useState<SearchForm>(initialFilters);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [error, setError] = useState("");
  const isAppMode = typeof window !== "undefined" && (window.location.protocol === "capacitor:" || /android|wv/i.test(navigator.userAgent));

  useEffect(() => {
    void handleSearch(undefined, initialFilters);

    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("motor-schema-favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, []);

  async function handleSearch(event?: FormEvent<HTMLFormElement>, forcedFilters = filters) {
    if (event) {
      event.preventDefault();
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (forcedFilters.brand) params.set("brand", forcedFilters.brand);
      if (forcedFilters.engine) params.set("engine", forcedFilters.engine);
      if (forcedFilters.model) params.set("model", forcedFilters.model);

      const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store" });
      const data = await parseJsonSafe(response);

      if (!response.ok) {
        throw new Error(data?.error || "Falha ao consultar o esquema.");
      }

      setResult(data);
      setShowAiPreview(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível processar sua busca agora.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateWithAI() {
    setAiLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filters.brand) params.set("brand", filters.brand);
      if (filters.engine) params.set("engine", filters.engine);
      if (filters.model) params.set("model", filters.model);

      const response = await fetch(`/api/generate-ai?${params.toString()}`, { cache: "no-store" });
      const data = await parseJsonSafe(response);

      if (!response.ok) {
        throw new Error(data?.error || "Falha ao gerar o esquema com IA.");
      }

      setResult(data);
      setShowAiPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "A IA não conseguiu gerar o esquema agora.");
    } finally {
      setAiLoading(false);
    }
  }

  function applyPreset(preset: SearchForm) {
    setFilters(preset);
    void handleSearch(undefined, preset);
  }

  function toggleFavorite(id: string) {
    const updated = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];

    setFavorites(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("motor-schema-favorites", JSON.stringify(updated));
    }
  }

  function openInApp(url?: string | null) {
    if (!url || typeof window === "undefined") {
      return;
    }

    window.location.assign(url);
  }

  function openSchemaPreview() {
    if (!result?.schemaImageUrl) {
      return;
    }

    if (isAppMode) {
      openInApp(result.schemaImageUrl);
      return;
    }

    window.open(result.schemaImageUrl, "_blank", "noopener,noreferrer");
  }

  function openSchemaDownload() {
    if (!result?.schemaImageUrl) {
      return;
    }

    const finalUrl = `${result.schemaImageUrl}&download=1`;

    if (isAppMode) {
      openInApp(finalUrl);
      return;
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  }

  function openExternalReference(url?: string | null) {
    if (!url) {
      return;
    }

    if (isAppMode) {
      openInApp(url);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  const mainResult = result?.results?.[0];
  const aiProviderLabel = result?.aiProvider === "gemini"
    ? "Gemini"
    : result?.aiProvider === "openai"
      ? "ChatGPT"
      : result?.aiProvider === "openrouter"
        ? "OpenRouter"
        : "Assistente local";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-6 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                MT DIESEL ESQUEMAS
              </span>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                Esquemas detalhados estilo manual de oficina
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Informe a marca e o motor para gerar um esquema técnico detalhado, com padrão visual inspirado no manual
                do OM352, mais detalhes mecânicos no desenho e variações para outros motores da linha diesel.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 font-semibold">MT DIESEL</div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">🛠️ Esquema mecânico detalhado</div>
            </div>
          </div>
        </section>

        <section>
          <form onSubmit={handleSearch} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Consultar esquema</h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Busca objetiva
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Marca</span>
                <input
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  placeholder="Ex.: Iveco"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Motor</span>
                <input
                  value={filters.engine}
                  onChange={(e) => setFilters({ ...filters, engine: e.target.value })}
                  placeholder="Ex.: F3B 380"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                {loading ? "Buscando..." : "Gerar imagem JPG"}
              </button>
              <button
                type="button"
                onClick={handleGenerateWithAI}
                className="rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-white hover:bg-violet-400"
              >
                {aiLoading ? "Gemini gerando..." : "Gerar com Gemini"}
              </button>
              <button
                type="button"
                onClick={openSchemaPreview}
                className="rounded-2xl border border-cyan-500/60 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-100 hover:border-cyan-400"
              >
                {isAppMode ? "Abrir imagem no app" : "Abrir imagem"}
              </button>
              <button
                type="button"
                onClick={openSchemaDownload}
                className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-cyan-400"
              >
                Baixar imagem
              </button>
              {!isAppMode ? (
                <a
                  href="/downloads/MT-DIESEL-ESQUEMAS.apk"
                  className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-200 hover:border-emerald-400"
                >
                  Baixar APK Android
                </a>
              ) : null}
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-cyan-400"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </form>
        </section>

        {result ? (
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Esquema técnico detalhado</h2>
                  <p className="text-sm text-slate-400">Visual mecânico focado somente no esquema gerado em padrão de manual.</p>
                  {result?.aiProvider ? (
                    <span className="mt-2 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
                      IA ativa: {aiProviderLabel}
                    </span>
                  ) : null}
                </div>
                {mainResult ? (
                  <button
                    type="button"
                    onClick={() => toggleFavorite(mainResult.id)}
                    className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm text-amber-200"
                  >
                    {favorites.includes(mainResult.id) ? "★ Favorito salvo" : "☆ Salvar favorito"}
                  </button>
                ) : null}
              </div>

              <img
                src={result.schemaImageUrl}
                alt="Imagem JPG do esquema técnico"
                className="w-full rounded-2xl border border-slate-700 bg-white"
              />

              <div className="mt-4 rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-50">
                {result.aiSummary}
              </div>

              {showAiPreview ? (
                <div className="mt-4 rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-violet-100">Pré-visualização automática gerada por IA</p>
                      <p className="text-sm text-violet-200">Confirme se o esquema está de acordo antes de baixar.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAiPreview(false)}
                        className="rounded-xl border border-violet-300/40 px-3 py-2 text-sm font-semibold text-violet-100"
                      >
                        Confirmar visualização
                      </button>
                      <button
                        type="button"
                        onClick={openSchemaDownload}
                        className="rounded-xl bg-violet-500 px-3 py-2 text-sm font-semibold text-white"
                      >
                        {isAppMode ? "Abrir JPG no app" : "Aprovar e baixar JPG"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                <h3 className="text-xl font-bold">Melhor resultado</h3>
                {mainResult ? (
                  <div className="mt-3 space-y-3 text-sm text-slate-300">
                    <p>
                      <strong className="text-white">Motor:</strong> {mainResult.brand} {mainResult.model} • {mainResult.engineCode}
                    </p>
                    <p>
                      <strong className="text-white">Aplicação:</strong> {mainResult.application}
                    </p>
                    <p>
                      <strong className="text-white">Resumo:</strong> {mainResult.summary}
                    </p>
                    <div>
                      <p className="mb-2 font-semibold text-white">Torques e etapas</p>
                      <div className="space-y-2">
                        {mainResult.torqueSpecs.map((spec) => (
                          <div key={`${spec.component}-${spec.value}`} className="rounded-2xl bg-slate-800 p-3">
                            <div className="font-semibold text-slate-100">{spec.component}</div>
                            <div className="text-slate-400">{spec.sequence}</div>
                            <div className="text-cyan-300">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">Nenhum item de catálogo encontrado.</p>
                )}
              </div>

              {result.publicData.wiki ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                  <h3 className="text-xl font-bold">Observações técnicas</h3>
                  <p className="mt-3 text-sm text-slate-300">{result.publicData.wiki.extract}</p>
                  {result.publicData.wiki.url ? (
                    <button
                      type="button"
                      onClick={() => openExternalReference(result.publicData.wiki?.url)}
                      className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      {isAppMode ? "Abrir fonte no app" : "Abrir fonte pública"}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <h3 className="text-xl font-bold">Sugestões da busca</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(result?.suggestions || ["Busque uma marca ou um motor para receber sugestões automáticas."]).map((item) => (
              <span key={item} className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-200">
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-6 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
        <p className="font-semibold text-slate-200">MT DIESEL ESQUEMAS</p>
        <p>© 2026 MT DIESEL PARANATINGA</p>
        <p>CNPJ 30.399.905/0001-47</p>
      </footer>
    </div>
  );
}
