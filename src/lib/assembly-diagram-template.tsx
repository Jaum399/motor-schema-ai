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
  const specRows = [...measureLines, ...referenceLines, ...torqueRows.map((item) => `${item.component}: ${item.value}`)].slice(0, 6);
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 18px" }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`arr-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ display: "flex", width: 28, height: 28, borderRadius: 999, background: "#f0a053", border: "2px solid #8a5115", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900 }}>{index + 1}</div>
                      <div style={{ display: "flex", width: 4, height: 14, background: "#111827" }} />
                      <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "14px solid #ef8a28" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", position: "relative", width: "100%", height: 118, borderRadius: 12, background: "#c8d1d7", border: "3px solid #29323a", padding: "14px 20px", justifyContent: "space-between", alignItems: "flex-end", overflow: "hidden" }}>
                  <div style={{ display: "flex", position: "absolute", left: 18, right: 18, top: 10, height: 10, background: "#95a3ad", borderRadius: 6 }} />
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`liner-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 2 }}>
                      <div style={{ display: "flex", width: 32, height: 8, borderRadius: 4, background: "#374151" }} />
                      <div style={{ display: "flex", width: 30, height: 68, borderRadius: 10, border: "3px solid #334155", background: "#e2e8ee", justifyContent: "center", position: "relative" }}>
                        <div style={{ display: "flex", position: "absolute", top: 8, width: 18, height: 12, borderTop: "2px solid #7c2d12", borderBottom: "2px solid #7c2d12" }} />
                        <div style={{ display: "flex", position: "absolute", bottom: 8, width: 6, height: 24, borderRadius: 4, background: "#586775" }} />
                      </div>
                      <div style={{ display: "flex", width: 20, height: 12, borderRadius: 6, background: "#7e8d97", border: "2px solid #29323a" }} />
                    </div>
                  ))}
                  <div style={{ display: "flex", position: "absolute", left: 26, right: 26, bottom: 18, justifyContent: "space-between" }}>
                    {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                      <div key={`bolt-${index}`} style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: "#6b7a84", border: "2px solid #29323a" }} />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", width: "100%", height: 126, borderRadius: 10, background: "#99a6ae", border: "3px solid #29323a", justifyContent: "space-around", alignItems: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ display: "flex", position: "absolute", left: 18, right: 18, top: 54, height: 18, background: "#4f5c67", borderRadius: 10 }} />
                  <div style={{ display: "flex", position: "absolute", left: 22, right: 22, top: 24, justifyContent: "space-between" }}>
                    {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                      <div key={`cap-${index}`} style={{ display: "flex", width: 22, height: 22, borderRadius: 999, background: "#83919b", border: "2px solid #29323a" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center", padding: "0 22px", zIndex: 2 }}>
                    {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                      <div key={`throw-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ display: "flex", width: 28, height: 28, borderRadius: 999, border: "4px solid #334155", background: "#dbe2e7" }} />
                        <div style={{ display: "flex", width: 18, height: 34, borderRadius: 10, background: "#657582", transform: index % 2 === 0 ? "rotate(24deg)" : "rotate(-24deg)" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", position: "absolute", left: 16, right: 16, bottom: 12, justifyContent: "space-between" }}>
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={`rib-${index}`} style={{ display: "flex", width: 7, height: 42, borderRadius: 5, background: "#75848f" }} />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#475569" }}>VISTA EM CORTE DE CAMISAS, PISTOES, VIRABREQUIM E ALOJAMENTO</div>
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
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 92 }}>
                  <div style={{ display: "flex", width: 54, height: 150, position: "relative", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", position: "absolute", top: 0, width: 34, height: 34, borderRadius: 999, border: "5px solid #3d4756", background: "#edf2f5" }} />
                    <div style={{ display: "flex", width: 18, height: 88, borderRadius: 12, background: "#d5dce3", border: "4px solid #3d4756" }} />
                    <div style={{ display: "flex", position: "absolute", bottom: 2, width: 54, height: 54, borderRadius: 999, border: "6px solid #3d4756", background: "#eef2f5", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, border: "3px solid #c28f52" }} />
                    </div>
                    <div style={{ display: "flex", position: "absolute", bottom: 18, left: -2, width: 10, height: 10, borderRadius: 999, background: "#596775", border: "2px solid #25303a" }} />
                    <div style={{ display: "flex", position: "absolute", bottom: 18, right: -2, width: 10, height: 10, borderRadius: 999, background: "#596775", border: "2px solid #25303a" }} />
                  </div>
                  <div style={{ display: "flex", fontSize: 12, fontWeight: 900, color: "#475569" }}>VISTA FRONTAL</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 120 }}>
                  <div style={{ display: "flex", width: 86, height: 164, borderRadius: 24, background: "#d5dce3", border: "5px solid #3d4756", transform: "rotate(18deg)", position: "relative", justifyContent: "center" }}>
                    <div style={{ display: "flex", position: "absolute", top: 20, width: 24, height: 42, borderRadius: 10, border: "3px solid #8a5115" }} />
                    <div style={{ display: "flex", position: "absolute", bottom: 18, width: 10, height: 48, borderRadius: 8, background: "#667684" }} />
                    <div style={{ display: "flex", position: "absolute", bottom: 44, left: 8, right: 8, height: 2, background: "#7c2d12", borderRadius: 2 }} />
                  </div>
                  <div style={{ display: "flex", fontSize: 12, fontWeight: 900, color: "#475569" }}>VISTA LATERAL</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, width: 120, border: "2px solid #d7c7a0", borderRadius: 10, background: "#f5ecd2", padding: 8 }}>
                  <div style={{ display: "flex", width: 70, height: 36, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottom: "4px dashed #3d4756", borderLeft: "4px solid #3d4756", borderRight: "4px solid #3d4756", background: "#eef2f5" }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={`fract-${index}`} style={{ display: "flex", width: 8, height: 8, background: index % 2 === 0 ? "#7e8d97" : "#c2cad1", border: "1px solid #3d4756" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", fontSize: 11, fontWeight: 900, color: "#7c2d12" }}>CAPA / FRATURA</div>
                </div>
              </div>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#111827" }}>CONEXAO FRATURADA • CAPA CASADA • GUIA DE TORQUE E ASSENTAMENTO</div>
              {headerBar(isGearbox ? "ESPECIFICACOES E TOLERANCIAS" : "ESPECIFICACOES DA BIELA")}
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, padding: "8px 0" }}>
              <div style={{ display: "flex", position: "relative", width: 330, height: 240, alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", position: "absolute", left: 18, top: 26, width: 98, height: 98, borderRadius: 999, border: "6px solid #4b5563", background: "#edf2f5", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, border: "4px solid #4b5563" }} />
                  <div style={{ display: "flex", position: "absolute", top: 10, width: 10, height: 16, background: "#ef8a28", borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", position: "absolute", right: 18, top: 26, width: 98, height: 98, borderRadius: 999, border: "6px solid #4b5563", background: "#edf2f5", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, border: "4px solid #4b5563" }} />
                  <div style={{ display: "flex", position: "absolute", top: 10, width: 10, height: 16, background: "#ef8a28", borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", position: "absolute", left: 127, bottom: 12, width: 76, height: 76, borderRadius: 999, border: "6px solid #64748b", background: "#b7c3cc", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, border: "3px solid #475569" }} />
                </div>
                <div style={{ display: "flex", position: "absolute", left: 54, top: 26, width: 222, height: 8, background: "#4b5563" }} />
                <div style={{ display: "flex", position: "absolute", left: 32, top: 68, width: 262, height: 64, borderTop: "6px solid #0f766e", borderLeft: "6px solid #0f766e", borderRight: "6px solid #0f766e", borderBottom: "6px solid transparent", borderRadius: 18 }} />
                <div style={{ display: "flex", position: "absolute", left: 122, top: 92, width: 86, height: 8, background: "#7c2d12", borderRadius: 6 }} />
                <div style={{ display: "flex", position: "absolute", left: 143, top: 74, width: 42, height: 18, background: "#facc15", border: "2px solid #7c2d12", borderRadius: 4 }} />
                <div style={{ display: "flex", position: "absolute", left: 38, bottom: 8, fontSize: 11, fontWeight: 900, color: "#475569" }}>POLIA COMANDO</div>
                <div style={{ display: "flex", position: "absolute", right: 38, bottom: 8, fontSize: 11, fontWeight: 900, color: "#475569" }}>POLIA BOMBA</div>
                <div style={{ display: "flex", position: "absolute", left: 125, bottom: -2, fontSize: 11, fontWeight: 900, color: "#7c2d12" }}>VIRA / TENSOR</div>
              </div>
            </div>
            {regulationLines.slice(0, 3).map((item) => (
              <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 800 }}>{item}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8, flex: 1 }}>
            {headerBar(isGearbox ? "ESPECIFICACOES TECNICAS" : "ESPECIFICACOES TECNICAS DO CABECOTE")}
            <div style={{ display: "flex", gap: 14, flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, width: 250 }}>
                <div style={{ display: "flex", width: 180, height: 34, background: "#bcc8cf", border: "3px solid #475569", borderRadius: 8, justifyContent: "space-around", alignItems: "center" }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={`valve-top-${index}`} style={{ display: "flex", width: 12, height: 16, borderRadius: 6, background: index === 2 ? "#facc15" : index % 2 === 0 ? "#ef8a28" : "#94a3b8" }} />
                  ))}
                </div>
                <div style={{ display: "flex", width: 190, height: 50, background: "#d9e2e8", border: "3px solid #475569", borderRadius: 6, justifyContent: "space-around", alignItems: "flex-end", paddingBottom: 6 }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={`spring-${index}`} style={{ display: "flex", width: 16, height: 26, borderLeft: "3px solid #475569", borderRight: "3px solid #475569", borderTop: "3px solid #475569" }} />
                  ))}
                </div>
                <div style={{ display: "flex", width: 190, height: 34, background: "#e4eaee", border: "3px solid #475569", transform: "skew(-18deg)", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 138, height: 8, background: "#64748b" }} />
                </div>
                <div style={{ display: "flex", width: 66, height: 92, background: "#e9b384", borderLeft: "3px solid #7c2d12", borderRight: "3px solid #7c2d12" }} />
                <div style={{ display: "flex", width: 134, height: 86, background: "#bcc8cf", border: "3px solid #475569", borderRadius: 8, alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ display: "flex", width: 22, height: 22, borderRadius: 999, background: "#94a3b8", border: "2px solid #475569" }} />
                  <div style={{ display: "flex", position: "absolute", left: 18, right: 18, bottom: 14, height: 5, background: "#7c2d12" }} />
                  <div style={{ display: "flex", position: "absolute", top: 10, width: 40, height: 10, background: "#facc15", border: "2px solid #7c2d12" }} />
                </div>
                <div style={{ display: "flex", fontSize: 11, fontWeight: 900, color: "#475569" }}>CORTE DE VALVULAS / CAMARA</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "center" }}>
                {measureLines.slice(0, 4).map((item) => (
                  <div key={item} style={{ display: "flex", fontSize: 16, fontWeight: 900, color: "#111827" }}>{item}</div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <div style={{ display: "flex", width: 26, height: 2, background: "#c58b33" }} />
                  <div style={{ display: "flex", width: 80, height: 2, background: "#c58b33" }} />
                  <div style={{ display: "flex", fontSize: 12, fontWeight: 900, color: "#7c2d12" }}>ALTURA / PLANICIDADE</div>
                </div>
                <div style={{ display: "flex", height: 2, background: "#c58b33", marginTop: 2, marginBottom: 4 }} />
                {focusItems.map((item) => (
                  <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#7c2d12" }}>{item.toUpperCase()}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, minHeight: 170 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
              {headerBar(isGearbox ? "VERIFICACAO" : "REGULAGEM DOS INJETORES")}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ display: "flex", width: 18, height: 28, background: "#9ba8b2", border: "2px solid #475569", borderRadius: 4 }} />
                  <div style={{ display: "flex", width: 10, height: 34, background: "#d9b98b", borderLeft: "2px solid #7c2d12", borderRight: "2px solid #7c2d12" }} />
                  <div style={{ display: "flex", width: 28, height: 10, borderRadius: 6, background: "#94a3b8", border: "2px solid #475569" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  {noteLines.slice(0, 3).map((item) => (
                    <div key={item} style={{ display: "flex", fontSize: 13, fontWeight: 800 }}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #c7ced4", borderRadius: 12, background: "#efefef", padding: 10, gap: 8 }}>
              {headerBar(isGearbox ? "MEDIDAS" : "PARAFUSO E LIMITE")}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <div style={{ display: "flex", width: 30, height: 12, background: "#95a4ae", borderRadius: 4 }} />
                <div style={{ display: "flex", width: 120, height: 12, background: "#95a4ae", borderRadius: 4 }} />
                <div style={{ display: "flex", width: 16, height: 16, borderRadius: 999, background: "#95a4ae" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", width: 18, height: 48, background: "#cfd8df", border: "2px solid #475569", borderRadius: 6 }} />
                <div style={{ display: "flex", width: 80, height: 10, background: "#64748b" }} />
                <div style={{ display: "flex", fontSize: 12, fontWeight: 900, color: "#7c2d12" }}>LIMITE</div>
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
