"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, IText } from "fabric";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateSlideCanvas } from "@/store/presentationSlice";
import { IconButton } from "./Toolbar";
import { Square, Circle as CircleIcon, Type, Download } from "lucide-react";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  const dispatch = useAppDispatch();
  const currentSlide = useAppSelector((s) =>
    s.presentation.slides.find((x) => x.id === s.presentation.currentSlideId)
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    const handleResize = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      c.setWidth(w);
      c.setHeight(h);
      c.renderAll();
    };
    setCanvas(c);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      c.dispose();
    };
  }, []);

  // guard to avoid dispatching while restoring from JSON
  const isRestoringRef = useRef(false);

  useEffect(() => {
    if (!canvas || !currentSlide) return;
    isRestoringRef.current = true;
    canvas.clear();
    canvas.set("backgroundColor", "#ffffff");
    if (currentSlide.canvasJSON) {
      canvas.loadFromJSON(currentSlide.canvasJSON as unknown as object, () => {
        canvas.renderAll();
        isRestoringRef.current = false;
      });
    } else {
      isRestoringRef.current = false;
      canvas.renderAll();
    }
  }, [canvas, currentSlide?.id]);

  useEffect(() => {
    if (!canvas || !currentSlide) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const scheduleSave = () => {
      if (isRestoringRef.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const json = canvas.toJSON();
        let dataUrl: string | undefined;
        try {
          dataUrl = canvas.toDataURL({ format: "png", multiplier: 0.2 });
        } catch {}
        dispatch(
          updateSlideCanvas({ id: currentSlide.id, canvasJSON: json, thumbnailDataUrl: dataUrl })
        );
      }, 150);
    };
    canvas.on("object:modified", scheduleSave);
    canvas.on("object:added", scheduleSave);
    canvas.on("object:removed", scheduleSave);
    return () => {
      if (timer) clearTimeout(timer);
      canvas.off("object:modified", scheduleSave);
      canvas.off("object:added", scheduleSave);
      canvas.off("object:removed", scheduleSave);
    };
  }, [canvas, currentSlide?.id, dispatch]);

  const centerPos = (w: number, h: number) => ({
    left: (canvas!.getWidth() - w) / 2,
    top: (canvas!.getHeight() - h) / 2,
  });

  const addRect = () => {
    if (!canvas) return;
    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    const width = Math.max(240, cw * 0.3);
    const height = Math.max(140, ch * 0.18);
    const pos = centerPos(width, height);
    const rect = new Rect({
      ...pos,
      fill: "#60a5fa",
      width,
      height,
      rx: 8,
      ry: 8,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!canvas) return;
    const size = Math.max(64, Math.min(canvas.getWidth(), canvas.getHeight()) * 0.12);
    const radius = size / 2;
    const pos = centerPos(size, size);
    const circle = new Circle({ left: pos.left + radius, top: pos.top + radius, radius, fill: "#f59e0b" });
    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const addText = () => {
    if (!canvas) return;
    const cw = canvas.getWidth();
    const fontSize = Math.max(36, Math.floor(cw * 0.06));
    const text = new IText("Click to edit", {
      ...centerPos(cw * 0.4, fontSize * 1.2),
      fontSize,
      fill: "#111827",
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const exportPng = () => {
    if (!canvas || !currentSlide) return;
    const url = canvas.toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSlide.name}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-2 border-b bg-white flex items-center gap-2">
        <IconButton onClick={addRect} title="Add rectangle">
          <Square size={16} /> Rectangle
        </IconButton>
        <IconButton onClick={addCircle} title="Add circle">
          <CircleIcon size={16} /> Circle
        </IconButton>
        <IconButton onClick={addText} title="Add text">
          <Type size={16} /> Text
        </IconButton>
        <div className="mx-2 h-5 w-px bg-zinc-200" />
        <IconButton onClick={exportPng} title="Export slide as PNG">
          <Download size={16} /> Export PNG
        </IconButton>
      </div>
      <div className="flex-1 grid place-items-center bg-zinc-100">
        <div className="w-full h-full p-6">
          <div ref={containerRef} className="bg-white shadow rounded-lg mx-auto aspect-video max-w-6xl w-full overflow-visible">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 