import { useState, useCallback, useEffect } from "react";
import { useNotes } from "./useNotes.js";
import { Note } from "./Note.jsx";

export function StickyNotes({ storageKey = "react-sticky-notes" }) {
  const { notes, addNote, updateNote, deleteNote } = useNotes(storageKey);
  const [placing, setPlacing] = useState(false);

  const handlePlacementClick = useCallback(
    (e) => {
      // Ignore clicks on the FAB itself or on existing notes
      if (e.target.closest("[data-sticky-fab]") || e.target.closest("[data-sticky-note]")) {
        return;
      }
      addNote(e.clientX - 110, e.clientY - 20);
      setPlacing(false);
    },
    [addNote]
  );

  useEffect(() => {
    if (!placing) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setPlacing(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [placing]);

  return (
    <>
      {/* Placement overlay */}
      {placing && (
        <div
          onClick={handlePlacementClick}
          style={{
            position: "fixed",
            inset: 0,
            cursor: "crosshair",
            zIndex: 9998,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        />
      )}

      {/* Notes */}
      {notes.map((note) => (
        <div key={note.id} data-sticky-note>
          <Note
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        </div>
      ))}

      {/* FAB button */}
      <button
        data-sticky-fab
        onClick={() => setPlacing((p) => !p)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          backgroundColor: placing ? "#ef4444" : "#fbbf24",
          color: placing ? "#fff" : "#713f12",
          fontSize: 24,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "all 0.2s",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        title={placing ? "Cancel (Esc)" : "Add sticky note"}
      >
        {placing ? "\u00D7" : "+"}
      </button>
    </>
  );
}
