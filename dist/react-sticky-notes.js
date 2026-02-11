import { jsx as y, jsxs as N, Fragment as L } from "react/jsx-runtime";
import { useState as D, useRef as C, useEffect as E, useCallback as v } from "react";
const S = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" }
];
function $(e) {
  try {
    const n = localStorage.getItem(e);
    return n ? JSON.parse(n) : [];
  } catch {
    return [];
  }
}
function R(e, n) {
  try {
    localStorage.setItem(e, JSON.stringify(n));
  } catch {
  }
}
async function I(e, n, f) {
  const r = await fetch(e, {
    ...n,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": f,
      ...n && n.headers
    }
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
function M(e = "react-sticky-notes", n = null, f = null, r = null) {
  const a = !!n, s = `sticky-notes:${e}`, [p, g] = D(() => {
    if (a) return [];
    const o = $(s);
    return r ? o.filter((h) => h.page === r) : o;
  }), c = C(/* @__PURE__ */ new Set()), m = C({});
  E(() => {
    if (a) return;
    const o = $(s), h = r ? o.filter((u) => u.page !== r) : [];
    R(s, [...h, ...p]);
  }, [a, s, p, r]), E(() => {
    if (!a) return;
    let o = !0;
    const h = r ? `${n}?page=${encodeURIComponent(r)}` : n, u = async () => {
      try {
        const t = await I(h, {}, f);
        if (!o) return;
        g((l) => {
          const b = t.map((d) => c.current.has(d.id) && l.find((z) => z.id === d.id) || d);
          for (const d of l)
            c.current.has(d.id) && !t.find((z) => z.id === d.id) && b.push(d);
          return b;
        });
      } catch {
      }
    };
    u();
    const x = setInterval(u, 3e3);
    return () => {
      o = !1, clearInterval(x);
    };
  }, [a, n, f, r]);
  const w = v(
    (o, h) => {
      const u = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        x: o,
        y: h,
        text: "",
        colorIndex: 0,
        minimized: !1,
        createdAt: Date.now(),
        ...r ? { page: r } : {}
      };
      return g((x) => [...x, u]), a && (c.current.add(u.id), I(n, { method: "POST", body: JSON.stringify(u) }, f).catch(() => {
      }).finally(() => c.current.delete(u.id))), u;
    },
    [a, n, f]
  ), i = v(
    (o, h) => {
      g(
        (u) => u.map((x) => x.id === o ? { ...x, ...h } : x)
      ), a && (c.current.add(o), clearTimeout(m.current[o]), m.current[o] = setTimeout(() => {
        I(
          `${n}/${o}`,
          { method: "PUT", body: JSON.stringify(h) },
          f
        ).catch(() => {
        }).finally(() => c.current.delete(o));
      }, 150));
    },
    [a, n, f]
  ), k = v(
    (o) => {
      g((h) => h.filter((u) => u.id !== o)), a && (c.current.add(o), I(`${n}/${o}`, { method: "DELETE" }, f).catch(() => {
      }).finally(() => c.current.delete(o)));
    },
    [a, n, f]
  );
  return { notes: p, addNote: w, updateNote: i, deleteNote: k };
}
const P = `@keyframes stickyNotePulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.18); opacity: 1; }
}`;
let T = !1;
function j() {
  if (T) return;
  const e = document.createElement("style");
  e.textContent = P, document.head.appendChild(e), T = !0;
}
function O({ note: e, onUpdate: n, onDelete: f }) {
  const r = S[e.colorIndex % S.length], a = C(null), [s, p] = D(!1), g = C(!1), c = C({ x: 0, y: 0 }), m = C({ x: 0, y: 0 });
  E(() => {
    j();
  }, []), E(() => {
    !e.minimized && a.current && requestAnimationFrame(() => {
      var l;
      const t = (l = a.current) == null ? void 0 : l.querySelector("textarea");
      t && t.focus();
    });
  }, [e.minimized]);
  const w = v(
    (t, l) => {
      m.current = {
        x: t - e.x,
        y: l - e.y
      }, c.current = { x: t, y: l }, g.current = !1, p(!0);
    },
    [e.x, e.y]
  ), i = 5, k = v(
    (t, l) => {
      if (!s) return;
      const b = t - c.current.x, d = l - c.current.y;
      !g.current && b * b + d * d < i * i || (g.current = !0, n(e.id, {
        x: t - m.current.x,
        y: l - m.current.y
      }));
    },
    [s, e.id, n]
  ), o = v(() => {
    p(!1);
  }, []);
  E(() => {
    if (!s) return;
    const t = (d) => k(d.clientX, d.clientY), l = (d) => {
      d.preventDefault(), k(d.touches[0].clientX, d.touches[0].clientY);
    }, b = () => o();
    return window.addEventListener("mousemove", t), window.addEventListener("mouseup", b), window.addEventListener("touchmove", l, { passive: !1 }), window.addEventListener("touchend", b), () => {
      window.removeEventListener("mousemove", t), window.removeEventListener("mouseup", b), window.removeEventListener("touchmove", l), window.removeEventListener("touchend", b);
    };
  }, [s, k, o]);
  const h = () => {
    n(e.id, {
      colorIndex: (e.colorIndex + 1) % S.length
    });
  }, u = () => {
    window.confirm("Delete this note?") && f(e.id);
  }, x = v(
    (t) => {
      t.relatedTarget && t.currentTarget.contains(t.relatedTarget) || s || n(e.id, { minimized: !0 });
    },
    [e.id, n, s]
  );
  return e.minimized ? /* @__PURE__ */ y(
    "div",
    {
      onMouseDown: (t) => {
        t.preventDefault(), w(t.clientX, t.clientY);
      },
      onTouchStart: (t) => {
        w(t.touches[0].clientX, t.touches[0].clientY);
      },
      onClick: () => {
        g.current || n(e.id, { minimized: !1 });
      },
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
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
  ) : /* @__PURE__ */ N(
    "div",
    {
      ref: a,
      tabIndex: -1,
      onBlur: x,
      style: {
        position: "fixed",
        left: e.x,
        top: e.y,
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
        /* @__PURE__ */ N(
          "div",
          {
            onMouseDown: (t) => {
              t.preventDefault(), w(t.clientX, t.clientY);
            },
            onTouchStart: (t) => {
              w(t.touches[0].clientX, t.touches[0].clientY);
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
              /* @__PURE__ */ y(
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
                /* @__PURE__ */ y(
                  "button",
                  {
                    onClick: h,
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `1.5px solid ${r.text}44`,
                      background: `conic-gradient(${S.map((t, l) => `${t.border} ${l / S.length * 100}% ${(l + 1) / S.length * 100}%`).join(", ")})`,
                      cursor: "pointer",
                      padding: 0
                    },
                    title: "Change color"
                  }
                ),
                /* @__PURE__ */ y(
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
                /* @__PURE__ */ y(
                  "button",
                  {
                    onClick: u,
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
        /* @__PURE__ */ y(
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
function X({
  storageKey: e = "react-sticky-notes",
  apiUrl: n = null,
  apiKey: f = null,
  page: r = null
}) {
  const { notes: a, addNote: s, updateNote: p, deleteNote: g } = M(
    e,
    n,
    f,
    r
  ), [c, m] = D(!1), w = v(
    (i) => {
      i.target.closest("[data-sticky-fab]") || i.target.closest("[data-sticky-note]") || (s(i.clientX - 110, i.clientY - 20), m(!1));
    },
    [s]
  );
  return E(() => {
    if (!c) return;
    const i = (k) => {
      k.key === "Escape" && m(!1);
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [c]), /* @__PURE__ */ N(L, { children: [
    c && /* @__PURE__ */ y(
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
    a.map((i) => /* @__PURE__ */ y("div", { "data-sticky-note": !0, children: /* @__PURE__ */ y(O, { note: i, onUpdate: p, onDelete: g }) }, i.id)),
    /* @__PURE__ */ y(
      "button",
      {
        "data-sticky-fab": !0,
        onClick: () => m((i) => !i),
        style: {
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          backgroundColor: c ? "#ef4444" : "#fbbf24",
          color: c ? "#fff" : "#713f12",
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
        onMouseEnter: (i) => {
          i.currentTarget.style.transform = "scale(1.1)";
        },
        onMouseLeave: (i) => {
          i.currentTarget.style.transform = "scale(1)";
        },
        title: c ? "Cancel (Esc)" : "Add sticky note",
        children: c ? "×" : "+"
      }
    )
  ] });
}
export {
  S as COLORS,
  X as StickyNotes,
  M as useNotes
};
