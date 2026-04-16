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
}: {
  title: string;
  firingOrder: string;
  admission: string;
  exhaust: string;
  notes: string[];
  procedure: ProcedureItem[];
}) {
  return (
    <div
      style={{
        width: 2200,
        height: 1500,
        display: "flex",
        flexDirection: "column",
        background: "#dce4ea",
        padding: 16,
        gap: 18,
        color: "#111827",
        fontFamily: "MTManual",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "3px solid #111827",
          borderRadius: 16,
          background: "#f8fafc",
          padding: "16px 24px",
        }}
      >
        <div style={{ display: "flex", fontSize: 48, fontWeight: 800, textAlign: "center" }}>{title}</div>
      </div>

      <div style={{ display: "flex", gap: 18, flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 760,
            border: "3px solid #374151",
            borderRadius: 16,
            background: "#f6f7f9",
            padding: 16,
            gap: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 800 }}>CABECOTE E AJUSTE</div>
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700 }}>ROTACAO -&gt;</div>
          </div>

          <div style={{ display: "flex", gap: 20, flex: 1, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`adm-${index}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 70, height: 28, borderRadius: 6, background: "#1f9d39", color: "#fff", fontSize: 15, fontWeight: 700 }}>ADM</div>
                  <div style={{ display: "flex", width: 48, height: 3, background: "#1f9d39" }} />
                  <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#1f9d39" }}>{index % 2 === 0 ? `${admission} mm` : ""}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 24px", border: "3px solid #374151", borderRadius: 18, background: "#cfd7dd" }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`cyl-${index}`} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 58, height: 58, borderRadius: 999, border: "4px solid #374151", background: "#dfe5ea", fontSize: 18, fontWeight: 800 }}>{index + 1}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", width: 22, height: 22, borderRadius: 999, background: "#67c26f", border: "2px solid #2e7d32" }} />
                    <div style={{ display: "flex", width: 22, height: 22, borderRadius: 999, background: "#e35046", border: "2px solid #8b1e18" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`esc-${index}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 70, height: 28, borderRadius: 6, background: "#d63c35", color: "#fff", fontSize: 15, fontWeight: 700 }}>ESC</div>
                  <div style={{ display: "flex", width: 48, height: 3, background: "#d63c35" }} />
                  <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#d63c35" }}>{index % 2 === 1 ? `${exhaust} mm` : ""}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "3px solid #374151", borderRadius: 14, background: "#f8fafc", padding: "12px 18px", fontSize: 28, fontWeight: 800 }}>
            CONDICAO: MOTOR FRIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 520, gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 16, background: "#f6f7f9", padding: 16, gap: 14, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>VISTA GERAL DO MOTOR</div>
            <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`t-${index}`} style={{ display: "flex", width: 20, height: 14, borderRadius: 4, background: "#c5d0d8", border: "2px solid #374151" }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 190, height: 56, borderRadius: 10, background: "#c7d0d8", border: "3px solid #374151" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 240, height: 62, borderRadius: 10, background: "#b5bec6", border: "3px solid #374151", padding: "0 12px" }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`h-${index}`} style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: "#8594a0", border: "2px solid #374151" }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 300 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 72, height: 72, borderRadius: 999, background: "#d9dfe5", border: "4px solid #374151" }}>
                    <div style={{ display: "flex", width: 38, height: 38, borderRadius: 999, background: "#92a0ab", border: "3px solid #374151" }} />
                  </div>
                  <div style={{ display: "flex", width: 170, height: 180, borderRadius: 18, background: "#bcc6cf", border: "3px solid #374151" }} />
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 56, height: 56, borderRadius: 999, background: "#d9dfe5", border: "4px solid #374151" }}>
                    <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, background: "#92a0ab", border: "3px solid #374151" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 220, height: 74, borderRadius: 12, background: "#c4ced6", border: "3px solid #374151", padding: "0 10px" }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`r-${index}`} style={{ display: "flex", width: 16, height: 16, borderRadius: 999, background: "#9ca9b4", border: "2px solid #374151" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 16, background: "#e8eff4", padding: 16, gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>COMO MEDIR</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, border: "3px solid #374151", borderRadius: 12, background: "#d6e0e8", padding: 16 }}>
              <div style={{ display: "flex", width: 80, height: 4, background: "#111827" }} />
              <div style={{ display: "flex", width: 4, height: 46, background: "#111827" }} />
              <div style={{ display: "flex", width: 54, height: 16, borderRadius: 8, background: "#97a5b0", border: "3px solid #374151" }} />
              <div style={{ display: "flex", width: 120, height: 8, background: "#111827", borderRadius: 6 }} />
              <div style={{ display: "flex", width: 52, height: 20, borderRadius: 10, background: "#cbd6de", border: "3px solid #374151" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>USAR LAMINA CALIBRADORA COM LEVE RESISTENCIA</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 16, background: "#f6f7f9", padding: 16, gap: 8, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>PROCEDIMENTO DE REGULAGEM</div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>BALANCO EM CRUZ</div>
            <div style={{ display: "flex", justifyContent: "center", border: "3px solid #374151", background: "#dbe3e9", padding: 10, fontSize: 28, fontWeight: 800 }}>{firingOrder}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {procedure.map((item, index) => (
                <div key={`${item.balance}-${item.regular}-${index}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "2px solid #374151", height: 86, padding: "0 14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", width: 190, gap: 4 }}>
                    <div style={{ display: "flex", fontSize: 15, fontWeight: 700 }}>{`PASSO ${index + 1}`}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, border: "3px solid #374151", background: "#d9e3ea", justifyContent: "center", alignItems: "center", fontSize: 18, fontWeight: 800 }}>{item.balance}</div>
                      <div style={{ display: "flex", fontSize: 16, fontWeight: 700 }}>EM BALANCO</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>-&gt;</div>
                  <div style={{ display: "flex", flexDirection: "column", width: 190, gap: 4, alignItems: "flex-end" }}>
                    <div style={{ display: "flex", fontSize: 16, fontWeight: 700 }}>REGULAR ADM E ESC</div>
                    <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, border: "3px solid #374151", background: "#e4efe7", justifyContent: "center", alignItems: "center", fontSize: 18, fontWeight: 800 }}>{item.regular}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #374151", borderRadius: 16, background: "#f6f7f9", padding: 18, gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>FOLGAS ESPECIFICADAS (FRIO)</div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: "#108a2f" }}>{`ADM (ADMISSAO): ${admission} mm`}</div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: "#c62828" }}>{`ESC (ESCAPE): ${exhaust} mm`}</div>
            {notes.slice(0, 3).map((note) => (
              <div key={note} style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#334155" }}>
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
