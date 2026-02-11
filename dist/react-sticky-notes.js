import { jsx as m, jsxs as E, Fragment as D } from "react/jsx-runtime";
import { useState as N, useRef as S, useEffect as k, useCallback as x } from "react";
const v = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" }
];
function T(t) {
  try {
    const n = localStorage.getItem(t);
    return n ? JSON.parse(n) : [];
  } catch {
    return [];
  }
}
function $(t, n) {
  try {
    localStorage.setItem(t, JSON.stringify(n));
  } catch {
  }
}
async function C(t, n, l) {
  const r = await fetch(t, {
    ...n,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": l,
      ...n && n.headers
    }
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
function L(t = "react-sticky-notes", n = null, l = null) {
  const r = !!n, g = `sticky-notes:${t}`, [s, b] = N(() => r ? [] : T(g)), i = S(/* @__PURE__ */ new Set()), h = S({});
  k(() => {
    r || $(g, s);
  }, [r, g, s]), k(() => {
    if (!r) return;
    let c = !0;
    const f = async () => {
      try {
        const e = await C(n, {}, l);
        if (!c) return;
        b((a) => {
          const p = e.map((d) => i.current.has(d.id) && a.find((I) => I.id === d.id) || d);
          for (const d of a)
            i.current.has(d.id) && !e.find((I) => I.id === d.id) && p.push(d);
          return p;
        });
      } catch {
      }
    };
    f();
    const u = setInterval(f, 3e3);
    return () => {
      c = !1, clearInterval(u);
    };
  }, [r, n, l]);
  const y = x(
    (c, f) => {
      const u = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        x: c,
        y: f,
        text: "",
        colorIndex: 0,
        minimized: !1,
        createdAt: Date.now()
      };
      return b((e) => [...e, u]), r && (i.current.add(u.id), C(n, { method: "POST", body: JSON.stringify(u) }, l).catch(() => {
      }).finally(() => i.current.delete(u.id))), u;
    },
    [r, n, l]
  ), o = x(
    (c, f) => {
      b(
        (u) => u.map((e) => e.id === c ? { ...e, ...f } : e)
      ), r && (i.current.add(c), clearTimeout(h.current[c]), h.current[c] = setTimeout(() => {
        C(
          `${n}/${c}`,
          { method: "PUT", body: JSON.stringify(f) },
          l
        ).catch(() => {
        }).finally(() => i.current.delete(c));
      }, 150));
    },
    [r, n, l]
  ), w = x(
    (c) => {
      b((f) => f.filter((u) => u.id !== c)), r && (i.current.add(c), C(`${n}/${c}`, { method: "DELETE" }, l).catch(() => {
      }).finally(() => i.current.delete(c)));
    },
    [r, n, l]
  );
  return { notes: s, addNote: y, updateNote: o, deleteNote: w };
}
const M = `@keyframes stickyNotePulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.18); opacity: 1; }
}`;
let z = !1;
function R() {
  if (z) return;
  const t = document.createElement("style");
  t.textContent = M, document.head.appendChild(t), z = !0;
}
function j({ note: t, onUpdate: n, onDelete: l }) {
  const r = v[t.colorIndex % v.length], g = S(null), [s, b] = N(!1), i = S(!1), h = S({ x: 0, y: 0 });
  k(() => {
    R();
  }, []), k(() => {
    !t.minimized && g.current && requestAnimationFrame(() => {
      var a;
      const e = (a = g.current) == null ? void 0 : a.querySelector("textarea");
      e && e.focus();
    });
  }, [t.minimized]);
  const y = x(
    (e, a) => {
      h.current = {
        x: e - t.x,
        y: a - t.y
      }, i.current = !1, b(!0);
    },
    [t.x, t.y]
  ), o = x(
    (e, a) => {
      s && (i.current = !0, n(t.id, {
        x: e - h.current.x,
        y: a - h.current.y
      }));
    },
    [s, t.id, n]
  ), w = x(() => {
    b(!1);
  }, []);
  k(() => {
    if (!s) return;
    const e = (d) => o(d.clientX, d.clientY), a = (d) => {
      d.preventDefault(), o(d.touches[0].clientX, d.touches[0].clientY);
    }, p = () => w();
    return window.addEventListener("mousemove", e), window.addEventListener("mouseup", p), window.addEventListener("touchmove", a, { passive: !1 }), window.addEventListener("touchend", p), () => {
      window.removeEventListener("mousemove", e), window.removeEventListener("mouseup", p), window.removeEventListener("touchmove", a), window.removeEventListener("touchend", p);
    };
  }, [s, o, w]);
  const c = () => {
    n(t.id, {
      colorIndex: (t.colorIndex + 1) % v.length
    });
  }, f = () => {
    window.confirm("Delete this note?") && l(t.id);
  }, u = x(
    (e) => {
      e.relatedTarget && e.currentTarget.contains(e.relatedTarget) || s || n(t.id, { minimized: !0 });
    },
    [t.id, n, s]
  );
  return t.minimized ? /* @__PURE__ */ m(
    "div",
    {
      onMouseDown: (e) => {
        e.preventDefault(), y(e.clientX, e.clientY);
      },
      onTouchStart: (e) => {
        y(e.touches[0].clientX, e.touches[0].clientY);
      },
      onClick: () => {
        i.current || n(t.id, { minimized: !1 });
      },
      style: {
        position: "fixed",
        left: t.x,
        top: t.y,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: r.border,
        cursor: s ? "grabbing" : "pointer",
        zIndex: 1e4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        animation: s ? "none" : "stickyNotePulse 2.5s ease-in-out infinite"
      },
      title: "Click to expand"
    }
  ) : /* @__PURE__ */ E(
    "div",
    {
      ref: g,
      tabIndex: -1,
      onBlur: u,
      style: {
        position: "fixed",
        left: t.x,
        top: t.y,
        width: 220,
        backgroundColor: r.bg,
        border: `1.5px solid ${r.border}`,
        borderRadius: 8,
        boxShadow: s ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.12)",
        zIndex: s ? 10002 : 10001,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13,
        userSelect: s ? "none" : "auto",
        transition: s ? "none" : "box-shadow 0.2s",
        outline: "none"
      },
      children: [
        /* @__PURE__ */ E(
          "div",
          {
            onMouseDown: (e) => {
              e.preventDefault(), y(e.clientX, e.clientY);
            },
            onTouchStart: (e) => {
              y(e.touches[0].clientX, e.touches[0].clientY);
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
              /* @__PURE__ */ m(
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
              /* @__PURE__ */ E("div", { style: { display: "flex", gap: 4 }, children: [
                /* @__PURE__ */ m(
                  "button",
                  {
                    onClick: c,
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `1.5px solid ${r.text}44`,
                      background: `conic-gradient(${v.map((e, a) => `${e.border} ${a / v.length * 100}% ${(a + 1) / v.length * 100}%`).join(", ")})`,
                      cursor: "pointer",
                      padding: 0
                    },
                    title: "Change color"
                  }
                ),
                /* @__PURE__ */ m(
                  "button",
                  {
                    onClick: () => n(t.id, { minimized: !0 }),
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
                /* @__PURE__ */ m(
                  "button",
                  {
                    onClick: f,
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
        /* @__PURE__ */ m(
          "textarea",
          {
            value: t.text,
            onChange: (e) => n(t.id, { text: e.target.value }),
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
function O({
  storageKey: t = "react-sticky-notes",
  apiUrl: n = null,
  apiKey: l = null
}) {
  const { notes: r, addNote: g, updateNote: s, deleteNote: b } = L(
    t,
    n,
    l
  ), [i, h] = N(!1), y = x(
    (o) => {
      o.target.closest("[data-sticky-fab]") || o.target.closest("[data-sticky-note]") || (g(o.clientX - 110, o.clientY - 20), h(!1));
    },
    [g]
  );
  return k(() => {
    if (!i) return;
    const o = (w) => {
      w.key === "Escape" && h(!1);
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [i]), /* @__PURE__ */ E(D, { children: [
    i && /* @__PURE__ */ m(
      "div",
      {
        onClick: y,
        style: {
          position: "fixed",
          inset: 0,
          cursor: "crosshair",
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.05)"
        }
      }
    ),
    r.map((o) => /* @__PURE__ */ m("div", { "data-sticky-note": !0, children: /* @__PURE__ */ m(j, { note: o, onUpdate: s, onDelete: b }) }, o.id)),
    /* @__PURE__ */ m(
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
          backgroundColor: i ? "#ef4444" : "#fbbf24",
          color: i ? "#fff" : "#713f12",
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
        title: i ? "Cancel (Esc)" : "Add sticky note",
        children: i ? "×" : "+"
      }
    )
  ] });
}
export {
  v as COLORS,
  O as StickyNotes,
  L as useNotes
};
