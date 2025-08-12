"use client";

import { useEffect, useState } from "react";
import type { Canvas, FabricObject, IText } from "fabric";

export default function PropertiesPanel({ canvas }: { canvas: Canvas | null }) {
  const [fill, setFill] = useState<string>("#111827");
  const [fontSize, setFontSize] = useState<number>(24);

  useEffect(() => {
    if (!canvas) return;
    const sync = () => {
      const obj = canvas.getActiveObject() as FabricObject | IText | null;
      if (!obj) return;
      const anyObj = obj as unknown as { fill?: string; fontSize?: number; type?: string };
      setFill(anyObj.fill ?? "#111827");
      if (anyObj.type === "i-text" || anyObj.type === "text") {
        setFontSize(anyObj.fontSize ?? 24);
      }
    };
    canvas.on("selection:created", sync);
    canvas.on("selection:updated", sync);
    canvas.on("mouse:down", sync);
    return () => {
      canvas.off("selection:created", sync);
      canvas.off("selection:updated", sync);
      canvas.off("mouse:down", sync);
    };
  }, [canvas]);

  const applyChanges = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject() as FabricObject | IText | null;
    if (!obj) return;
    (obj as unknown as { set: (props: Record<string, unknown>) => void }).set({ fill });
    const anyObj = obj as unknown as { type?: string };
    if (anyObj.type === "i-text" || anyObj.type === "text") {
      (obj as unknown as { set: (props: Record<string, unknown>) => void }).set({ fontSize });
    }
    canvas.requestRenderAll();
  };

  return (
    <aside className="w-72 border-l bg-zinc-50 h-full p-4 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-700">Properties</h3>
      <div className="space-y-2">
        <label className="text-xs text-zinc-600">Fill</label>
        <input
          type="color"
          value={fill}
          onChange={(e) => setFill(e.currentTarget.value)}
          className="w-full h-9 border rounded"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-zinc-600">Font size</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.currentTarget.value || "24", 10))}
          className="w-full h-9 border rounded px-2"
        />
      </div>
      <button
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 active:bg-zinc-100"
        onClick={applyChanges}
      >
        Apply
      </button>
    </aside>
  );
} 