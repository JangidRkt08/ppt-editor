"use client";

import SlidesSidebar from "@/components/SlidesSidebar";
import CanvasEditor from "@/components/CanvasEditor";
import Toolbar from "@/components/Toolbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { downloadJSON, downloadDataUrl, readJSONFile } from "@/utils/file";
import { loadFromJSON } from "@/store/presentationSlice";

export default function EditorPage() {
  const state = useAppSelector((s) => s.presentation);
  const dispatch = useAppDispatch();

  return (
    <div className="h-dvh grid grid-rows-[auto_1fr]">
      <Toolbar
        onSaveJSON={() => downloadJSON(`${state.title || "presentation"}.json`, state)}
        onLoadJSON={async (file) => {
          const json = await readJSONFile(file);
          dispatch(loadFromJSON(json as typeof state));
        }}
        onExportImage={() => {
          const slide = state.slides.find((s) => s.id === state.currentSlideId);
          if (slide?.thumbnailDataUrl) {
            downloadDataUrl(`${slide.name}.png`, slide.thumbnailDataUrl);
          }
        }}
      />
      <div className="grid grid-cols-[16rem_1fr_18rem] h-full">
        <SlidesSidebar />
        <CanvasEditor />
        <div className="border-l bg-zinc-50 p-4 text-sm text-zinc-700">Select an object to edit. Use the canvas toolbar for basic shape and text controls. Use the top bar to save or load JSON and export PNG.</div>
      </div>
    </div>
  );
} 