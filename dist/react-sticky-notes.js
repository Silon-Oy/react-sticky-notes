import { jsx as b, jsxs as N, Fragment as T } from "react/jsx-runtime";
import { useState as z, useRef as S, useEffect as C, useCallback as p } from "react";
const k = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" }
];
function L(e) {
  try {
    const n = localStorage.getItem(e);
    return n ? JSON.parse(n) : [];
  } catch {
    return [];
  }
}
function $(e, n) {
  try {
    localStorage.setItem(e, JSON.stringify(n));
  } catch {
  }
}
async function I(e, n, d) {
  const r = await fetch(e, {
    ...n,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": d,
      ...n && n.headers
    }
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
function R(e = "react-sticky-notes", n = null, d = null) {
  const r = !!n, g = `sticky-notes:${e}`, [a, y] = z(() => r ? [] : L(g)), s = S(/* @__PURE__ */ new Set()), h = S({});
  C(() => {
    r || $(g, a);
  }, [r, g, a]), C(() => {
    if (!r) return;
    let c = !0;
    const u = async () => {
      try {
        const m = await I(n, {}, d);
        if (!c) return;
        y((E) => {
          const t = m.map((i) => s.current.has(i.id) && E.find((f) => f.id === i.id) || i);
          for (const i of E)
            s.current.has(i.id) && !m.find((f) => f.id === i.id) && t.push(i);
          return t;
        });
      } catch {
      }
    };
    u();
    const l = setInterval(u, 3e3);
    return () => {
      c = !1, clearInterval(l);
    };
  }, [r, n, d]);
  const w = p(
    (c, u) => {
      const l = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        x: c,
        y: u,
        text: "",
        colorIndex: 0,
        minimized: !1,
        createdAt: Date.now()
      };
      return y((m) => [...m, l]), r && (s.current.add(l.id), I(n, { method: "POST", body: JSON.stringify(l) }, d).catch(() => {
      }).finally(() => s.current.delete(l.id))), l;
    },
    [r, n, d]
  ), o = p(
    (c, u) => {
      y(
        (l) => l.map((m) => m.id === c ? { ...m, ...u } : m)
      ), r && (s.current.add(c), clearTimeout(h.current[c]), h.current[c] = setTimeout(() => {
        I(
          `${n}/${c}`,
          { method: "PUT", body: JSON.stringify(u) },
          d
        ).catch(() => {
        }).finally(() => s.current.delete(c));
      }, 150));
    },
    [r, n, d]
  ), v = p(
    (c) => {
      y((u) => u.filter((l) => l.id !== c)), r && (s.current.add(c), I(`${n}/${c}`, { method: "DELETE" }, d).catch(() => {
      }).finally(() => s.current.delete(c)));
    },
    [r, n, d]
  );
  return { notes: a, addNote: w, updateNote: o, deleteNote: v };
}
const M = `@keyframes stickyNotePulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.18); opacity: 1; }
}`;
let D = !1;
function j() {
  if (D) return;
  const e = document.createElement("style");
  e.textContent = M, document.head.appendChild(e), D = !0;
}
function O({ note: e, onUpdate: n, onDelete: d }) {
  const r = k[e.colorIndex % k.length], g = S(null), [a, y] = z(!1), s = S(!1), h = S({ x: 0, y: 0 }), w = S({ x: 0, y: 0 });
  C(() => {
    j();
  }, []), C(() => {
    !e.minimized && g.current && requestAnimationFrame(() => {
      var i;
      const t = (i = g.current) == null ? void 0 : i.querySelector("textarea");
      t && t.focus();
    });
  }, [e.minimized]);
  const o = p(
    (t, i) => {
      w.current = {
        x: t - e.x,
        y: i - e.y
      }, h.current = { x: t, y: i }, s.current = !1, y(!0);
    },
    [e.x, e.y]
  ), v = 5, c = p(
    (t, i) => {
      if (!a) return;
      const f = t - h.current.x, x = i - h.current.y;
      !s.current && f * f + x * x < v * v || (s.current = !0, n(e.id, {
        x: t - w.current.x,
        y: i - w.current.y
      }));
    },
    [a, e.id, n]
  ), u = p(() => {
    y(!1);
  }, []);
  C(() => {
    if (!a) return;
    const t = (x) => c(x.clientX, x.clientY), i = (x) => {
      x.preventDefault(), c(x.touches[0].clientX, x.touches[0].clientY);
    }, f = () => u();
    return window.addEventListener("mousemove", t), window.addEventListener("mouseup", f), window.addEventListener("touchmove", i, { passive: !1 }), window.addEventListener("touchend", f), () => {
      window.removeEventListener("mousemove", t), window.removeEventListener("mouseup", f), window.removeEventListener("touchmove", i), window.removeEventListener("touchend", f);
    };
  }, [a, c, u]);
  const l = () => {
    n(e.id, {
      colorIndex: (e.colorIndex + 1) % k.length
    });
  }, m = () => {
    window.confirm("Delete this note?") && d(e.id);
  }, E = p(
    (t) => {
      t.relatedTarget && t.currentTarget.contains(t.relatedTarget) || a || n(e.id, { minimized: !0 });
    },
    [e.id, n, a]
  );
  return e.minimized ? /* @__PURE__ */ b(
    "div",
    {
      onMouseDown: (t) => {
        t.preventDefault(), o(t.clientX, t.clientY);
      },
      onTouchStart: (t) => {
        o(t.touches[0].clientX, t.touches[0].clientY);
      },
      onClick: () => {
        s.current || n(e.id, { minimized: !1 });
      },
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: r.border,
        cursor: a ? "grabbing" : "pointer",
        zIndex: 1e4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        animation: a ? "none" : "stickyNotePulse 2.5s ease-in-out infinite"
      },
      title: "Click to expand"
    }
  ) : /* @__PURE__ */ N(
    "div",
    {
      ref: g,
      tabIndex: -1,
      onBlur: E,
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
        width: 220,
        backgroundColor: r.bg,
        border: `1.5px solid ${r.border}`,
        borderRadius: 8,
        boxShadow: a ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.12)",
        zIndex: a ? 10002 : 10001,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13,
        userSelect: a ? "none" : "auto",
        transition: a ? "none" : "box-shadow 0.2s",
        outline: "none"
      },
      children: [
        /* @__PURE__ */ N(
          "div",
          {
            onMouseDown: (t) => {
              t.preventDefault(), o(t.clientX, t.clientY);
            },
            onTouchStart: (t) => {
              o(t.touches[0].clientX, t.touches[0].clientY);
            },
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 8px",
              cursor: "grab",
              borderBottom: `1px solid ${r.border}`,
              borderRadius: "8px 8px 0 0",
              backgroundColor: r.border + "33"
            },
            children: [
              /* @__PURE__ */ b(
                "div",
                {
                  style: {
                    width: 30,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: r.border,
                    opacity: 0.5
                  }
                }
              ),
              /* @__PURE__ */ N("div", { style: { display: "flex", gap: 4 }, children: [
                /* @__PURE__ */ b(
                  "button",
                  {
                    onClick: l,
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `1.5px solid ${r.text}44`,
                      background: `conic-gradient(${k.map((t, i) => `${t.border} ${i / k.length * 100}% ${(i + 1) / k.length * 100}%`).join(", ")})`,
                      cursor: "pointer",
                      padding: 0
                    },
                    title: "Change color"
                  }
                ),
                /* @__PURE__ */ b(
                  "button",
                  {
                    onClick: () => n(e.id, { minimized: !0 }),
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "none",
                      background: r.text + "22",
                      color: r.text,
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
                /* @__PURE__ */ b(
                  "button",
                  {
                    onClick: m,
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
        /* @__PURE__ */ b(
          "textarea",
          {
            value: e.text,
            onChange: (t) => n(e.id, { text: t.target.value }),
            placeholder: "Write a note...",
            style: {
              width: "100%",
              minHeight: 80,
              padding: "8px 10px",
              border: "none",
              background: "transparent",
              color: r.text,
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
function A({
  storageKey: e = "react-sticky-notes",
  apiUrl: n = null,
  apiKey: d = null
}) {
  const { notes: r, addNote: g, updateNote: a, deleteNote: y } = R(
    e,
    n,
    d
  ), [s, h] = z(!1), w = p(
    (o) => {
      o.target.closest("[data-sticky-fab]") || o.target.closest("[data-sticky-note]") || (g(o.clientX - 110, o.clientY - 20), h(!1));
    },
    [g]
  );
  return C(() => {
    if (!s) return;
    const o = (v) => {
      v.key === "Escape" && h(!1);
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [s]), /* @__PURE__ */ N(T, { children: [
    s && /* @__PURE__ */ b(
      "div",
      {
        onClick: w,
        style: {
          position: "fixed",
          inset: 0,
          cursor: "crosshair",
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.05)"
        }
      }
    ),
    r.map((o) => /* @__PURE__ */ b("div", { "data-sticky-note": !0, children: /* @__PURE__ */ b(O, { note: o, onUpdate: a, onDelete: y }) }, o.id)),
    /* @__PURE__ */ b(
      "button",
      {
        "data-sticky-fab": !0,
        onClick: () => h((o) => !o),
        style: {
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          backgroundColor: s ? "#ef4444" : "#fbbf24",
          color: s ? "#fff" : "#713f12",
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
        onMouseEnter: (o) => {
          o.currentTarget.style.transform = "scale(1.1)";
        },
        onMouseLeave: (o) => {
          o.currentTarget.style.transform = "scale(1)";
        },
        title: s ? "Cancel (Esc)" : "Add sticky note",
        children: s ? "×" : "+"
      }
    )
  ] });
}
export {
  k as COLORS,
  A as StickyNotes,
  R as useNotes
};
