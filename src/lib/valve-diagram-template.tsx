import React from "react";

type ProcedureItem = {
  balance: string;
  regular: string;
};

export function createValveDiagramElement({
  title,
  firingOrder,
  admission,
  exhaust,
  notes,
  procedure,
  illustrationDataUrl,
}: {
  title: string;
  firingOrder: string;
  admission: string;
  exhaust: string;
  notes: string[];
  procedure: ProcedureItem[];
  illustrationDataUrl?: string | null;
}) {
  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #edf3f7 0%, #eef2f4 100%)",
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
          background: "#f6f8fa",
          fontSize: 34,
          fontWeight: 900,
          textAlign: "center",
          padding: "0 12px",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 720, gap: 10 }}>
          <div style={{ display: "flex", flex: 1, border: "2px solid #c8d0d6", borderRadius: 12, background: "#efefef", padding: 12, gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "ADMISSAO", color: "#1f9d39", value: `${admission}mm` },
                { label: "ESCAPE", color: "#cf362a", value: `${exhaust}mm` },
                { label: "ESCAPE", color: "#cf362a", value: `${exhaust}mm` },
                { label: "ADMISSAO", color: "#1f9d39", value: `${admission}mm` },
                { label: "ESCAPE", color: "#cf362a", value: `${exhaust}mm` },
              ].map((item, index) => (
                <div key={`${item.label}-${index}`} style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
                  <div style={{ display: "flex", padding: "6px 10px", borderRadius: 8, background: item.color, color: "#fff", fontSize: 14, fontWeight: 900 }}>{item.label}</div>
                  <div style={{ display: "flex", padding: "6px 10px", borderRadius: 8, background: item.color, color: "#fff", fontSize: 18, fontWeight: 900 }}>{item.value}</div>
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 118, border: "3px solid #374151", borderRadius: 12, background: "#f8fafc", fontSize: 30, fontWeight: 900 }}>
            CONDICAO: MOTOR FRIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 760, gap: 10 }}>
          <div style={{ display: "flex", flex: 1, border: "2px solid #c8d0d6", borderRadius: 12, background: "#efefef", padding: 12, gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>VISTA GERAL DO MOTOR</div>
              {illustrationDataUrl ? (
                <img src={illustrationDataUrl} alt="motor" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 12, border: "3px solid #374151" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: 320 }}>
                    {Array.from({ length: 6 }).map((_, index) => (
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
            <div style={{ display: "flex", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>COMO MEDIR</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flex: 1 }}>
              <div style={{ display: "flex", width: 80, height: 80, borderRadius: 999, border: "5px solid #374151", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, background: "#9aa9b3", border: "3px solid #374151" }} />
              </div>
              <div style={{ display: "flex", width: 10, height: 120, background: "#374151", borderRadius: 8 }} />
              <div style={{ display: "flex", width: 160, height: 16, background: "#374151", borderRadius: 8 }} />
              <div style={{ display: "flex", width: 86, height: 32, background: "#c8d2d8", border: "3px solid #374151", borderRadius: 10 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>USAR LAMINA CALIBRADORA COM LEVE RESISTENCIA</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 12, background: "#f1f5f8", overflow: "hidden", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 112, borderBottom: "3px solid #374151", background: "#e6edf2" }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 900 }}>PROCEDIMENTO DE REGULAGEM</div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 900 }}>(BALANCO EM CRUZ)</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 64, borderBottom: "3px solid #374151", fontSize: 34, fontWeight: 900 }}>
              {firingOrder}
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {procedure.map((item, index) => (
                <div key={`${item.balance}-${item.regular}-${index}`} style={{ display: "flex", minHeight: 104, borderBottom: index === procedure.length - 1 ? "none" : "2px solid #374151" }}>
                  <div style={{ display: "flex", width: 60, alignItems: "center", justifyContent: "center", borderRight: "2px solid #374151", fontSize: 22, fontWeight: 900 }}>{index + 1}</div>
                  <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>{`CILINDRO ${item.balance}`}</div>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>EM BALANCO</div>
                    </div>
                    <div style={{ display: "flex", width: 120, height: 3, background: "#111827" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>{`CILINDRO ${item.regular}`}</div>
                      <div style={{ display: "flex", fontSize: 17, fontWeight: 900 }}>REGULAR: ADM E ESCAPE</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 12, background: "#f6f8fa", padding: 12, gap: 6 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 900 }}>FOLGAS ESPECIFICADAS (FRIO):</div>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#108a2f" }}>{`ADM (Admissao): ${admission} mm`}</div>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#c62828" }}>{`ESC (Escape): ${exhaust} mm`}</div>
            {notes.slice(0, 2).map((note) => (
              <div key={note} style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#334155" }}>{note}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
