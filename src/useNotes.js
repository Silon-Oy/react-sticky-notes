import { useState, useCallback, useEffect, useRef } from "react";

export const COLORS = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" },
];

// localStorage helpers (fallback when no API)
function loadNotes(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(key, notes) {
  try {
    localStorage.setItem(key, JSON.stringify(notes));
  } catch {
    // Storage full or unavailable
  }
}

async function apiFetch(url, options, apiKey) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(options && options.headers),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export function useNotes(storageKey = "react-sticky-notes", apiUrl = null, apiKey = null, page = null) {
  const isApi = !!apiUrl;
  const lsKey = `sticky-notes:${storageKey}`;
  const [notes, setNotes] = useState(() => {
    if (isApi) return [];
    const all = loadNotes(lsKey);
    return page ? all.filter((n) => n.page === page) : all;
  });
  const pendingOps = useRef(new Set());
  const updateTimers = useRef({});

  // localStorage persistence (non-API mode only)
  useEffect(() => {
    if (isApi) return;
    // Merge page-filtered notes back into full storage
    const all = loadNotes(lsKey);
    const otherPages = page ? all.filter((n) => n.page !== page) : [];
    saveNotes(lsKey, [...otherPages, ...notes]);
  }, [isApi, lsKey, notes, page]);

  // API: initial fetch + polling
  useEffect(() => {
    if (!isApi) return;
    let active = true;

    const fetchUrl = page ? `${apiUrl}?page=${encodeURIComponent(page)}` : apiUrl;
    const fetchNotes = async () => {
      try {
        const serverNotes = await apiFetch(fetchUrl, {}, apiKey);
        if (!active) return;
        setNotes((prev) => {
          // Keep local version of notes with pending operations
          const merged = serverNotes.map((sn) => {
            if (pendingOps.current.has(sn.id)) {
              return prev.find((ln) => ln.id === sn.id) || sn;
            }
            return sn;
          });
          // Include locally-created notes not yet on server
          for (const ln of prev) {
            if (
              pendingOps.current.has(ln.id) &&
              !serverNotes.find((sn) => sn.id === ln.id)
            ) {
              merged.push(ln);
            }
          }
          return merged;
        });
      } catch {
        // Silently retry on next interval
      }
    };

    fetchNotes();
    const interval = setInterval(fetchNotes, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isApi, apiUrl, apiKey, page]);

  const addNote = useCallback(
    (x, y) => {
      const note = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        x,
        y,
        text: "",
        colorIndex: 0,
        minimized: false,
        createdAt: Date.now(),
        ...(page ? { page } : {}),
      };
      setNotes((prev) => [...prev, note]);

      if (isApi) {
        pendingOps.current.add(note.id);
        apiFetch(apiUrl, { method: "POST", body: JSON.stringify(note) }, apiKey)
          .catch(() => {})
          .finally(() => pendingOps.current.delete(note.id));
      }

      return note;
    },
    [isApi, apiUrl, apiKey]
  );

  const updateNote = useCallback(
    (id, changes) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...changes } : n))
      );

      if (isApi) {
        pendingOps.current.add(id);
        // Debounce rapid updates (e.g. dragging)
        clearTimeout(updateTimers.current[id]);
        updateTimers.current[id] = setTimeout(() => {
          apiFetch(
            `${apiUrl}/${id}`,
            { method: "PUT", body: JSON.stringify(changes) },
            apiKey
          )
            .catch(() => {})
            .finally(() => pendingOps.current.delete(id));
        }, 150);
      }
    },
    [isApi, apiUrl, apiKey]
  );

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));

      if (isApi) {
        pendingOps.current.add(id);
        apiFetch(`${apiUrl}/${id}`, { method: "DELETE" }, apiKey)
          .catch(() => {})
          .finally(() => pendingOps.current.delete(id));
      }
    },
    [isApi, apiUrl, apiKey]
  );

  return { notes, addNote, updateNote, deleteNote };
}
