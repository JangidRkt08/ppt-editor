"use client";

import { ButtonHTMLAttributes } from "react";
import { Save, Upload, ImageDown } from "lucide-react";
import clsx from "clsx";

export type ToolbarProps = {
  onAddSlide: () => void; // kept in type for future but not shown in UI
  onDeleteSlide: () => void; // kept in type for future but not shown in UI
  onSaveJSON: () => void;
  onLoadJSON: (file: File) => void;
  onExportImage: () => void;
};

export function IconButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
) {
  const { className, active, ...rest } = props;
  return (
    <button
      className={clsx(
        "inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50",
        active && "ring-2 ring-blue-500",
        className
      )}
      {...rest}
    />
  );
}

export default function Toolbar({
  onSaveJSON,
  onLoadJSON,
  onExportImage,
}: Pick<ToolbarProps, "onSaveJSON" | "onLoadJSON" | "onExportImage">) {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white sticky top-0 z-10">
      <IconButton onClick={onSaveJSON} title="Save presentation JSON">
        <Save size={16} /> Save JSON
      </IconButton>
      <label className="cursor-pointer">
        <span className="sr-only">Load JSON</span>
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onLoadJSON(f);
          }}
        />
        <span className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50">
          <Upload size={16} /> Load JSON
        </span>
      </label>
      <div className="mx-2 h-5 w-px bg-zinc-200" />
      <IconButton onClick={onExportImage} title="Export current slide as image">
        <ImageDown size={16} /> Export PNG
      </IconButton>
    </div>
  );
} 