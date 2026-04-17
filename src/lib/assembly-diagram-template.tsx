import React from "react";

type TorqueSpec = {
  component: string;
  sequence: string;
  value: string;
};

function sectionTitle(label: string) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        fontSize: 22,
        fontWeight: 900,
        color: "#111111",
        textTransform: "uppercase",
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
    <div key={`${index}-${text}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {badge(index, 24)}
      <div style={{ display: "flex", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{text}</div>
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

  const labels = isGearbox
    ? [
        "CARCACA PRINCIPAL",
        "TAMPA SUPERIOR",
        "EIXO PILOTO",
        "EIXO SECUNDARIO",
        "ENGRENAGENS",
        "GARFOS",
        "ROLAMENTOS",
        "RETENTORES",
        "FLANGE",
        "ACIONAMENTO",
        "TAMPA TRASEIRA",
        "SINCRONISMO",
        "CONJUNTO AUXILIAR",
      ]
    : [
        "BLOCO DO MOTOR",
        "CABECOTE DO MOTOR",
        "COLETOR DE ADMISSAO",
        "COLETOR DE ESCAPE",
        "TAMPA DE VALVULAS",
        "CARTER DE OLEO",
        "FILTRO DE OLEO",
        "FILTRO DE COMBUSTIVEL",
        "BOMBA INJETORA",
        "ALTERNADOR",
        "VOLANTE DO MOTOR",
        "ENGRENAGEM DE DISTRIBUICAO",
        (componentFocus?.[0] || "SISTEMA AUXILIAR").toUpperCase(),
      ];

  const torqueRows = torqueSpecs.length
    ? torqueSpecs.slice(0, 4)
    : [
        { component: "Bielas", sequence: "", value: "20 Nm + 60 Nm + 90°" },
        { component: "Mancais principais", sequence: "", value: "50 Nm + 150 Nm + 90°" },
        { component: "Cabecote", sequence: "", value: "60 Nm + 150 Nm + 250 Nm + 90°" },
        { component: "Volante", sequence: "", value: "130 Nm + 90°" },
      ];

  const specRows = [...measureLines, ...referenceLines].filter(Boolean).slice(0, 5);
  const notes = [...noteLines, ...regulationLines].filter(Boolean).slice(0, 4);

  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        padding: 14,
        gap: 10,
        background: "#e9e9e9",
        color: "#111111",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 72,
          border: "2px solid #333333",
          borderRadius: 12,
          fontSize: 36,
          fontWeight: 900,
          textTransform: "uppercase",
          background: "#efefef",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #444", background: "#f5f5f5", padding: 10, gap: 8, height: 760 }}>
            {sectionTitle("1. VISTA EXPLODIDA GERAL")}
            <div style={{ display: "flex", gap: 10, flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", width: 320, gap: 6 }}>
                {labels.map((item, index) => legendRow(index + 1, item))}
              </div>

              <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef", overflow: "hidden" }}>
                {illustrationDataUrl ? (
                  <img
                    src={illustrationDataUrl}
                    alt="referencia"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06 }}
                  />
                ) : null}

                <div style={{ display: "flex", position: "absolute", left: 300, top: 210, width: 260, height: 196, background: "#bcc3c9", border: "3px solid #5d656d", borderRadius: 10 }}>
                  <div style={{ display: "flex", position: "absolute", left: 22, right: 22, top: 18, justifyContent: "space-between" }}>
                    {Array.from({ length: isVEngine ? 8 : 4 }).map((_, index) => (
                      <div key={`core-bolt-${index}`} style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: "#7e8a94", border: "2px solid #4e5760" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", position: "absolute", left: 26, right: 26, bottom: 18, justifyContent: "space-between" }}>
                    {Array.from({ length: isVEngine ? 8 : 4 }).map((_, index) => (
                      <div key={`freeze-${index}`} style={{ display: "flex", width: 20, height: 20, borderRadius: 999, background: "#dde4e9", border: "3px solid #5d656d" }} />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", position: "absolute", left: 334, top: 136, width: 234, height: 74, background: "#b7d9e7", border: "3px solid #617a85", borderRadius: 8 }}>
                  <div style={{ display: "flex", position: "absolute", left: 14, right: 14, top: 18, justifyContent: "space-between" }}>
                    {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                      <div key={`head-port-${index}`} style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: "#dce8ef", border: "2px solid #617a85" }} />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", position: "absolute", left: 352, top: 86, gap: 22 }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`stud-${index}`} style={{ display: "flex", width: 10, height: 66, borderRadius: 6, background: "#7e8a94" }} />
                  ))}
                </div>

                <div style={{ display: "flex", position: "absolute", left: 350, top: 26, width: 230, height: 40, background: "#8eb0c3", border: "3px solid #617a85", borderRadius: 8, transform: "rotate(-16deg)" }} />
                <div style={{ display: "flex", position: "absolute", left: 170, top: 118, width: 120, height: 64, background: "#b7bcc1", border: "3px solid #5d656d", borderRadius: 10 }} />
                <div style={{ display: "flex", position: "absolute", left: 152, top: 210, width: 146, height: 56, background: "#b7bcc1", border: "3px solid #5d656d", borderRadius: 10 }} />

                <div style={{ display: "flex", position: "absolute", left: 640, top: 118, width: 126, height: 72, background: "#b7bcc1", border: "3px solid #5d656d", borderRadius: 10 }} />
                <div style={{ display: "flex", position: "absolute", left: 664, top: 226, width: 226, height: 80, borderRadius: 50, background: "#9da4aa", border: "3px solid #5d656d", transform: "rotate(12deg)", justifyContent: "space-around", alignItems: "center", padding: "0 18px" }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`crank-${index}`} style={{ display: "flex", width: 22, height: 22, borderRadius: 999, background: "#e7ecf0", border: "4px solid #5d656d" }} />
                  ))}
                </div>

                <div style={{ display: "flex", position: "absolute", left: 880, top: 122, width: 110, height: 110, borderRadius: 999, background: "#c5c9cd", border: "5px solid #5d656d", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 36, height: 36, borderRadius: 999, border: "4px solid #5d656d" }} />
                </div>

                <div style={{ display: "flex", position: "absolute", left: 760, top: 350, width: 50, height: 90, background: "#d8c455", border: "3px solid #8a7b2f", borderRadius: 8 }} />
                <div style={{ display: "flex", position: "absolute", left: 620, top: 410, width: 70, height: 70, borderRadius: 999, background: "#c7ccd1", border: "4px solid #5d656d" }} />
                <div style={{ display: "flex", position: "absolute", left: 430, top: 438, width: 176, height: 82, background: "#dadada", border: "3px solid #5d656d", borderRadius: 6 }} />
                <div style={{ display: "flex", position: "absolute", left: 252, top: 308, width: 88, height: 70, background: "#d5bd8d", border: "2px solid #8a6a37", borderRadius: 8 }} />

                <div style={{ display: "flex", position: "absolute", left: 338, top: 222, gap: 26 }}>
                  {Array.from({ length: isVEngine ? 8 : 4 }).map((_, index) => (
                    <div key={`piston-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ display: "flex", width: 38, height: 48, borderRadius: 10, background: "#ebeff2", border: "3px solid #5d656d" }} />
                      <div style={{ display: "flex", width: 8, height: 34, background: "#7d8891" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", position: "absolute", left: 322, top: 130, width: 1, height: 60, borderLeft: "2px dashed #666" }} />
                <div style={{ display: "flex", position: "absolute", left: 248, top: 188, width: 74, height: 1, borderTop: "2px dashed #666" }} />
                <div style={{ display: "flex", position: "absolute", left: 574, top: 184, width: 62, height: 1, borderTop: "2px dashed #666" }} />
                <div style={{ display: "flex", position: "absolute", left: 806, top: 182, width: 76, height: 1, borderTop: "2px dashed #666" }} />
                <div style={{ display: "flex", position: "absolute", left: 610, top: 430, width: 1, height: 34, borderLeft: "2px dashed #666" }} />
                <div style={{ display: "flex", position: "absolute", left: 452, top: 430, width: 1, height: 28, borderLeft: "2px dashed #666" }} />

                <div style={{ display: "flex", position: "absolute", left: 356, top: 248 }}>{badge(1)}</div>
                <div style={{ display: "flex", position: "absolute", left: 370, top: 132 }}>{badge(2)}</div>
                <div style={{ display: "flex", position: "absolute", left: 164, top: 126 }}>{badge(3)}</div>
                <div style={{ display: "flex", position: "absolute", left: 128, top: 230 }}>{badge(4)}</div>
                <div style={{ display: "flex", position: "absolute", left: 490, top: 18 }}>{badge(5)}</div>
                <div style={{ display: "flex", position: "absolute", left: 454, top: 430 }}>{badge(6)}</div>
                <div style={{ display: "flex", position: "absolute", left: 400, top: 486 }}>{badge(7)}</div>
                <div style={{ display: "flex", position: "absolute", left: 760, top: 332 }}>{badge(8)}</div>
                <div style={{ display: "flex", position: "absolute", left: 242, top: 292 }}>{badge(9)}</div>
                <div style={{ display: "flex", position: "absolute", left: 598, top: 184 }}>{badge(10)}</div>
                <div style={{ display: "flex", position: "absolute", left: 842, top: 86 }}>{badge(11)}</div>
                <div style={{ display: "flex", position: "absolute", left: 566, top: 350 }}>{badge(12)}</div>
                <div style={{ display: "flex", position: "absolute", left: 670, top: 456 }}>{badge(13)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, height: 470 }}>
            <div style={{ display: "flex", flexDirection: "column", width: 760, border: "2px solid #444", background: "#f5f5f5", padding: 10, gap: 8 }}>
              {sectionTitle("2. SUB-MONTAGEM DO BLOCO")}
              <div style={{ display: "flex", gap: 12, flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", width: 180, justifyContent: "center", gap: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800 }}>{badge("1A", 22)} CILINDROS E PISTOES</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800 }}>{badge("1B", 22)} ARVORE DE MANIVELAS</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800 }}>{badge("1C", 22)} BRONZINAS</div>
                </div>
                <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef" }}>
                  <div style={{ display: "flex", position: "absolute", left: 120, top: 152, width: 196, height: 132, background: "#bfc4c8", border: "3px solid #5d656d", borderRadius: 8 }} />
                  <div style={{ display: "flex", position: "absolute", left: 92, top: 62, gap: 22 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`p-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div style={{ display: "flex", width: 36, height: 46, borderRadius: 10, background: "#e8ecef", border: "3px solid #5d656d" }} />
                        <div style={{ display: "flex", width: 8, height: 70, background: "#88949d" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", position: "absolute", left: 232, top: 316, width: 220, height: 48, background: "#9ca3a9", border: "3px solid #5d656d", borderRadius: 40, transform: "rotate(-16deg)" }} />
                  <div style={{ display: "flex", position: "absolute", left: 438, top: 274, gap: 8 }}>
                    <div style={{ display: "flex", width: 22, height: 22, borderRadius: 999, border: "4px solid #5d656d", background: "#edf1f4" }} />
                    <div style={{ display: "flex", width: 22, height: 22, borderRadius: 999, border: "4px solid #5d656d", background: "#edf1f4" }} />
                  </div>
                  <div style={{ display: "flex", position: "absolute", left: 134, top: 144 }}>{badge(1, 24)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 104, top: 48 }}>{badge("1A", 24)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 322, top: 332 }}>{badge("1B", 24)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 470, top: 262 }}>{badge("1C", 24)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #444", background: "#f5f5f5", padding: 10, gap: 8 }}>
              {sectionTitle("3. SUB-MONTAGEM DO CABECOTE")}
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", width: 170, gap: 10, fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>
                  <div>VALVULAS DE ADMISSAO</div>
                  <div>ESCAPAMENTO</div>
                  <div>EIXO DE COMANDO</div>
                  <div>BALANCINS</div>
                </div>
                <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef", padding: 8 }}>
                  <div style={{ display: "flex", gap: 18, marginLeft: 14 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={`valve-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div style={{ display: "flex", width: 18, height: 20, borderRadius: 999, background: "#dde2e6", border: "2px solid #5d656d" }} />
                        <div style={{ display: "flex", width: 6, height: 60, background: "#5d656d" }} />
                        <div style={{ display: "flex", width: 24, height: 10, borderRadius: 999, background: index % 2 === 0 ? "#d8d8d8" : "#b6cfdb", border: "2px solid #5d656d" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", marginTop: 18, marginLeft: 16, width: 258, height: 24, background: "#9ca3a9", border: "3px solid #5d656d", borderRadius: 20, transform: "rotate(-8deg)" }} />
                  <div style={{ display: "flex", marginTop: 24, marginLeft: 60, width: 320, height: 94, background: "#b7d9e7", border: "3px solid #617a85", borderRadius: 8 }} />
                  <div style={{ display: "flex", position: "absolute", right: 18, bottom: 18, width: 90, height: 90, borderRadius: 999, border: "3px solid #617a85", background: "#d9e8ef", justifyContent: "center", alignItems: "center", color: "#7b2d12", fontSize: 13, fontWeight: 900 }}>SEQ.</div>
                  <div style={{ display: "flex", position: "absolute", left: 16, top: 16 }}>{badge("2C", 22)}</div>
                  <div style={{ display: "flex", position: "absolute", right: 108, top: 16 }}>{badge("2E", 22)}</div>
                  <div style={{ display: "flex", position: "absolute", right: 58, top: 48 }}>{badge("2D", 22)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 94, bottom: 26 }}>{badge("2", 22)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {specRows.map((item, index) => (
                  <div key={`${item}-${index}`} style={{ display: "flex", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 520, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #444", background: "#f5f5f5", padding: 10, gap: 8, height: 520 }}>
            {sectionTitle("4. SISTEMA DE DISTRIBUICAO")}
            <div style={{ display: "flex", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>ENGRENAGENS DE DISTRIBUICAO E MARCAS DE SINCRONISMO</div>
            <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef" }}>
              <div style={{ display: "flex", position: "absolute", left: 56, top: 142, width: 88, height: 88, borderRadius: 999, border: "5px solid #5d656d", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "3px solid #5d656d" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 170, top: 56, width: 132, height: 132, borderRadius: 999, border: "5px solid #5d656d", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, border: "3px solid #5d656d" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 286, top: 150, width: 92, height: 92, borderRadius: 999, border: "5px solid #5d656d", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "3px solid #5d656d" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 126, top: 210, width: 74, height: 74, borderRadius: 999, border: "5px solid #5d656d", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, border: "3px solid #5d656d" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 210, top: 110, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 110, top: 172, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 312, top: 186, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 166, top: 242, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 78, top: 130 }}>{badge(13, 22)}</div>
              <div style={{ display: "flex", position: "absolute", left: 284, top: 126 }}>{badge(13, 22)}</div>
              <div style={{ display: "flex", position: "absolute", left: 18, top: 18, fontSize: 12, fontWeight: 800, width: 120, textTransform: "uppercase" }}>ENGRENAGENS DE DISTRIBUICAO</div>
              <div style={{ display: "flex", position: "absolute", right: 16, top: 16, fontSize: 12, fontWeight: 800, textAlign: "right", width: 120, textTransform: "uppercase" }}>MARCAS DE SINCRONISMO</div>
              <div style={{ display: "flex", position: "absolute", left: 88, bottom: 18, fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>{regulationLines[0] || "SINCRONISMO DO MOTOR"}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #444", background: "#f5f5f5", padding: 10, gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #777" }}>
              <div style={{ display: "flex", justifyContent: "center", minHeight: 28, alignItems: "center", background: "#e3e3e3", borderBottom: "1px solid #777", fontSize: 14, fontWeight: 900, textTransform: "uppercase" }}>LEGENDA DE PECAS</div>
              {labels.slice(0, 7).map((item, index) => (
                <div key={`legend-${item}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderBottom: "1px solid #d1d1d1" }}>
                  <div style={{ display: "flex", width: 54, height: 16, background: index < 2 ? "#b7d9e7" : "#ead96a", border: "1px solid #777" }} />
                  <div style={{ display: "flex", flex: 1, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{`${index + 1} ${item}`}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #777" }}>
              <div style={{ display: "flex", justifyContent: "center", minHeight: 28, alignItems: "center", background: "#e3e3e3", borderBottom: "1px solid #777", fontSize: 14, fontWeight: 900, textTransform: "uppercase" }}>ESPECIFICACOES TECNICAS</div>
              {torqueRows.map((item, index) => (
                <div key={`${item.component}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "5px 8px", borderBottom: "1px solid #d1d1d1", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                  <div style={{ display: "flex", flex: 1 }}>{item.component}</div>
                  <div style={{ display: "flex" }}>{item.value}</div>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 8, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                <div>{specRows[0] || `MOTOR: ${engine}`}</div>
                <div>{specRows[1] || `FAMILIA: ${matchedFamily}`}</div>
                <div>{specRows[2] || `APLICACAO: ${matchedApplication}`}</div>
                <div>{specRows[3] || `ANOS: ${matchedYears}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #555", paddingTop: 8, fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>
        <div>{`APLICACAO: ${matchedApplication}`}</div>
        <div>{`FAMILIA: ${matchedFamily}`}</div>
        <div>{`ANOS: ${matchedYears}`}</div>
      </div>
    </div>
  );
}
