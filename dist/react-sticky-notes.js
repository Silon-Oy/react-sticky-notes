import { jsx as a, jsxs as m, Fragment as C } from "react/jsx-runtime";
import { useState as y, useEffect as w, useCallback as g, useRef as v } from "react";
const x = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" }
];
function S(e) {
  try {
    const r = localStorage.getItem(e);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
}
function E(e, r) {
  try {
    localStorage.setItem(e, JSON.stringify(r));
  } catch {
  }
}
function z(e = "react-sticky-notes") {
  const r = `sticky-notes:${e}`, [l, i] = y(() => S(r));
  w(() => {
    E(r, l);
  }, [r, l]);
  const h = g((d, t) => {
    const s = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: d,
      y: t,
      text: "",
      colorIndex: 0,
      minimized: !1,
      createdAt: Date.now()
    };
    return i((f) => [...f, s]), s;
  }, []), n = g((d, t) => {
    i(
      (s) => s.map((f) => f.id === d ? { ...f, ...t } : f)
    );
  }, []), u = g((d) => {
    i((t) => t.filter((s) => s.id !== d));
  }, []);
  return { notes: l, addNote: h, updateNote: n, deleteNote: u };
}
function I({ note: e, onUpdate: r, onDelete: l }) {
  const i = x[e.colorIndex % x.length], h = v(null), [n, u] = y(!1), d = v({ x: 0, y: 0 }), t = g(
    (o, c) => {
      d.current = {
        x: o - e.x,
        y: c - e.y
      }, u(!0);
    },
    [e.x, e.y]
  ), s = g(
    (o, c) => {
      n && r(e.id, {
        x: o - d.current.x,
        y: c - d.current.y
      });
    },
    [n, e.id, r]
  ), f = g(() => {
    u(!1);
  }, []);
  w(() => {
    if (!n) return;
    const o = (b) => s(b.clientX, b.clientY), c = (b) => {
      b.preventDefault(), s(b.touches[0].clientX, b.touches[0].clientY);
    }, p = () => f();
    return window.addEventListener("mousemove", o), window.addEventListener("mouseup", p), window.addEventListener("touchmove", c, { passive: !1 }), window.addEventListener("touchend", p), () => {
      window.removeEventListener("mousemove", o), window.removeEventListener("mouseup", p), window.removeEventListener("touchmove", c), window.removeEventListener("touchend", p);
    };
  }, [n, s, f]);
  const k = () => {
    r(e.id, {
      colorIndex: (e.colorIndex + 1) % x.length
    });
  };
  return e.minimized ? /* @__PURE__ */ a(
    "div",
    {
      onClick: () => r(e.id, { minimized: !1 }),
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: i.border,
        cursor: "pointer",
        zIndex: 1e4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "transform 0.15s"
      },
      onMouseEnter: (o) => o.currentTarget.style.transform = "scale(1.3)",
      onMouseLeave: (o) => o.currentTarget.style.transform = "scale(1)",
      title: "Click to expand"
    }
  ) : /* @__PURE__ */ m(
    "div",
    {
      ref: h,
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
        width: 220,
        backgroundColor: i.bg,
        border: `1.5px solid ${i.border}`,
        borderRadius: 8,
        boxShadow: n ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.12)",
        zIndex: n ? 10002 : 10001,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13,
        userSelect: n ? "none" : "auto",
        transition: n ? "none" : "box-shadow 0.2s"
      },
      children: [
        /* @__PURE__ */ m(
          "div",
          {
            onMouseDown: (o) => {
              o.preventDefault(), t(o.clientX, o.clientY);
            },
            onTouchStart: (o) => {
              t(o.touches[0].clientX, o.touches[0].clientY);
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
              /* @__PURE__ */ a(
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
                /* @__PURE__ */ a(
                  "button",
                  {
                    onClick: k,
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `1.5px solid ${i.text}44`,
                      background: `conic-gradient(${x.map((o, c) => `${o.border} ${c / x.length * 100}% ${(c + 1) / x.length * 100}%`).join(", ")})`,
                      cursor: "pointer",
                      padding: 0
                    },
                    title: "Change color"
                  }
                ),
                /* @__PURE__ */ a(
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
                /* @__PURE__ */ a(
                  "button",
                  {
                    onClick: () => l(e.id),
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
        /* @__PURE__ */ a(
          "textarea",
          {
            value: e.text,
            onChange: (o) => r(e.id, { text: o.target.value }),
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
function M({ storageKey: e = "react-sticky-notes" }) {
  const { notes: r, addNote: l, updateNote: i, deleteNote: h } = z(e), [n, u] = y(!1), d = g(
    (t) => {
      t.target.closest("[data-sticky-fab]") || t.target.closest("[data-sticky-note]") || (l(t.clientX - 110, t.clientY - 20), u(!1));
    },
    [l]
  );
  return w(() => {
    if (!n) return;
    const t = (s) => {
      s.key === "Escape" && u(!1);
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [n]), /* @__PURE__ */ m(C, { children: [
    n && /* @__PURE__ */ a(
      "div",
      {
        onClick: d,
        style: {
          position: "fixed",
          inset: 0,
          cursor: "crosshair",
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.05)"
        }
      }
    ),
    r.map((t) => /* @__PURE__ */ a("div", { "data-sticky-note": !0, children: /* @__PURE__ */ a(
      I,
      {
        note: t,
        onUpdate: i,
        onDelete: h
      }
    ) }, t.id)),
    /* @__PURE__ */ a(
      "button",
      {
        "data-sticky-fab": !0,
        onClick: () => u((t) => !t),
        style: {
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          backgroundColor: n ? "#ef4444" : "#fbbf24",
          color: n ? "#fff" : "#713f12",
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
        title: n ? "Cancel (Esc)" : "Add sticky note",
        children: n ? "×" : "+"
      }
    )
  ] });
}
export {
  x as COLORS,
  M as StickyNotes,
  z as useNotes
};
