import React from "react";

type TorqueSpec = {
  component: string;
  sequence: string;
  value: string;
};

function headerBar(label: string) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        minHeight: 54,
        padding: "0 14px",
        background: "#b7dde6",
        borderRadius: 10,
        fontSize: 21,
        fontWeight: 900,
      }}
    >
      {label}
    </div>
  );
}

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
      ? ["eixo piloto", "sincronizadores", "calcos", "folga axial"]
      : isVEngine
        ? ["banco a", "banco b", "turbo", "sincronismo"]
        : ["mancais", "cabecote", "biela fraturada", "camisas"]
  ).slice(0, 4);

  const torqueRows = torqueSpecs.slice(0, 4);
  const specRows = [...measureLines, ...referenceLines].slice(0, 6);
  const sequenceOrder = isGearbox
    ? ["1", "3", "5", "7", "8", "6", "4", "2"]
    : isVEngine
      ? ["1", "4", "8", "5", "2", "3", "7", "6"]
      : ["1", "3", "7", "26", "23", "26", "25", "2", "4", "5", "16", "15", "22", "10", "14", "18", "19", "23", "25", "26"];

  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 16,
        background: "linear-gradient(180deg, #e8edf0 0%, #ece6db 100%)",
        color: "#111827",
        fontFamily: "MTManual, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 74,
          border: "3px solid #1f2937",
          borderRadius: 12,
          background: "#f5f7f8",
          fontSize: 33,
          fontWeight: 900,
          letterSpacing: 0.5,
          textAlign: "center",
          padding: "0 10px",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 1040, gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8, flex: 1 }}>
            {headerBar(isGearbox ? "CAIXA E EIXOS PRINCIPAIS" : "BLOCO E PARTE INFERIOR")}
            <div style={{ display: "flex", fontSize: 18, fontWeight: 900 }}>{isGearbox ? "ENGRENAGENS E ALOJAMENTOS" : "BRONZINAS DE MANCAL (CAPA)"}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "stretch", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 20px" }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`arr-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ display: "flex", width: 28, height: 28, borderRadius: 999, background: "#f0a053", border: "2px solid #8a5115", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900 }}>{index + 1}</div>
                      <div style={{ display: "flex", width: 3, height: 26, background: "#000" }} />
                      <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "16px solid #ef8a28" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "4px solid #516170", background: "#dbe2e7" }} />
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`main-${index}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex", width: 16, height: 74, borderRadius: 8, background: "#50616d", border: "2px solid #29323a" }} />
                      <div style={{ display: "flex", width: 28, height: 98, borderRadius: 14, background: "#b7c2ca", border: "3px solid #29323a" }} />
                    </div>
                  ))}
                  <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "4px solid #516170", background: "#dbe2e7" }} />
                </div>

                <div style={{ display: "flex", width: "100%", height: 120, borderRadius: 10, background: "#98a6ae", border: "3px solid #29323a", justifyContent: "space-around", alignItems: "center" }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`bolt-${index}`} style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: "#83919b", border: "2px solid #29323a" }} />
                  ))}
                </div>

                <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#475569" }}>SEQUENCIA DE APERTO E VISTA DA PARTE INFERIOR DO CONJUNTO</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", width: 320, gap: 8 }}>
                <div style={{ display: "flex", flex: 1, borderRadius: 10, background: "#ebe2c8", border: "2px solid #d0c3a2", padding: 10, position: "relative", overflow: "hidden" }}>
                  {illustrationDataUrl ? (
                    <img src={illustrationDataUrl} alt="referencia" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: 0.4 }}>
                      <div style={{ display: "flex", width: 180, height: 38, border: "2px solid #475569", borderRadius: 8 }} />
                      <div style={{ display: "flex", width: 210, height: 90, border: "2px solid #475569", borderRadius: 8 }} />
                      <div style={{ display: "flex", width: 120, height: 60, border: "2px solid #475569", borderRadius: 8 }} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", border: "2px solid #d0c3a2", borderRadius: 10, background: "#efd7a8", padding: 8, gap: 6 }}>
                  <div style={{ display: "flex", fontSize: 15, fontWeight: 900 }}>SEQUENCIA DE APERTO (CENTRO PARA FORA)</div>
                  {torqueRows.map((item, index) => (
                    <div key={`${item.component}-${index}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, borderBottom: "1px solid #b99b61", paddingBottom: 3 }}>
                      <div style={{ display: "flex" }}>{`${index + 1} ETAPA`}</div>
                      <div style={{ display: "flex" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, minHeight: 280 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
              {headerBar(isGearbox ? "SINCRONIZADORES" : "BIELAS (CAPA FRATURADA)")}
              <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                <div style={{ display: "flex", width: 72, height: 72, borderRadius: 999, border: "6px solid #3d4756" }} />
                <div style={{ display: "flex", width: 68, height: 164, borderRadius: 22, background: "#d5dce3", border: "5px solid #3d4756", transform: "rotate(30deg)" }} />
                <div style={{ display: "flex", width: 36, height: 36, borderRadius: 999, border: "6px solid #3d4756" }} />
              </div>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#7c2d12" }}>{noteLines[0] || "ORIENTACAO E ENCAIXE DEVEM SER CONFERIDOS"}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1.15, border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
              {headerBar(isGearbox ? "DADOS E TOLERANCIAS" : "ESPECIFICACOES DA BIELA")}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {specRows.map((item, index) => (
                  <div key={`${item}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: index % 2 === 0 ? "#f0d592" : "#edd38a", border: "1px solid #b99b61", padding: "5px 8px", fontSize: 14, fontWeight: 800 }}>
                    <div style={{ display: "flex", flex: 1 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 520, gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
            {headerBar(isGearbox ? "REGULAGEM SUPERIOR" : "MONTAGEM SUPERIOR")}
            <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>{isGearbox ? "CALCOS E PRE-CARGA" : "PARA FUSOS DO CABECOTE"}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8, borderRadius: 10, background: "#d9d2c4", border: "2px solid #c7b89a" }}>
              {sequenceOrder.map((item, index) => (
                <div key={`${item}-${index}`} style={{ display: "flex", width: 30, height: 30, borderRadius: 999, alignItems: "center", justifyContent: "center", background: "#f0a053", border: "2px solid #8a5115", fontSize: 13, fontWeight: 900 }}>{item}</div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 15, fontWeight: 900 }}>PADRAO CARACOL</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8, flex: 1 }}>
            {headerBar(isGearbox ? "SINCRONISMO" : "SINCRONISMO E REGULAGEM")}
            <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>{isGearbox ? "ACOPLAMENTO DE EIXOS" : "SINCRONISMO DO COMANDO"}</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", position: "relative", width: 300, height: 210, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", width: 94, height: 94, borderRadius: 999, border: "5px solid #4b5563" }} />
                <div style={{ display: "flex", width: 94, height: 94, borderRadius: 999, border: "5px solid #4b5563" }} />
                <div style={{ display: "flex", position: "absolute", left: 106, bottom: 4, width: 66, height: 66, borderRadius: 999, background: "#94a3b8", border: "4px solid #475569" }} />
                <div style={{ display: "flex", position: "absolute", left: 50, top: 28, width: 200, height: 120, borderLeft: "5px solid #0f766e", borderRight: "5px solid #0f766e", borderTop: "5px solid #0f766e", borderBottom: "5px solid transparent", borderRadius: 18 }} />
              </div>
            </div>
            {regulationLines.slice(0, 3).map((item) => (
              <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 800 }}>{item}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8, flex: 1 }}>
            {headerBar(isGearbox ? "ESPECIFICACOES ADICIONAIS" : "ESPECIFICACOES ADICIONAIS DO CABECOTE")}
            <div style={{ display: "flex", gap: 14, flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, width: 220 }}>
                <div style={{ display: "flex", width: 94, height: 72, background: "#bcc8cf", border: "3px solid #475569", borderRadius: 6 }} />
                <div style={{ display: "flex", width: 150, height: 56, background: "#d9e2e8", border: "3px solid #475569", clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)" }} />
                <div style={{ display: "flex", width: 56, height: 110, background: "#e9b384" }} />
                <div style={{ display: "flex", width: 94, height: 112, background: "#bcc8cf", border: "3px solid #475569", borderRadius: 6, alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, background: "#94a3b8", border: "2px solid #475569" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "center" }}>
                {measureLines.slice(0, 4).map((item) => (
                  <div key={item} style={{ display: "flex", fontSize: 16, fontWeight: 900, color: "#111827" }}>{item}</div>
                ))}
                <div style={{ display: "flex", height: 2, background: "#c58b33", marginTop: 4, marginBottom: 4 }} />
                {focusItems.map((item) => (
                  <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#7c2d12" }}>{item.toUpperCase()}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, minHeight: 170 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
              {headerBar(isGearbox ? "VERIFICACAO" : "REGULAGEM DOS INJETORES")}
              {noteLines.slice(0, 3).map((item) => (
                <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 800 }}>{item}</div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
              {headerBar(isGearbox ? "MEDIDAS" : "PARAFUSO E LIMITE")}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <div style={{ display: "flex", width: 40, height: 10, background: "#95a4ae" }} />
                <div style={{ display: "flex", width: 150, height: 10, background: "#95a4ae" }} />
                <div style={{ display: "flex", width: 16, height: 16, borderRadius: 999, background: "#95a4ae" }} />
              </div>
              <div style={{ display: "flex", fontSize: 16, fontWeight: 900, color: "#7c2d12" }}>{referenceLines[0] || `MOTOR: ${engine}`}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", borderRadius: 10, background: "#0b3040", padding: 12, gap: 4 }}>
        <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>RESUMO TECNICO</div>
        <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#dbeafe" }}>{`FAMILIA: ${matchedFamily} • APLICACAO: ${matchedApplication} • ANOS: ${matchedYears}`}</div>
        <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#dbeafe" }}>{aiMode ? "MODO IA ATIVO PARA REFINO VISUAL E TECNICO" : "MODO TECNICO LOCAL"}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "#d7c67a", minHeight: 42, fontSize: 17, fontWeight: 900, color: "#312100" }}>
        DICA: USE OLEO LIMPO NAS ROSCAS E SUBSTITUA FIXADORES DE APERTO ANGULAR
      </div>
    </div>
  );
}
