import { useState, useRef, useCallback, useEffect } from "react";
import { COLORS } from "./useNotes.js";

const PULSE_KEYFRAMES = `@keyframes stickyNotePulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.18); opacity: 1; }
}`;

let pulseStyleInjected = false;
function ensurePulseStyle() {
  if (pulseStyleInjected) return;
  const style = document.createElement("style");
  style.textContent = PULSE_KEYFRAMES;
  document.head.appendChild(style);
  pulseStyleInjected = true;
}

export function Note({ note, onUpdate, onDelete }) {
  const color = COLORS[note.colorIndex % COLORS.length];
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const didDrag = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    ensurePulseStyle();
  }, []);

  // Auto-focus textarea when note expands
  useEffect(() => {
    if (!note.minimized && containerRef.current) {
      requestAnimationFrame(() => {
        const textarea = containerRef.current?.querySelector("textarea");
        if (textarea) textarea.focus();
      });
    }
  }, [note.minimized]);

  const startDrag = useCallback(
    (clientX, clientY) => {
      dragOffset.current = {
        x: clientX - note.x,
        y: clientY - note.y,
      };
      dragStart.current = { x: clientX, y: clientY };
      didDrag.current = false;
      setDragging(true);
    },
    [note.x, note.y]
  );

  const DRAG_THRESHOLD = 5;

  const onDrag = useCallback(
    (clientX, clientY) => {
      if (!dragging) return;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      if (!didDrag.current && dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return;
      didDrag.current = true;
      onUpdate(note.id, {
        x: clientX - dragOffset.current.x,
        y: clientY - dragOffset.current.y,
      });
    },
    [dragging, note.id, onUpdate]
  );

  const stopDrag = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => onDrag(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      e.preventDefault();
      onDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleEnd = () => stopDrag();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, onDrag, stopDrag]);

  const cycleColor = () => {
    onUpdate(note.id, {
      colorIndex: (note.colorIndex + 1) % COLORS.length,
    });
  };

  const confirmDelete = () => {
    if (window.confirm("Delete this note?")) {
      onDelete(note.id);
    }
  };

  // Auto-minimize when focus leaves the expanded note
  const handleBlur = useCallback(
    (e) => {
      // If focus moves to another element within this note, don't minimize
      if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
        return;
      }
      // Don't minimize during drag
      if (dragging) return;
      onUpdate(note.id, { minimized: true });
    },
    [note.id, onUpdate, dragging]
  );

  // Collapsed state: small draggable pulsing circle
  if (note.minimized) {
    return (
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onClick={() => {
          if (!didDrag.current) {
            onUpdate(note.id, { minimized: false });
          }
        }}
        style={{
          position: "fixed",
          left: note.x,
          top: note.y,
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: color.border,
          cursor: dragging ? "grabbing" : "pointer",
          zIndex: 10000,
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          animation: dragging
            ? "none"
            : "stickyNotePulse 2.5s ease-in-out infinite",
        }}
        title="Click to expand"
      />
    );
  }

  // Expanded state
  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onBlur={handleBlur}
      style={{
        position: "fixed",
        left: note.x,
        top: note.y,
        width: 220,
        backgroundColor: color.bg,
        border: `1.5px solid ${color.border}`,
        borderRadius: 8,
        boxShadow: dragging
          ? "0 8px 24px rgba(0,0,0,0.18)"
          : "0 2px 8px rgba(0,0,0,0.12)",
        zIndex: dragging ? 10002 : 10001,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13,
        userSelect: dragging ? "none" : "auto",
        transition: dragging ? "none" : "box-shadow 0.2s",
        outline: "none",
      }}
    >
      {/* Drag handle / header */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 8px",
          cursor: "grab",
          borderBottom: `1px solid ${color.border}`,
          borderRadius: "8px 8px 0 0",
          backgroundColor: color.border + "33",
        }}
      >
        <div
          style={{
            width: 30,
            height: 4,
            borderRadius: 2,
            backgroundColor: color.border,
            opacity: 0.5,
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {/* Color cycle */}
          <button
            onClick={cycleColor}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: `1.5px solid ${color.text}44`,
              background: `conic-gradient(${COLORS.map((c, i) => `${c.border} ${(i / COLORS.length) * 100}% ${((i + 1) / COLORS.length) * 100}%`).join(", ")})`,
              cursor: "pointer",
              padding: 0,
            }}
            title="Change color"
          />
          {/* Minimize */}
          <button
            onClick={() => onUpdate(note.id, { minimized: true })}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "none",
              background: color.text + "22",
              color: color.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              lineHeight: 1,
              padding: 0,
            }}
            title="Minimize"
          >
            &minus;
          </button>
          {/* Delete */}
          <button
            onClick={confirmDelete}
            style={{
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
              padding: 0,
            }}
            title="Delete"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={note.text}
        onChange={(e) => onUpdate(note.id, { text: e.target.value })}
        placeholder="Write a note..."
        style={{
          width: "100%",
          minHeight: 80,
          padding: "8px 10px",
          border: "none",
          background: "transparent",
          color: color.text,
          fontSize: 13,
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
