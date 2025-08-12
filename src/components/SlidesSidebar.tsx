"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { addSlide, deleteSlide, renameSlide, setCurrentSlide } from "@/store/presentationSlice";
import { IconButton } from "./Toolbar";
import { Plus, Trash2 } from "lucide-react";

export default function SlidesSidebar() {
  const slides = useAppSelector((s) => s.presentation.slides);
  const currentSlideId = useAppSelector((s) => s.presentation.currentSlideId);
  const dispatch = useAppDispatch();

  return (
    <aside className="w-64 border-r bg-zinc-50 h-full flex flex-col">
      <div className="p-2 flex items-center gap-2 border-b bg-white">
        <IconButton onClick={() => dispatch(addSlide())}>
          <Plus size={16} /> New
        </IconButton>
        <IconButton
          onClick={() => dispatch(deleteSlide(currentSlideId))}
          title="Delete selected"
        >
          <Trash2 size={16} /> Delete
        </IconButton>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {slides.map((s) => (
          <button
            key={s.id}
            onClick={() => dispatch(setCurrentSlide(s.id))}
            className={`w-full rounded-md border bg-white p-2 text-left shadow-sm transition ring-offset-2 ${
              currentSlideId === s.id
                ? "ring-2 ring-blue-500"
                : "hover:ring-1 hover:ring-zinc-300"
            }`}
          >
            <div className="text-xs text-zinc-500 mb-2">
              <input
                className="w-full rounded border px-1 py-0.5 text-xs"
                value={s.name}
                onChange={(e) =>
                  dispatch(
                    renameSlide({ id: s.id, name: e.currentTarget.value })
                  )
                }
              />
            </div>
            <div className="aspect-video w-full bg-zinc-100 rounded overflow-hidden grid place-items-center text-zinc-400 text-xs">
              {s.thumbnailDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.thumbnailDataUrl} alt={s.name} className="w-full" />
              ) : (
                <span>No preview</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
} 