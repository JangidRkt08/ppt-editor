# PowerPoint Editor – Production-Ready Web App

A slide editor built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Fabric.js v6, and Redux Toolkit. This README doubles as product documentation and an engineering walkthrough so a new teammate can get productive fast.

## Table of Contents
- [Why this stack](#why-this-stack)
- [What the app does](#what-the-app-does)
- [Architecture and data flow](#architecture-and-data-flow)
- [Directory structure](#directory-structure)
- [Key modules](#key-modules)
- [Editor UX](#editor-ux)
- [State management](#state-management)
- [Canvas engine (Fabric.js)](#canvas-engine-fabricjs)
- [Styling and design system](#styling-and-design-system)
- [Build, dev, deploy](#build-dev-deploy)
- [Troubleshooting](#troubleshooting)
- [Roadmap / future work](#roadmap--future-work)

---

## Why this stack

- **Next.js 15 (App Router)**: Modern React runtime with file‑based routing, streaming, and excellent DX for production. Great defaults for performance and Vercel hosting.
- **TypeScript**: Type‑safe domain models (`Slide`, `PresentationState`) prevent entire classes of bugs.
- **Redux Toolkit**: Predictable state container with first‑class devtools, immutable updates, and simple slices/actions for editor workflows.
- **Fabric.js v6**: Reliable, battle‑tested canvas engine for vector shapes, text editing, transforms, and raster export.
- **Tailwind CSS**: Utility‑first styling that keeps styles colocated and consistent without bespoke CSS debt.

> Alternatives considered: Local component state (becomes fragile as features grow), CSS‑in‑JS (adds runtime cost), vanilla Canvas API (reinvent many editor primitives). The chosen stack optimizes for feature velocity and maintainability.

---

## What the app does

- Create, delete, rename, and select slides
- Draw shapes and editable text on a canvas (Fabric.js)
- Auto‑save the current slide canvas to JSON
- Live thumbnails generated from the canvas
- Save the entire presentation to a local JSON file
- Load a presentation JSON back into the editor
- Export the current slide as a PNG image

This meets the assignment’s functional scope while using an industry‑ready structure.

---

## Architecture and data flow

High‑level flow:
1. User actions (toolbar buttons, canvas interactions) trigger events.
2. Fabric.js mutates the in‑memory canvas. We debounce and persist these mutations into Redux (`presentationSlice`).
3. Slide thumbnails are produced from the canvas via `toDataURL` and stored alongside slide JSON.
4. Editor UI renders from Redux state (slides list, current slide id, title).

Data model (simplified):
```ts
// src/store/types.ts
export type Slide = {
  id: string;
  name: string;
  canvasJSON: unknown | null; // Fabric.js JSON for this slide
  thumbnailDataUrl?: string;  // tiny preview used in sidebar
};

export type PresentationState = {
  presentationId: string;
  title: string;
  slides: Slide[];
  currentSlideId: string;
};
```

---

## Directory structure

```
src/
  app/
    editor/
      page.tsx          # Main editor screen composition
    layout.tsx          # Root layout: fonts, global CSS, Redux provider
    page.tsx            # Landing page → link to /editor
    globals.css         # Tailwind base + theme tokens
  components/
    CanvasEditor.tsx    # Fabric canvas, tools, sizing, export logic
    SlidesSidebar.tsx   # Slide list with thumbnail, select/rename/new/delete
    Toolbar.tsx         # Top bar: Save JSON, Load JSON, Export PNG
  store/
    index.ts            # Redux store + typed hooks
    presentationSlice.ts# Slides reducer/actions (add, delete, set current, save)
    types.ts            # Shared domain types
  utils/
    file.ts             # JSON read/write + dataURL download helpers
```

How parts relate:
- `app/editor/page.tsx` wires the screen: top `Toolbar` + left `SlidesSidebar` + `CanvasEditor` + right info panel.
- `CanvasEditor` reads current slide from Redux and loads its `canvasJSON` into Fabric when you switch slides. On edits, it debounces a save back to Redux (which updates thumbnails and JSON). 
- `Toolbar` performs global actions (save/load/export) using `utils/file.ts` and the Redux state.
- `SlidesSidebar` is the canonical place to add/delete/rename slides.

---

## Key modules

### `src/components/CanvasEditor.tsx`
- Initializes Fabric.js `Canvas` and resizes it to the visible 16:9 container.
- Adds primitives: Rectangle, Circle, Text (centered, responsive sizes).
- Debounced persistence of the canvas to Redux (prevents event storms and lockups).
- Guard (`isRestoringRef`) avoids feedback loops when rehydrating from JSON.
- Exports the current slide as PNG via `toDataURL`.

### `src/store/presentationSlice.ts`
- `addSlide`, `deleteSlide`, `renameSlide`, `setCurrentSlide`
- `updateSlideCanvas` (stores Fabric JSON + thumbnail)
- `loadFromJSON` (replace entire state from a JSON file)
- Uses `nanoid` for ids and ships with a sane initial slide.

### `src/components/SlidesSidebar.tsx`
- Renders all slides with a live thumbnail and an inline rename input.
- Selecting a slide updates `currentSlideId` → `CanvasEditor` reloads the canvas.

### `src/components/Toolbar.tsx`
- Save presentation as JSON
- Load JSON (file input)
- Export current slide as PNG
- Buttons are accessible, keyboard‑focusable, and have strong color contrast.

### `src/utils/file.ts`
- `downloadJSON`, `downloadDataUrl`: trigger safe client‑side downloads
- `readJSONFile`: typed file loader for `loadFromJSON`

---

## Editor UX

- The canvas fits the white 16:9 area exactly; objects are centered by default and size relative to the canvas so they’re readable at all screen sizes.
- Slide thumbnails are refreshed automatically after edits.
- Add/Delete slides: use the left sidebar (single source of truth). Global actions (save/load/export) live in the top bar, reducing clutter.

Accessibility & usability:
- Proper focus styles on buttons.
- Sufficient text contrast.
- Keyboard editing of slide names.

---

## State management

Why Redux Toolkit here:
- Single source of truth across disparate UI (toolbar, sidebar, canvas).
- Time travel/devtools support while developing complex editor flows.
- Scales cleanly as features like history/undo, templates, or collaboration are added.

Persistence model:
- In‑memory Redux during a session.
- User‑initiated Save/Load to JSON for portability as per assignment.

---

## Canvas engine (Fabric.js)

- Fabric v6 with named ESM exports: `import { Canvas, Rect, Circle, IText } from 'fabric'`.
- JSON serialization/deserialization built into Fabric is used to move between slide state and the live canvas.
- Debounced `object:added/modified/removed` handlers keep Redux in sync without causing reload loops.

---

## Styling and design system

- Tailwind CSS via `@tailwindcss/postcss` with a minimal theme in `globals.css`.
- Component classes favor clarity and consistency (rounded, subtle borders, hover states, strong text color).
- No runtime CSS‑in‑JS overhead.

---

## Build, dev, deploy

Requirements: Node 18+ (recommended LTS)

Commands:
```bash
npm run dev     # start dev server (Next.js Turbopack)
npm run build   # production build (type check + minify)
npm run start   # run the built app on Node
npm run lint    # lint with Next/TS rules
```

Deployment (Vercel):
- Push to GitHub → Import repo on Vercel → defaults work (build: `next build`, output: `.next`).

---

## Troubleshooting

- "Internal Server Error" on `/favicon.ico`: transient when switching dev ports; refresh or restart `npm run dev`.
- Page freezes after adding text/shape: fixed by using an `isRestoring` guard and debounced save; ensure you’re on the latest commit.
- If the app starts on a different port (e.g., 3001/3002), open that port shown in the terminal.

---

## Roadmap / future work

- Rich text formatting (bold/italic, alignment, bullet lists)
- Image upload and background images
- Align/distribute, snap lines, and grouping
- Undo/redo and history sidebar
- Templates and themes
- Persistence to localStorage and/or a backend API
- Shareable public view link and export to PDF

---

If you have questions or want to propose changes, open an issue or PR. This doc aims to give a complete mental model of how the editor is built and how to extend it responsibly.
