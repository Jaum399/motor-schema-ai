import React from "react";

type TorqueSpec = {
  component: string;
  sequence: string;
  value: string;
};

type VisualTheme = "iveco" | "scania" | "mercedes" | "volvo" | "cummins" | "mwm" | "generic";

function getThemePalette(theme: VisualTheme) {
  switch (theme) {
    case "iveco":
      return { accent: "#d97706", soft: "#fff7ed", panel: "#ffedd5", dark: "#7c2d12" };
    case "scania":
      return { accent: "#2563eb", soft: "#eff6ff", panel: "#dbeafe", dark: "#1e3a8a" };
    case "mercedes":
      return { accent: "#475569", soft: "#f8fafc", panel: "#e2e8f0", dark: "#0f172a" };
    case "volvo":
      return { accent: "#0f766e", soft: "#ecfeff", panel: "#ccfbf1", dark: "#134e4a" };
    case "cummins":
      return { accent: "#b91c1c", soft: "#fef2f2", panel: "#fee2e2", dark: "#7f1d1d" };
    case "mwm":
      return { accent: "#15803d", soft: "#f0fdf4", panel: "#dcfce7", dark: "#166534" };
    default:
      return { accent: "#0f766e", soft: "#f8fafc", panel: "#e2e8f0", dark: "#1f2937" };
  }
}

function sectionTitle(label: string) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        fontSize: 24,
        fontWeight: 900,
        color: "#111111",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        paddingBottom: 4,
        borderBottom: "2px solid #444444",
      }}
    >
      {label}
    </div>
  );
}

function badge(value: string | number, size = 30) {
  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        background: "#ead96a",
        border: "2px solid #6f6524",
        color: "#111111",
        fontSize: size > 26 ? 14 : 11,
        fontWeight: 900,
        flexShrink: 0,
      }}
    >
      {value}
    </div>
  );
}

