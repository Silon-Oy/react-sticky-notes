import { useState, useCallback, useEffect } from "react";

export const COLORS = [
  { name: "yellow", bg: "#fef9c3", border: "#facc15", text: "#713f12" },
  { name: "pink", bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { name: "blue", bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f" },
  { name: "green", bg: "#dcfce7", border: "#4ade80", text: "#14532d" },
  { name: "orange", bg: "#ffedd5", border: "#fb923c", text: "#7c2d12" },
  { name: "purple", bg: "#f3e8ff", border: "#c084fc", text: "#581c87" },
];

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

export function useNotes(storageKey = "react-sticky-notes") {
  const key = `sticky-notes:${storageKey}`;
  const [notes, setNotes] = useState(() => loadNotes(key));

  useEffect(() => {
    saveNotes(key, notes);
  }, [key, notes]);

  const addNote = useCallback((x, y) => {
    const note = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x,
      y,
      text: "",
      colorIndex: 0,
      minimized: false,
      createdAt: Date.now(),
    };
    setNotes((prev) => [...prev, note]);
    return note;
  }, []);

  const updateNote = useCallback((id, changes) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...changes } : n))
    );
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notes, addNote, updateNote, deleteNote };
}
