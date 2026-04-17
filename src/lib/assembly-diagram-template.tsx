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
        fontSize: 20,
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
        background: "#f0dc6b",
        border: "2px solid #6f6424",
        color: "#111111",
        fontSize: size > 26 ? 14 : 12,
        fontWeight: 900,
        flexShrink: 0,
      }}
    >
      {value}
    </div>
  );
}

function labelLine(index: number, text: string) {
  return (
    <div key={`${index}-${text}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {badge(index, 26)}
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
  const focusItems = (componentFocus?.length
    ? componentFocus
    : isGearbox
      ? ["eixo piloto", "sincronizadores", "carcaca", "folga axial"]
      : isVEngine
        ? ["banco a", "banco b", "turbo", "sincronismo"]
        : ["bloco", "cabecote", "bielas", "camisas"]
  ).slice(0, 4);

  const torqueRows = torqueSpecs.length
    ? torqueSpecs.slice(0, 5)
    : [
        { component: "Cabecote", sequence: "centro para fora", value: "120 Nm + 90°" },
        { component: "Bielas", sequence: "par a par", value: "55 Nm + 60°" },
        { component: "Mancais", sequence: "sequencial", value: "110 Nm" },
      ];

  const specRows = [...measureLines, ...referenceLines, ...noteLines].filter(Boolean).slice(0, 5);
  const topTitle = title.toUpperCase().includes("DIAGRAMA") ? title.toUpperCase() : `DIAGRAMA DE MONTAGEM DO MOTOR ${engine}`.toUpperCase();

  const componentLabels = isGearbox
    ? [
        "CARCACA PRINCIPAL",
        "TAMPA SUPERIOR",
        "EIXO PILOTO",
        "EIXO SECUNDARIO",
        "CONJUNTO DE ENGRENAGENS",
        "GARFOS",
        "SINCRONIZADORES",
        "ROLAMENTOS",
        "RETENTORES",
        "FLANGE",
        "ACIONAMENTO",
        "TAMPA TRASEIRA",
        "MARCAS DE SINCRONISMO",
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
        "ENGRENAGENS DE DISTRIBUICAO",
        focusItems[0]?.toUpperCase() || "SISTEMA AUXILIAR",
      ];

  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        padding: 16,
        gap: 12,
        background: "#ececec",
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
          fontSize: 38,
          fontWeight: 900,
          textTransform: "uppercase",
          minHeight: 70,
        }}
      >
        {topTitle}
      </div>

      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #222", background: "#f4f4f4", padding: 10, gap: 8, height: 760 }}>
            {sectionTitle("1. VISTA EXPLODIDA GERAL")}
            <div style={{ display: "flex", gap: 10, flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", width: 360, gap: 5 }}>
                {componentLabels.slice(0, 13).map((item, index) => labelLine(index + 1, item))}
              </div>

              <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: illustrationDataUrl ? "#e8e3d7" : "#efefef", overflow: "hidden" }}>
                {illustrationDataUrl ? (
                  <img
                    src={illustrationDataUrl}
                    alt="referencia"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.08 }}
                  />
                ) : null}

                <div style={{ display: "flex", position: "absolute", left: 360, top: 196, width: 250, height: 170, background: "#bfc4c8", border: "3px solid #5b6166", borderRadius: 8 }} />
                <div style={{ display: "flex", position: "absolute", left: 402, top: 154, width: 226, height: 66, background: "#b9dceb", border: "3px solid #4f6b74", borderRadius: 8 }} />
                <div style={{ display: "flex", position: "absolute", left: 426, top: 86, width: 190, height: 24, gap: 18, justifyContent: "center" }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`head-bolt-${index}`} style={{ display: "flex", width: 10, height: 52, background: "#848f98", borderRadius: 6 }} />
                  ))}
                </div>
                <div style={{ display: "flex", position: "absolute", left: 430, top: 42, width: 220, height: 44, background: "#96b7c9", border: "3px solid #4f6b74", borderRadius: 8, transform: "rotate(-17deg)" }} />
                <div style={{ display: "flex", position: "absolute", left: 200, top: 118, width: 120, height: 56, background: "#b6bcc0", border: "3px solid #5b6166", borderRadius: 10 }} />
                <div style={{ display: "flex", position: "absolute", left: 176, top: 206, width: 150, height: 54, background: "#b6bcc0", border: "3px solid #5b6166", borderRadius: 10 }} />
                <div style={{ display: "flex", position: "absolute", left: 700, top: 112, width: 112, height: 64, background: "#b6bcc0", border: "3px solid #5b6166", borderRadius: 10 }} />
                <div style={{ display: "flex", position: "absolute", left: 696, top: 238, width: 220, height: 70, transform: "rotate(12deg)", background: "#9ca3a9", border: "3px solid #5b6166", borderRadius: 50, justifyContent: "space-around", alignItems: "center", padding: "0 18px" }}>
                  {Array.from({ length: isVEngine ? 8 : 6 }).map((_, index) => (
                    <div key={`crank-${index}`} style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "4px solid #5b6166", background: "#e9edf0" }} />
                  ))}
                </div>
                <div style={{ display: "flex", position: "absolute", left: 880, top: 118, width: 116, height: 116, borderRadius: 999, background: "#c2c6ca", border: "5px solid #5b6166", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", width: 40, height: 40, borderRadius: 999, border: "4px solid #5b6166" }} />
                </div>
                <div style={{ display: "flex", position: "absolute", left: 780, top: 350, width: 48, height: 90, borderRadius: 8, background: "#d8c35d", border: "3px solid #8a7b2c" }} />
                <div style={{ display: "flex", position: "absolute", left: 628, top: 410, width: 66, height: 66, borderRadius: 999, background: "#c7ccd1", border: "4px solid #5b6166" }} />
                <div style={{ display: "flex", position: "absolute", left: 490, top: 440, width: 176, height: 84, background: "#dadada", border: "3px solid #5b6166", borderRadius: 6 }} />
                <div style={{ display: "flex", position: "absolute", left: 286, top: 298, width: 84, height: 66, background: "#d6be90", border: "2px solid #8a6a37", borderRadius: 8 }} />

                <div style={{ display: "flex", position: "absolute", left: 402, top: 228, gap: 24 }}>
                  {Array.from({ length: isVEngine ? 8 : 4 }).map((_, index) => (
                    <div key={`piston-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ display: "flex", width: 42, height: 48, borderRadius: 10, background: "#e7ecef", border: "3px solid #5b6166" }} />
                      <div style={{ display: "flex", width: 8, height: 36, background: "#7d8891" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", position: "absolute", left: 338, top: 126, width: 1, height: 75, borderLeft: "2px dashed #555" }} />
                <div style={{ display: "flex", position: "absolute", left: 240, top: 188, width: 85, height: 1, borderTop: "2px dashed #555" }} />
                <div style={{ display: "flex", position: "absolute", left: 640, top: 188, width: 58, height: 1, borderTop: "2px dashed #555" }} />
                <div style={{ display: "flex", position: "absolute", left: 602, top: 266, width: 70, height: 1, borderTop: "2px dashed #555" }} />
                <div style={{ display: "flex", position: "absolute", left: 820, top: 182, width: 85, height: 1, borderTop: "2px dashed #555" }} />
                <div style={{ display: "flex", position: "absolute", left: 605, top: 432, width: 1, height: 40, borderLeft: "2px dashed #555" }} />
                <div style={{ display: "flex", position: "absolute", left: 466, top: 428, width: 1, height: 28, borderLeft: "2px dashed #555" }} />

                <div style={{ display: "flex", position: "absolute", left: 370, top: 250 }}>{badge(1)}</div>
                <div style={{ display: "flex", position: "absolute", left: 395, top: 132 }}>{badge(2)}</div>
                <div style={{ display: "flex", position: "absolute", left: 175, top: 135 }}>{badge(3)}</div>
                <div style={{ display: "flex", position: "absolute", left: 126, top: 238 }}>{badge(4)}</div>
                <div style={{ display: "flex", position: "absolute", left: 548, top: 26 }}>{badge(5)}</div>
                <div style={{ display: "flex", position: "absolute", left: 522, top: 428 }}>{badge(6)}</div>
                <div style={{ display: "flex", position: "absolute", left: 432, top: 500 }}>{badge(7)}</div>
                <div style={{ display: "flex", position: "absolute", left: 790, top: 330 }}>{badge(8)}</div>
                <div style={{ display: "flex", position: "absolute", left: 258, top: 288 }}>{badge(9)}</div>
                <div style={{ display: "flex", position: "absolute", left: 608, top: 208 }}>{badge(10)}</div>
                <div style={{ display: "flex", position: "absolute", left: 875, top: 92 }}>{badge(11)}</div>
                <div style={{ display: "flex", position: "absolute", left: 580, top: 350 }}>{badge(12)}</div>
                <div style={{ display: "flex", position: "absolute", left: 700, top: 470 }}>{badge(13)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, height: 470 }}>
            <div style={{ display: "flex", flexDirection: "column", width: 760, border: "2px solid #222", background: "#f4f4f4", padding: 10, gap: 8 }}>
              {sectionTitle("2. SUB-MONTAGEM DO BLOCO")}
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", width: 170, gap: 16, justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800 }}>{badge("1A", 24)} CILINDROS E PISTOES</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800 }}>{badge("1B", 24)} ARVORE DE MANIVELAS</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800 }}>{badge("1C", 24)} BRONZINAS</div>
                </div>
                <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef" }}>
                  <div style={{ display: "flex", position: "absolute", left: 118, top: 142, width: 178, height: 124, background: "#bfc4c8", border: "3px solid #5b6166", borderRadius: 8 }} />
                  <div style={{ display: "flex", position: "absolute", left: 100, top: 50, gap: 18 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`piston-mini-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", width: 36, height: 48, borderRadius: 10, background: "#e8ecef", border: "3px solid #5b6166" }} />
                        <div style={{ display: "flex", width: 8, height: 68, background: "#8a959c" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", position: "absolute", left: 214, top: 306, width: 200, height: 42, background: "#9ca3a9", border: "3px solid #5b6166", borderRadius: 40, transform: "rotate(-16deg)" }} />
                  <div style={{ display: "flex", position: "absolute", left: 408, top: 264, gap: 8 }}>
                    <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "4px solid #5b6166", background: "#edf1f4" }} />
                    <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "4px solid #5b6166", background: "#edf1f4" }} />
                  </div>
                  <div style={{ display: "flex", position: "absolute", left: 144, top: 138 }}>{badge(1, 26)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 98, top: 36 }}>{badge("1A", 26)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 300, top: 318 }}>{badge("1B", 26)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 432, top: 248 }}>{badge("1C", 26)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #222", background: "#f4f4f4", padding: 10, gap: 8 }}>
              {sectionTitle("3. SUB-MONTAGEM DO CABECOTE")}
              <div style={{ display: "flex", flex: 1, gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", width: 170, justifyContent: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>VALVULAS DE ADMISSAO</div>
                  <div style={{ display: "flex", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>ESCAPAMENTO</div>
                  <div style={{ display: "flex", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>EIXO DE COMANDO</div>
                  <div style={{ display: "flex", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>BALANCINS</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef", padding: 8 }}>
                  <div style={{ display: "flex", gap: 18, marginLeft: 16 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={`valve-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div style={{ display: "flex", width: 18, height: 20, borderRadius: 999, background: "#d9dee2", border: "2px solid #5b6166" }} />
                        <div style={{ display: "flex", width: 6, height: 62, background: "#5b6166" }} />
                        <div style={{ display: "flex", width: 24, height: 10, borderRadius: 999, background: index % 2 === 0 ? "#d8d8d8" : "#aec8d5", border: "2px solid #5b6166" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", marginTop: 22, marginLeft: 16, width: 260, height: 28, background: "#9da5ab", border: "3px solid #5b6166", borderRadius: 20, transform: "rotate(-8deg)" }} />
                  <div style={{ display: "flex", marginTop: 24, marginLeft: 62, width: 320, height: 96, background: "#b9dceb", border: "3px solid #4f6b74", borderRadius: 8 }} />
                  <div style={{ display: "flex", position: "absolute", right: 18, bottom: 18, width: 90, height: 90, borderRadius: 999, border: "3px solid #4f6b74", background: "#dae7ef", alignItems: "center", justifyContent: "center", color: "#7b2d12", fontSize: 13, fontWeight: 900 }}>SEQ.</div>
                  <div style={{ display: "flex", position: "absolute", left: 18, top: 18 }}>{badge("2C", 24)}</div>
                  <div style={{ display: "flex", position: "absolute", right: 110, top: 18 }}>{badge("2E", 24)}</div>
                  <div style={{ display: "flex", position: "absolute", right: 62, top: 48 }}>{badge("2D", 24)}</div>
                  <div style={{ display: "flex", position: "absolute", left: 92, bottom: 28 }}>{badge("2", 24)}</div>
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
          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #222", background: "#f4f4f4", padding: 10, gap: 8, height: 520 }}>
            {sectionTitle("4. SISTEMA DE DISTRIBUICAO")}
            <div style={{ display: "flex", fontSize: 14, fontWeight: 800, textTransform: "uppercase" }}>ENGRENAGENS DE DISTRIBUICAO E MARCAS DE SINCRONISMO</div>
            <div style={{ display: "flex", flex: 1, position: "relative", border: "1px solid #777", background: "#efefef" }}>
              <div style={{ display: "flex", position: "absolute", left: 55, top: 138, width: 86, height: 86, borderRadius: 999, border: "5px solid #5b6166", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "3px solid #5b6166" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 166, top: 56, width: 132, height: 132, borderRadius: 999, border: "5px solid #5b6166", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, border: "3px solid #5b6166" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 280, top: 148, width: 92, height: 92, borderRadius: 999, border: "5px solid #5b6166", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, border: "3px solid #5b6166" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 122, top: 210, width: 72, height: 72, borderRadius: 999, border: "5px solid #5b6166", background: "#d7dbe0", justifyContent: "center", alignItems: "center" }}><div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, border: "3px solid #5b6166" }} /></div>
              <div style={{ display: "flex", position: "absolute", left: 212, top: 108, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 114, top: 172, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 314, top: 188, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 170, top: 242, width: 12, height: 16, borderRadius: 4, background: "#d54f4f" }} />
              <div style={{ display: "flex", position: "absolute", left: 82, top: 128 }}>{badge(13, 26)}</div>
              <div style={{ display: "flex", position: "absolute", left: 286, top: 122 }}>{badge(13, 26)}</div>
              <div style={{ display: "flex", position: "absolute", right: 16, top: 16, fontSize: 13, fontWeight: 800, textAlign: "right", width: 120, textTransform: "uppercase" }}>MARCAS DE SINCRONISMO</div>
              <div style={{ display: "flex", position: "absolute", left: 24, bottom: 18, fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>{regulationLines[0] || "SINCRONISMO DO MOTOR"}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "2px solid #222", background: "#f4f4f4", padding: 10, gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #777" }}>
              <div style={{ display: "flex", justifyContent: "center", background: "#e0e0e0", borderBottom: "1px solid #777", fontSize: 14, fontWeight: 900, minHeight: 28, alignItems: "center", textTransform: "uppercase" }}>LEGENDA DE PECAS</div>
              {componentLabels.slice(0, 7).map((item, index) => (
                <div key={`legend-${item}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderBottom: "1px solid #d1d1d1" }}>
                  <div style={{ display: "flex", width: 54, height: 16, background: index === 0 || index === 1 ? "#b9dceb" : "#f0dc6b", border: "1px solid #777" }} />
                  <div style={{ display: "flex", fontSize: 12, fontWeight: 800, textTransform: "uppercase", flex: 1 }}>{`${index + 1}  ${item}`}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #777" }}>
              <div style={{ display: "flex", justifyContent: "center", background: "#e0e0e0", borderBottom: "1px solid #777", fontSize: 14, fontWeight: 900, minHeight: 28, alignItems: "center", textTransform: "uppercase" }}>ESPECIFICACOES TECNICAS</div>
              {torqueRows.map((item, index) => (
                <div key={`${item.component}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "5px 8px", borderBottom: "1px solid #d1d1d1", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                  <div style={{ display: "flex", flex: 1 }}>{item.component}</div>
                  <div style={{ display: "flex" }}>{item.value}</div>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 8, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                <div>{measureLines[0] || `MOTOR: ${engine}`}</div>
                <div>{measureLines[1] || `FAMILIA: ${matchedFamily}`}</div>
                <div>{referenceLines[0] || `APLICACAO: ${matchedApplication}`}</div>
                <div>{referenceLines[1] || `ANOS: ${matchedYears}`}</div>
              </div>
            </div>

            <div style={{ display: "flex", fontSize: 11, fontWeight: 800, color: "#333", textTransform: "uppercase" }}>
              {aiMode ? "ILUSTRACAO TECNICA VIA NANO BANANA 2" : "LAYOUT TECNICO LOCAL"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #555", paddingTop: 6, fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>
        <div>{`APLICACAO: ${matchedApplication}`}</div>
        <div>{`FAMILIA: ${matchedFamily}`}</div>
        <div>{`ANOS: ${matchedYears}`}</div>
      </div>
    </div>
  );
}
