import { jsx as d, jsxs as m, Fragment as I } from "react/jsx-runtime";
import { useState as k, useEffect as y, useCallback as g, useRef as w } from "react";
const h = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" }
];
function z(e) {
  try {
    const r = localStorage.getItem(e);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
}
function D(e, r) {
  try {
    localStorage.setItem(e, JSON.stringify(r));
  } catch {
  }
}
function N(e = "react-sticky-notes") {
  const r = `sticky-notes:${e}`, [u, i] = k(() => z(r));
  y(() => {
    D(r, u);
  }, [r, u]);
  const p = g((c, t) => {
    const s = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: c,
      y: t,
      text: "",
      colorIndex: 0,
      minimized: !1,
      createdAt: Date.now()
    };
    return i((a) => [...a, s]), s;
  }, []), o = g((c, t) => {
    i(
      (s) => s.map((a) => a.id === c ? { ...a, ...t } : a)
    );
  }, []), f = g((c) => {
    i((t) => t.filter((s) => s.id !== c));
  }, []);
  return { notes: u, addNote: p, updateNote: o, deleteNote: f };
}
const L = `@keyframes stickyNotePulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.18); opacity: 1; }
}`;
let S = !1;
function M() {
  if (S) return;
  const e = document.createElement("style");
  e.textContent = L, document.head.appendChild(e), S = !0;
}
function R({ note: e, onUpdate: r, onDelete: u }) {
  const i = h[e.colorIndex % h.length], p = w(null), [o, f] = k(!1), c = w(!1), t = w({ x: 0, y: 0 });
  y(() => {
    M();
  }, []);
  const s = g(
    (n, l) => {
      t.current = {
        x: n - e.x,
        y: l - e.y
      }, c.current = !1, f(!0);
    },
    [e.x, e.y]
  ), a = g(
    (n, l) => {
      o && (c.current = !0, r(e.id, {
        x: n - t.current.x,
        y: l - t.current.y
      }));
    },
    [o, e.id, r]
  ), v = g(() => {
    f(!1);
  }, []);
  y(() => {
    if (!o) return;
    const n = (b) => a(b.clientX, b.clientY), l = (b) => {
      b.preventDefault(), a(b.touches[0].clientX, b.touches[0].clientY);
    }, x = () => v();
    return window.addEventListener("mousemove", n), window.addEventListener("mouseup", x), window.addEventListener("touchmove", l, { passive: !1 }), window.addEventListener("touchend", x), () => {
      window.removeEventListener("mousemove", n), window.removeEventListener("mouseup", x), window.removeEventListener("touchmove", l), window.removeEventListener("touchend", x);
    };
  }, [o, a, v]);
  const C = () => {
    r(e.id, {
      colorIndex: (e.colorIndex + 1) % h.length
    });
  }, E = () => {
    window.confirm("Delete this note?") && u(e.id);
  };
  return e.minimized ? /* @__PURE__ */ d(
    "div",
    {
      onMouseDown: (n) => {
        n.preventDefault(), s(n.clientX, n.clientY);
      },
      onTouchStart: (n) => {
        s(n.touches[0].clientX, n.touches[0].clientY);
      },
      onClick: () => {
        c.current || r(e.id, { minimized: !1 });
      },
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: i.border,
        cursor: o ? "grabbing" : "pointer",
        zIndex: 1e4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        animation: o ? "none" : "stickyNotePulse 2.5s ease-in-out infinite"
      },
      title: "Click to expand"
    }
  ) : /* @__PURE__ */ m(
    "div",
    {
      ref: p,
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
        width: 220,
        backgroundColor: i.bg,
        border: `1.5px solid ${i.border}`,
        borderRadius: 8,
        boxShadow: o ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.12)",
        zIndex: o ? 10002 : 10001,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13,
        userSelect: o ? "none" : "auto",
        transition: o ? "none" : "box-shadow 0.2s"
      },
      children: [
        /* @__PURE__ */ m(
          "div",
          {
            onMouseDown: (n) => {
              n.preventDefault(), s(n.clientX, n.clientY);
            },
            onTouchStart: (n) => {
              s(n.touches[0].clientX, n.touches[0].clientY);
            },
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 8px",
              cursor: "grab",
              borderBottom: `1px solid ${i.border}`,
              borderRadius: "8px 8px 0 0",
              backgroundColor: i.border + "33"
            },
            children: [
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    width: 30,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: i.border,
                    opacity: 0.5
                  }
                }
              ),
              /* @__PURE__ */ m("div", { style: { display: "flex", gap: 4 }, children: [
                /* @__PURE__ */ d(
                  "button",
                  {
                    onClick: C,
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `1.5px solid ${i.text}44`,
                      background: `conic-gradient(${h.map((n, l) => `${n.border} ${l / h.length * 100}% ${(l + 1) / h.length * 100}%`).join(", ")})`,
                      cursor: "pointer",
                      padding: 0
                    },
                    title: "Change color"
                  }
                ),
                /* @__PURE__ */ d(
                  "button",
                  {
                    onClick: () => r(e.id, { minimized: !0 }),
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "none",
                      background: i.text + "22",
                      color: i.text,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      lineHeight: 1,
                      padding: 0
                    },
                    title: "Minimize",
                    children: "−"
                  }
                ),
                /* @__PURE__ */ d(
                  "button",
                  {
                    onClick: E,
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "none",
                      background: "#ef444433",
                      color: "#dc2626",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      lineHeight: 1,
                      padding: 0
                    },
                    title: "Delete",
                    children: "×"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ d(
          "textarea",
          {
            value: e.text,
            onChange: (n) => r(e.id, { text: n.target.value }),
            placeholder: "Write a note...",
            style: {
              width: "100%",
              minHeight: 80,
              padding: "8px 10px",
              border: "none",
              background: "transparent",
              color: i.text,
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box"
            }
          }
        )
      ]
    }
  );
}
function Y({ storageKey: e = "react-sticky-notes" }) {
  const { notes: r, addNote: u, updateNote: i, deleteNote: p } = N(e), [o, f] = k(!1), c = g(
    (t) => {
      t.target.closest("[data-sticky-fab]") || t.target.closest("[data-sticky-note]") || (u(t.clientX - 110, t.clientY - 20), f(!1));
    },
    [u]
  );
  return y(() => {
    if (!o) return;
    const t = (s) => {
      s.key === "Escape" && f(!1);
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [o]), /* @__PURE__ */ m(I, { children: [
    o && /* @__PURE__ */ d(
      "div",
      {
        onClick: c,
        style: {
          position: "fixed",
          inset: 0,
          cursor: "crosshair",
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.05)"
        }
      }
    ),
    r.map((t) => /* @__PURE__ */ d("div", { "data-sticky-note": !0, children: /* @__PURE__ */ d(
      R,
      {
        note: t,
        onUpdate: i,
        onDelete: p
      }
    ) }, t.id)),
    /* @__PURE__ */ d(
      "button",
      {
        "data-sticky-fab": !0,
        onClick: () => f((t) => !t),
        style: {
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          backgroundColor: o ? "#ef4444" : "#fbbf24",
          color: o ? "#fff" : "#713f12",
          fontSize: 24,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "all 0.2s",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        },
        onMouseEnter: (t) => {
          t.currentTarget.style.transform = "scale(1.1)";
        },
        onMouseLeave: (t) => {
          t.currentTarget.style.transform = "scale(1)";
        },
        title: o ? "Cancel (Esc)" : "Add sticky note",
        children: o ? "×" : "+"
      }
    )
  ] });
}
export {
  h as COLORS,
  Y as StickyNotes,
  N as useNotes
};
