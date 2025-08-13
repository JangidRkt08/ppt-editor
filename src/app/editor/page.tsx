"use client";

import SlidesSidebar from "@/components/SlidesSidebar";
import CanvasEditor from "@/components/CanvasEditor";
import Toolbar from "@/components/Toolbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { downloadJSON, downloadDataUrl, readJSONFile } from "@/utils/file";
import { loadFromJSON } from "@/store/presentationSlice";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { setCurrentSlide } from "@/store/presentationSlice";

export default function EditorPage() {
  const state = useAppSelector((s) => s.presentation);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebars when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
      setPropertiesOpen(false);
    }
  }, [isMobile]);

  // Close sidebars when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
      setPropertiesOpen(false);
    }
  };

  // Navigation functions for mobile
  const currentSlideIndex = state.slides.findIndex(
    (s) => s.id === state.currentSlideId
  );
  const canGoPrevious = currentSlideIndex > 0;
  const canGoNext = currentSlideIndex < state.slides.length - 1;

  const goToPreviousSlide = () => {
    if (canGoPrevious) {
      const previousSlide = state.slides[currentSlideIndex - 1];
      dispatch(setCurrentSlide(previousSlide.id));
    }
  };

  const goToNextSlide = () => {
    if (canGoNext) {
      const nextSlide = state.slides[currentSlideIndex + 1];
      dispatch(setCurrentSlide(nextSlide.id));
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-white shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          aria-label="Toggle slides sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="text-center flex-1 mx-4">
          <h1 className="text-lg font-semibold text-zinc-800">PPT Editor</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <button
              onClick={goToPreviousSlide}
              disabled={!canGoPrevious}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-zinc-500">
              {currentSlideIndex + 1} of {state.slides.length}
            </span>
            <button
              onClick={goToNextSlide}
              disabled={!canGoNext}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={() => setPropertiesOpen(!propertiesOpen)}
          className="p-2 rounded-md hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          aria-label="Toggle properties panel"
        >
          {propertiesOpen ? <X size={20} /> : <Settings size={20} />}
        </button>
      </div>

      <Toolbar
        onSaveJSON={() =>
          downloadJSON(`${state.title || "presentation"}.json`, state)
        }
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

      {/* Main Content Area - Mobile: Stack, Desktop: Grid */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[16rem_1fr_18rem] h-full relative">
        {/* Mobile Sidebar Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
            sidebarOpen || propertiesOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={handleOverlayClick}
        />

        {/* Slides Sidebar - Mobile: Fixed overlay, Desktop: Static */}
        <div
          className={`lg:relative lg:translate-x-0 fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <SlidesSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Canvas Editor - Mobile: Full width, Desktop: Grid column */}
        <div className="flex-1 min-w-0 order-2 lg:order-none">
          <CanvasEditor />
        </div>

        {/* Properties Panel - Mobile: Fixed overlay, Desktop: Static */}
        <div
          className={`lg:relative lg:translate-x-0 fixed right-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
            propertiesOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="lg:hidden absolute top-0 right-0 p-2 z-10">
            <button
              onClick={() => setPropertiesOpen(false)}
              className="p-2 rounded-md bg-white shadow-md hover:bg-zinc-50 transition-colors"
              aria-label="Close properties panel"
            >
              <X size={16} />
            </button>
          </div>
          <div className="border-l bg-zinc-50 p-4 text-sm text-zinc-700 h-full overflow-y-auto">
            <div className="lg:hidden mb-8">
              <h3 className="text-lg font-semibold mb-2">Properties</h3>
              <p className="text-zinc-600 text-sm">
                Select an object on the canvas to edit its properties.
              </p>
            </div>
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold mb-4">Properties</h3>
              <p className="text-zinc-600">
                Select an object to edit. Use the canvas toolbar for basic shape
                and text controls. Use the top bar to save or load JSON and
                export PNG.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Status Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-zinc-100 border-t text-xs text-zinc-600">
        <span>Touch to edit • Swipe to navigate</span>
        <span className="flex items-center gap-1">
          <FileText size={12} />
          {state.slides.length} slide{state.slides.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
} 