import React from "react";

type TorqueSpec = {
  component: string;
  sequence: string;
  value: string;
};

export function createAssemblyDiagramElement({
  title,
  engine,
  variant,
  torqueSpecs,
  regulationLines,
  measureLines,
  noteLines,
  referenceLines,
  matchedFamily,
  matchedApplication,
  matchedYears,
  aiMode,
  illustrationDataUrl,
  componentFocus,
}: {
  title: string;
  engine: string;
  variant: "inline" | "gearbox" | "v-engine";
  torqueSpecs: TorqueSpec[];
  regulationLines: string[];
  measureLines: string[];
  noteLines: string[];
  referenceLines: string[];
  matchedFamily: string;
  matchedApplication: string;
  matchedYears: string;
  aiMode: boolean;
  illustrationDataUrl?: string | null;
  componentFocus?: string[];
}) {
  const isGearbox = variant === "gearbox";
  const isVEngine = variant === "v-engine";
  const focusItems = (componentFocus?.length
    ? componentFocus
    : isGearbox
      ? ["eixo piloto", "engrenagens", "sincronizadores", "folga axial"]
      : isVEngine
        ? ["bancada A", "bancada B", "turbo", "sincronismo"]
        : ["cabecote", "camisas", "bielas", "lubrificacao"]
  ).slice(0, 4);

  const sequenceOrder = isGearbox
    ? ["1", "3", "5", "7", "8", "6", "4", "2"]
    : isVEngine
      ? ["1", "4", "8", "5", "2", "3", "7", "6"]
      : ["9", "5", "1", "3", "7", "11", "12", "8", "4", "2", "6", "10"];

  const summaryItems = [
    `Familia: ${matchedFamily}`,
    `Aplicacao: ${matchedApplication}`,
    `Anos: ${matchedYears}`,
    ...(referenceLines || []).slice(0, 3),
    ...(noteLines || []).slice(0, 2),
    aiMode ? "Modo IA multi-provider ativo para refinamento tecnico." : "Modo tecnico local com padrao de oficina.",
  ].slice(0, 8);

  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        background: "#e8e2d6",
        color: "#0f172a",
        fontFamily: "MTManual",
        padding: 18,
        gap: 12,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "3px solid #1f2937",
          borderRadius: 16,
          background: "#f6f2ea",
          padding: "12px 18px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 800 }}>MT DIESEL ESQUEMAS • PRANCHA DE OFICINA</div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 800 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#475569" }}>{engine.toUpperCase()}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 16, fontWeight: 800 }}>LAYOUT TECNICO REALISTA</div>
          <div style={{ display: "flex", fontSize: 15, fontWeight: 700 }}>{isGearbox ? "TRANSMISSAO" : isVEngine ? "MOTOR V" : "MOTOR EM LINHA"}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          border: "2px solid #94a3b8",
          borderRadius: 12,
          background: "#edf3f6",
          padding: "8px 12px",
          gap: 18,
          fontSize: 15,
          fontWeight: 800,
        }}
      >
        <div style={{ display: "flex" }}>DESENHO DE MONTAGEM</div>
        <div style={{ display: "flex" }}>SEQUENCIA DE APERTO</div>
        <div style={{ display: "flex" }}>MEDICOES CRITICAS</div>
        <div style={{ display: "flex" }}>FECHAMENTO FINAL</div>
      </div>

      <div style={{ display: "flex", gap: 14, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 980, gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #cbd5e1", borderRadius: 16, background: "#f8fafc", padding: 14, gap: 10, flex: 1 }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 800 }}>VISTA PRINCIPAL DO CONJUNTO</div>
            {illustrationDataUrl ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <img src={illustrationDataUrl} alt="Base mecanica IA" style={{ width: 930, height: 320, objectFit: "cover", borderRadius: 12, border: "3px solid #334155" }} />
                <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#475569" }}>REFERENCIA MECANICA GERADA POR IA</div>
              </div>
            ) : null}

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`inj-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ display: "flex", width: 8, height: 28, background: "#64748b", borderRadius: 4 }} />
                      <div style={{ display: "flex", width: 22, height: 16, borderRadius: 4, background: "#d1d9df", border: "2px solid #334155" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", width: isVEngine ? 440 : 520, height: 60, borderRadius: 12, background: "#dbe4ea", border: "3px solid #334155" }} />
                <div style={{ display: "flex", width: isVEngine ? 520 : 620, height: 110, borderRadius: 16, background: "#9aa8b4", border: "3px solid #334155", alignItems: "center", justifyContent: "space-around", padding: "0 16px" }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`cyl-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: "#6b7b87", border: "2px solid #334155" }} />
                      <div style={{ display: "flex", width: 26, height: 42, borderRadius: 7, background: "#dfe5ea", border: "2px solid #334155" }} />
                      <div style={{ display: "flex", width: 18, height: 18, borderRadius: 5, background: "#f2c48d", border: "2px solid #8c5a2b" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 76, height: 76, borderRadius: 999, background: "#d9e0e5", border: "4px solid #334155" }}>
                    <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, background: "#93a1ac", border: "3px solid #334155" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", width: isVEngine ? 340 : 430, height: 8, background: "#1f2937", borderRadius: 6 }} />
                    <div style={{ display: "flex", width: isVEngine ? 340 : 430, height: 8, background: "#1f2937", borderRadius: 6 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 66, height: 66, borderRadius: 999, background: "#d9e0e5", border: "4px solid #334155" }}>
                    <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, background: "#93a1ac", border: "3px solid #334155" }} />
                  </div>
                </div>
                <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#334155" }}>VISTA EXPLODIDA DE BLOCO, CABECOTE, ACIONAMENTO E CONJUNTO MOVEL</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", width: 230, border: "2px solid #c5b89c", borderRadius: 12, background: "#efe5d0", padding: 10, gap: 8 }}>
                <div style={{ display: "flex", fontSize: 17, fontWeight: 800 }}>LEGENDA TECNICA</div>
                {focusItems.map((item, index) => (
                  <div key={`${item}-${index}`} style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#7c2d12" }}>
                    {`${index + 1}. ${item.toUpperCase()}`}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", border: "3px solid #cbd5e1", borderRadius: 16, background: "#f8fafc", padding: 14, gap: 16, minHeight: 210 }}>
            <div style={{ display: "flex", flexDirection: "column", width: 260, gap: 8 }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 800 }}>{isGearbox ? "EIXO E FIXACAO" : "BIELA E PISTAO"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", width: 54, height: 54, borderRadius: 999, border: "4px solid #374151" }} />
                <div style={{ display: "flex", width: 56, height: 116, borderRadius: 18, background: "#d8dee6", border: "4px solid #374151", transform: "rotate(26deg)" }} />
                <div style={{ display: "flex", width: 28, height: 28, borderRadius: 999, border: "4px solid #374151" }} />
              </div>
              <div style={{ display: "flex", padding: "4px 8px", borderRadius: 999, background: "#efe5d0", fontSize: 14, fontWeight: 800, color: "#7c2d12" }}>ORIENTACAO DE MONTAGEM</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 6 }}>
              <div style={{ display: "flex", fontSize: 18, fontWeight: 800 }}>OBSERVACOES DE FECHAMENTO</div>
              {noteLines.slice(0, 4).map((item) => (
                <div key={item} style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#334155" }}>{item}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 560, gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #cbd5e1", borderRadius: 16, background: "#f8fafc", padding: 14, gap: 10 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800 }}>SEQUENCIA DE APERTO</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {sequenceOrder.map((item) => (
                <div key={item} style={{ display: "flex", width: 30, height: 30, borderRadius: 999, alignItems: "center", justifyContent: "center", background: "#f1a24e", border: "2px solid #9a5808", fontSize: 14, fontWeight: 800 }}>{item}</div>
              ))}
            </div>
            {torqueSpecs.map((item) => (
              <div key={`${item.component}-${item.value}`} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 10px", borderRadius: 10, background: "#fff7ed" }}>
                <div style={{ display: "flex", fontSize: 16, fontWeight: 800 }}>{item.component}</div>
                <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#475569" }}>{item.sequence}</div>
                <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#7c2d12" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #cbd5e1", borderRadius: 16, background: "#f8fafc", padding: 14, gap: 10, flex: 1 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800 }}>{isGearbox ? "ENGRENAMENTO" : "SINCRONISMO"}</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 10 }}>
              <div style={{ display: "flex", position: "relative", width: 320, height: 180, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", width: 88, height: 88, borderRadius: 999, border: "5px solid #475569" }} />
                <div style={{ display: "flex", width: 88, height: 88, borderRadius: 999, border: "5px solid #475569" }} />
                <div style={{ display: "flex", position: "absolute", left: 102, top: 92, width: 60, height: 60, borderRadius: 999, background: "#94a3b8", border: "4px solid #475569" }} />
                <div style={{ display: "flex", position: "absolute", left: 43, top: 20, width: 70, height: 120, borderLeft: "5px solid #0f766e", borderRight: "5px solid #0f766e", borderTop: "5px solid #0f766e", borderBottom: "5px solid transparent", borderRadius: 18 }} />
                <div style={{ display: "flex", position: "absolute", left: 208, top: 20, width: 70, height: 120, borderLeft: "5px solid #0f766e", borderRight: "5px solid #0f766e", borderTop: "5px solid #0f766e", borderBottom: "5px solid transparent", borderRadius: 18 }} />
              </div>
            </div>
            {regulationLines.slice(0, 4).map((item) => (
              <div key={item} style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#334155" }}>{item}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #cbd5e1", borderRadius: 16, background: "#f8fafc", padding: 14, gap: 10, flex: 1 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800 }}>{isGearbox ? "MEDICOES E CALCOS" : "MEDICOES DO CABECOTE"}</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, paddingTop: 8, paddingBottom: 4 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", width: 72, height: 72, background: "#bcc8cf", border: "3px solid #475569", borderRadius: 6 }} />
                <div style={{ display: "flex", width: 46, height: 100, background: "#eab384" }} />
                <div style={{ display: "flex", width: 84, height: 84, background: "#bcc8cf", border: "3px solid #475569", borderRadius: 6, justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: "#94a3b8", border: "2px solid #475569" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", width: 60, height: 2, background: "#c2410c" }} />
                <div style={{ display: "flex", width: 2, height: 100, background: "#c2410c" }} />
                <div style={{ display: "flex", width: 60, height: 2, background: "#c2410c" }} />
              </div>
            </div>
            {measureLines.slice(0, 5).map((item) => (
              <div key={item} style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#7c2d12" }}>{item}</div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #cbd5e1", borderRadius: 16, background: "#f8fafc", padding: 14, gap: 8 }}>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 800 }}>VERIFICACAO FINAL</div>
            {referenceLines.slice(0, 4).map((item) => (
              <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#334155" }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", borderRadius: 14, background: "#0b3040", padding: 18, gap: 8 }}>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>RESUMO TECNICO E REFERENCIAS</div>
        {summaryItems.map((item) => (
          <div key={item} style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#dbeafe" }}>{item}</div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", borderRadius: 10, background: "#e9d9a3", padding: "8px 12px", fontSize: 16, fontWeight: 800, color: "#7c2d12" }}>
        DICA DE OFICINA: LUBRIFIQUE ROSCAS, SIGA A SEQUENCIA DE APERTO E CONFIRA O PMS ANTES DA PARTIDA.
      </div>
    </div>
  );
}
