import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, IText } from "fabric";
import { Square, Circle as CircleIcon, Type } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateSlideCanvas } from "@/store/presentationSlice";

export default function CanvasEditor() {
  const { slides, currentSlideId } = useAppSelector((s) => s.presentation);
  const dispatch = useAppDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const isRestoringRef = useRef(false);

  const currentSlide = slides.find((s) => s.id === currentSlideId);

  // Initialize canvas
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

  // Load slide content when switching slides
  useEffect(() => {
    if (!canvas || !currentSlide) return;

    isRestoringRef.current = true;
    canvas.clear();
    canvas.set("backgroundColor", "#ffffff");

    if (currentSlide.canvasJSON) {
      canvas.loadFromJSON(currentSlide.canvasJSON, () => {
        canvas.renderAll();
        updateThumbnail();
        isRestoringRef.current = false;
      });
    } else {
      canvas.renderAll();
      updateThumbnail();
      isRestoringRef.current = false;
    }
  }, [canvas, currentSlide?.id]);

  // Save canvas changes
  useEffect(() => {
    if (!canvas) return;

    const saveCanvas = () => {
      if (isRestoringRef.current) return;

      const json = canvas.toJSON();
      let dataUrl: string | undefined;
      try {
        dataUrl = canvas.toDataURL({ format: "png", multiplier: 0.2 });
      } catch {}

      dispatch(
        updateSlideCanvas({
          slideId: currentSlideId,
          canvasJSON: json,
          thumbnailDataUrl: dataUrl,
        })
      );
    };

    canvas.on("object:modified", saveCanvas);
    canvas.on("object:added", saveCanvas);
    canvas.on("object:removed", saveCanvas);

    return () => {
      canvas.off("object:modified", saveCanvas);
      canvas.off("object:added", saveCanvas);
      canvas.off("object:removed", saveCanvas);
    };
  }, [canvas, currentSlideId, dispatch]);

  const updateThumbnail = () => {
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 0.2 });
      dispatch(
        updateSlideCanvas({
          slideId: currentSlideId,
          canvasJSON: canvas.toJSON(),
          thumbnailDataUrl: dataUrl,
        })
      );
    } catch {}
  };

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
    const size = Math.max(
      64,
      Math.min(canvas.getWidth(), canvas.getHeight()) * 0.12
    );
    const radius = size / 2;
    const pos = centerPos(size, size);

    const circle = new Circle({
      left: pos.left + radius,
      top: pos.top + radius,
      radius,
      fill: "#f59e0b",
    });

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
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Canvas Toolbar */}
      <div className="p-2 border-b bg-white flex items-center gap-2 overflow-x-auto">
        <button
          onClick={addRect}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex-shrink-0"
        >
          <Square size={16} />
          <span className="sm:inline hidden">Rectangle</span>
          <span className="sm:hidden">Rect</span>
        </button>

        <button
          onClick={addCircle}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex-shrink-0"
        >
          <CircleIcon size={16} />
          <span className="sm:inline hidden">Circle</span>
          <span className="sm:hidden">Circle</span>
        </button>

        <button
          onClick={addText}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex-shrink-0"
        >
          <Type size={16} />
          <span className="sm:inline hidden">Text</span>
          <span className="sm:hidden">Text</span>
        </button>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 grid place-items-center bg-gray-100 p-2 sm:p-4 lg:p-6">
        <div className="w-full h-full max-w-full">
          <div
            ref={containerRef}
            className="bg-white shadow rounded-lg mx-auto aspect-video w-full max-w-6xl overflow-visible"
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full touch-manipulation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
