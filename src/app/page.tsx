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

type HistoryItem = {
  _id?: string;
  brand?: string;
  model?: string;
  engine?: string;
  chassis?: string;
  createdAt?: string;
};

type SearchResponse = {
  aiSummary: string;
  generatedAt: string;
  schemaImageUrl: string;
  storageMode: "mongodb" | "demo";
  suggestions: string[];
  publicData: {
    sourceLabel: string;
    modelHints?: string[];
    vinDecode?: Record<string, string> | null;
    wiki?: {
      title: string;
      extract: string;
      image?: string | null;
      url?: string | null;
    } | null;
  };
  results: ResultItem[];
};

const presets = [
  { label: "Iveco Cursor 13", brand: "Iveco", model: "Cursor 13", engine: "F3B 380", chassis: "" },
  { label: "Cummins ISX", brand: "Cummins", model: "ISX 450", engine: "X15", chassis: "" },
  { label: "Volvo D13", brand: "Volvo", model: "D13", engine: "D13K", chassis: "" },
];

const initialFilters = presets[0];

export default function Home() {
  const [filters, setFilters] = useState(initialFilters);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadHistory();
    void handleSearch(undefined, initialFilters);

    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("motor-schema-favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, []);

  async function loadHistory() {
    try {
      const response = await fetch("/api/history", { cache: "no-store" });
      const data = await response.json();
      setHistory(data.items || []);
    } catch {
      setHistory([]);
    }
  }

  async function handleSearch(event?: FormEvent<HTMLFormElement>, forcedFilters = filters) {
    if (event) {
      event.preventDefault();
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      Object.entries(forcedFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Falha ao consultar o esquema.");
      }

      setResult(data);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível processar sua busca agora.");
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset: (typeof presets)[number]) {
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
                Busca inteligente de esquemas de montagem de motor
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Pesquise por marca, modelo, código do motor ou chassi. O sistema cruza catálogo técnico,
                APIs públicas e gera uma imagem SVG pronta para consulta em oficina ou engenharia.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">🔎 Busca por marca, modelo e VIN</div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">🧠 Imagem técnica gerada automaticamente</div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">☁️ Pronto para Vercel + MongoDB</div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSearch} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Consultar esquema</h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                React + Next.js
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
                <span className="text-sm text-slate-300">Modelo</span>
                <input
                  value={filters.model}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                  placeholder="Ex.: Cursor 13"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400"
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
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Chassi / VIN</span>
                <input
                  value={filters.chassis}
                  onChange={(e) => setFilters({ ...filters, chassis: e.target.value })}
                  placeholder="Ex.: 9BWZZZ377VT004251"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                {loading ? "Buscando..." : "Gerar esquema"}
              </button>
              <a
                href={result?.schemaImageUrl ? `${result.schemaImageUrl}&download=1` : "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-cyan-400"
              >
                Baixar SVG
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

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <h2 className="text-xl font-bold">Funcionalidades incluídas</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>✅ Busca por marca, modelo, motor e chassi</li>
              <li>✅ Integração com APIs públicas de veículos</li>
              <li>✅ Geração visual do esquema em SVG</li>
              <li>✅ Histórico de pesquisas</li>
              <li>✅ Favoritos no navegador</li>
              <li>✅ Base pronta para MongoDB Atlas</li>
              <li>✅ Estrutura pronta para deploy no GitHub e Vercel</li>
            </ul>

            <div className="mt-5 rounded-2xl bg-slate-800 p-4 text-sm">
              <p className="text-slate-300">Modo de armazenamento</p>
              <p className="mt-1 font-semibold text-white">
                {result?.storageMode === "mongodb" ? "MongoDB Atlas conectado" : "Demo local pronta para Atlas"}
              </p>
            </div>
          </div>
        </section>

        {result ? (
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Esquema gerado</h2>
                  <p className="text-sm text-slate-400">Baseado no catálogo interno, APIs públicas e análise heurística.</p>
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
                alt="Esquema técnico gerado"
                className="w-full rounded-2xl border border-slate-700 bg-white"
              />

              <div className="mt-4 rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-50">
                {result.aiSummary}
              </div>
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

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                <h3 className="text-xl font-bold">Dados públicos</h3>
                <div className="mt-3 space-y-3 text-sm text-slate-300">
                  <p>
                    <strong className="text-white">Fonte:</strong> {result.publicData.sourceLabel}
                  </p>
                  {result.publicData.vinDecode?.Make ? (
                    <p>
                      <strong className="text-white">Fabricante pelo chassi:</strong> {result.publicData.vinDecode.Make}
                    </p>
                  ) : null}
                  {result.publicData.vinDecode?.Model ? (
                    <p>
                      <strong className="text-white">Modelo pelo chassi:</strong> {result.publicData.vinDecode.Model}
                    </p>
                  ) : null}
                  {result.publicData.modelHints?.length ? (
                    <p>
                      <strong className="text-white">Modelos relacionados:</strong> {result.publicData.modelHints.join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>

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

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <h3 className="text-xl font-bold">Sugestões da busca</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(result?.suggestions || ["Busque um motor para receber sugestões automáticas."]).map((item) => (
                <span key={item} className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <h3 className="text-xl font-bold">Histórico recente</h3>
            <div className="mt-3 space-y-2">
              {history.map((item) => (
                <button
                  key={`${item._id || item.chassis}-${item.createdAt}`}
                  type="button"
                  onClick={() =>
                    applyPreset({
                      label: `${item.brand || "Motor"} ${item.model || ""}`.trim(),
                      brand: item.brand || "",
                      model: item.model || "",
                      engine: item.engine || "",
                      chassis: item.chassis || "",
                    })
                  }
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-800 px-3 py-3 text-left text-sm hover:bg-slate-700"
                >
                  <span>
                    {item.brand || "Motor"} {item.model || ""} {item.engine ? `• ${item.engine}` : ""}
                  </span>
                  <span className="text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString("pt-BR") : "demo"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