function legendRow(index: number, text: string) {
  return (
    <div
      key={`${index}-${text}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        minHeight: 26,
      }}
    >
      {badge(index, 24)}
      <div style={{ display: "flex", fontSize: 12, fontWeight: 900, textTransform: "uppercase", lineHeight: 1.05 }}>{text}</div>
    </div>
  );
}

export function createAssemblyDiagramElement({
  title,
  brand,
  model,
  engine,
  variant,
  visualTheme = "generic",
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
  brand: string;
  model: string;
  engine: string;
  variant: "inline" | "gearbox" | "v-engine";
  visualTheme?: VisualTheme;
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
  const palette = getThemePalette(visualTheme);

  const torqueRows = torqueSpecs.length
    ? torqueSpecs.slice(0, 4)
    : [
        { component: "Mancais", sequence: "", value: "80 Nm + 160 Nm + 90°" },
        { component: "Bielas", sequence: "", value: "50 Nm + 120 Nm + 90°" },
        { component: "Cabecote", sequence: "", value: "80 Nm + 120 Nm + 90° + 90°" },
        { component: "Volante", sequence: "", value: "120 Nm + 90°" },
      ];

  const specRows = [...measureLines, ...referenceLines].filter(Boolean).slice(0, 4);
  const notes = [...noteLines, ...regulationLines].filter(Boolean);
  const focusItems = (componentFocus?.length ? componentFocus : ["biela fraturada", "mancais", "sincronismo", "torque final"]).slice(0, 4);
  const sequenceBubbles = isGearbox ? ["1", "3", "5", "7", "11", "12", "8", "4", "2", "10"] : ["9", "6", "1", "3", "7", "11", "12", "5", "8", "4", "2", "10"];
  const callouts = [
    { label: "BLOCO", value: specRows[0] || "Projecao do pistao: 0,28 mm a 0,52 mm", color: "#1f9d39" },
    { label: "BIELA", value: specRows[1] || "Altura nominal: 130,00 mm ± 0,05 mm", color: "#cf362a" },
    { label: "MANCAL", value: specRows[2] || "Planicidade do cabecote: menor que 0,05 mm", color: "#cf362a" },
    { label: "ADMISSAO", value: specRows[3] || "Junta do cabecote: 1,30 mm a 1,40 mm", color: "#1f9d39" },
  ];

  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${palette.soft} 0%, #eef2f4 100%)`,
        color: "#111827",
        fontFamily: "MTManual, sans-serif",
        padding: 16,
        gap: 10,
        boxSizing: "border-box",
        border: "3px solid #1f2937",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 74,
          border: "3px solid #111827",
          borderRadius: 12,
          background: palette.panel,
          fontSize: 34,
          fontWeight: 900,
          textAlign: "center",
          padding: "0 12px",
          textTransform: "uppercase",
        }}
      >
        {title} • {brand} {model}
      </div>

      <div style={{ display: "flex", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 720, gap: 10 }}>
          <div style={{ display: "flex", flex: 1, border: "2px solid #c8d0d6", borderRadius: 12, background: "#efefef", padding: 12, gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
              {callouts.map((item, index) => (
                <div key={`${item.label}-${index}`} style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
                  <div style={{ display: "flex", padding: "6px 10px", borderRadius: 8, background: index % 2 === 0 ? palette.accent : palette.dark, color: "#fff", fontSize: 14, fontWeight: 900, textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ display: "flex", padding: "6px 10px", borderRadius: 8, background: index % 2 === 0 ? palette.accent : palette.dark, color: "#fff", fontSize: 18, fontWeight: 900 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", gap: 8 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`cyl-${index}`} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                  <div style={{ display: "flex", width: 54, height: 2, background: index % 2 === 0 ? "#1f9d39" : "#cf362a" }} />
                  <div style={{ display: "flex", width: 220, height: 68, border: "3px solid #2f3944", background: "#9ba6ae", borderRadius: 12, justifyContent: "center", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", width: 44, height: 44, borderRadius: 999, border: "4px solid #333", background: "#dfe5e9", justifyContent: "center", alignItems: "center", fontSize: 16, fontWeight: 900 }}>{index + 1}</div>
                    <div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, background: "#62c36b", border: "2px solid #276b2a" }} />
                    <div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, background: "#dc4d44", border: "2px solid #8a211c" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 80 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", fontSize: 18, fontWeight: 900, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>SENTIDO DE ROTACAO</div>
                <div style={{ width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderBottom: "32px solid #000" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 118, border: `3px solid ${palette.dark}`, borderRadius: 12, background: palette.soft, fontSize: 30, fontWeight: 900, textTransform: "uppercase" }}>
            Condicao: montagem tecnica limpa
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 760, gap: 10 }}>
          <div style={{ display: "flex", flex: 1, border: "2px solid #c8d0d6", borderRadius: 12, background: "#efefef", padding: 12, gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", fontSize: 22, fontWeight: 900, textTransform: "uppercase" }}>Vista geral do motor</div>
              {illustrationDataUrl ? (
                <img src={illustrationDataUrl} alt="motor" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 12, border: "3px solid #374151" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: 320 }}>
                    {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                      <div key={`top-${index}`} style={{ display: "flex", width: 42, height: 16, borderRadius: 6, background: "#bcc7cf", border: "2px solid #374151" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", width: 360, height: 64, borderRadius: 12, background: "#c8d2d9", border: "3px solid #374151" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", width: 84, height: 84, borderRadius: 999, background: "#dbe2e8", border: "4px solid #374151", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ display: "flex", width: 38, height: 38, borderRadius: 999, background: "#95a4ae", border: "3px solid #374151" }} />
                    </div>
                    <div style={{ display: "flex", width: 260, height: 170, borderRadius: 20, background: "#9daab4", border: "3px solid #374151" }} />
                  </div>
                  <div style={{ display: "flex", width: 420, height: 120, borderRadius: 12, background: "#d9b98b", border: "3px solid #6f5833" }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #c8d0d6", borderRadius: 12, background: "#dfe9f1", padding: 12, gap: 8, minHeight: 270 }}>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 22, fontWeight: 900, textTransform: "uppercase" }}>Como medir</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flex: 1 }}>
              <div style={{ display: "flex", width: 80, height: 80, borderRadius: 999, border: "5px solid #374151", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, background: "#9aa9b3", border: "3px solid #374151" }} />
              </div>
              <div style={{ display: "flex", width: 10, height: 120, background: "#374151", borderRadius: 8 }} />
              <div style={{ display: "flex", width: 160, height: 16, background: "#374151", borderRadius: 8 }} />
              <div style={{ display: "flex", width: 86, height: 32, background: "#c8d2d8", border: "3px solid #374151", borderRadius: 10 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 15, fontWeight: 800, textTransform: "uppercase" }}>Usar lamina calibrada com leve resistencia</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 12, background: "#f1f5f8", overflow: "hidden", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 112, borderBottom: "3px solid #374151", background: "#e6edf2" }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 900, textTransform: "uppercase" }}>Procedimento de aperto</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {sequenceBubbles.map((item) => (
                  <div key={item} style={{ display: "flex", width: 28, height: 28, borderRadius: 999, alignItems: "center", justifyContent: "center", background: "#eda451", border: "2px solid #8a5a23", fontSize: 13, fontWeight: 900 }}>{item}</div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {torqueRows.map((item, index) => (
                <div key={`${item.component}-${index}`} style={{ display: "flex", minHeight: 104, borderBottom: index === torqueRows.length - 1 ? "none" : "2px solid #374151" }}>
                  <div style={{ display: "flex", width: 60, alignItems: "center", justifyContent: "center", borderRight: "2px solid #374151", fontSize: 22, fontWeight: 900 }}>{index + 1}</div>
                  <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900, textTransform: "uppercase" }}>{item.component}</div>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>EM PRE-CARGA</div>
                    </div>
                    <div style={{ display: "flex", width: 120, height: 3, background: "#111827" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>REGULAR:</div>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900, color: "#7c2d12" }}>{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 12, background: "#f6f8fa", padding: 12, gap: 6 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 900, textTransform: "uppercase" }}>Especificacoes criticas</div>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#108a2f" }}>{callouts[0].value}</div>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#c62828" }}>{callouts[1].value}</div>
            {focusItems.map((item) => (
              <div key={item} style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#334155", textTransform: "uppercase" }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", borderRadius: 10, background: palette.dark, padding: 12, gap: 4 }}>
        <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#f8fafc", textTransform: "uppercase" }}>Resumo tecnico e referencias</div>
        <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#dbeafe" }}>{`Familia: ${matchedFamily}`}</div>
        <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#dbeafe" }}>{`Aplicacao: ${matchedApplication}`}</div>
        <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#dbeafe" }}>{`Anos: ${matchedYears}`}</div>
        {notes.slice(0, 4).map((note, index) => (
          <div key={`${note}-${index}`} style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#dbeafe" }}>{note}</div>
        ))}
      </div>
    </div>
  );
}
