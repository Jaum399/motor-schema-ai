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
  { label: "Scania DC12 420", brand: "Scania", engine: "DC12 420", model: "124 420" },
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

  const mainResult = result?.results?.[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-6 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Motor Schema AI
              </span>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                Busque esquemas por marca e motor
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Informe apenas a marca e o código do motor. O sistema cruza referências técnicas, histórico mecânico
                enviado no chat e gera uma imagem JPG detalhada com etapas, torques e pontos críticos de montagem.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">🔎 Busca simplificada por marca e motor</div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">🖼️ Imagem JPG técnica detalhada</div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">☁️ Catálogo pronto para produção</div>
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
                {aiLoading ? "IA gerando..." : "Gerar por IA"}
              </button>
              <a
                href={result?.schemaImageUrl ? `${result.schemaImageUrl}&download=1` : "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-cyan-400"
              >
                Baixar JPG
              </a>
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
                  <h2 className="text-2xl font-bold">Foto de referência + esquema técnico</h2>
                  <p className="text-sm text-slate-400">Fontes visuais em alta qualidade para comparar com o manual gerado.</p>
                  {result?.aiProvider ? (
                    <span className="mt-2 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
                      IA ativa: {result.aiProvider === "gemini" ? "Gemini" : "Assistente local"}
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

              {result.publicData.photoGallery?.[0] ? (
                <div className="mb-4 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                  <img
                    src={result.publicData.photoGallery[0].src}
                    alt={result.publicData.photoGallery[0].title}
                    className="h-72 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-slate-300">
                    <span>Referência visual: {result.publicData.photoGallery[0].source}</span>
                    {result.publicData.photoGallery[0].sourceUrl ? (
                      <a
                        href={result.publicData.photoGallery[0].sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        Abrir fonte
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

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
                      <a
                        href={result?.schemaImageUrl ? `${result.schemaImageUrl}&download=1` : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-violet-500 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Aprovar e baixar JPG
                      </a>
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

              {result.publicData.photoGallery?.length ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                  <h3 className="text-xl font-bold">Fotos de referência</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {result.publicData.photoGallery.slice(0, 4).map((image) => (
                      <a
                        key={`${image.src}-${image.source}`}
                        href={image.sourceUrl || image.src}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950"
                      >
                        <img src={image.src} alt={image.title} className="h-36 w-full object-cover" />
                        <div className="px-3 py-2 text-xs text-slate-300">{image.source}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {result.publicData.wiki ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                  <h3 className="text-xl font-bold">Contexto técnico extra</h3>
                  {result.publicData.wiki.image ? (
                    <img
                      src={result.publicData.wiki.image}
                      alt={result.publicData.wiki.title}
                      className="mt-3 h-40 w-full rounded-2xl object-cover"
                    />
                  ) : null}
                  <p className="mt-3 text-sm text-slate-300">{result.publicData.wiki.extract}</p>
                  {result.publicData.wiki.url ? (
                    <a
                      href={result.publicData.wiki.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      Abrir fonte pública
                    </a>
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
        <p className="font-semibold text-slate-200">MT Diesel</p>
        <p>© 2026 MT DIESEL PARANATINGA</p>
        <p>CNPJ 30.399.905/0001-47</p>
      </footer>
    </div>
  );
}
