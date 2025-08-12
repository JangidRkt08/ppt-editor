import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { PresentationState, Slide } from "./types";

const createInitialSlide = (): Slide => ({
  id: nanoid(),
  name: "Slide 1",
  canvasJSON: null,
});

const initialSlide = createInitialSlide();

const initialState: PresentationState = {
  presentationId: nanoid(),
  title: "Untitled Presentation",
  slides: [initialSlide],
  currentSlideId: initialSlide.id,
};

export const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    addSlide(state) {
      const slide: Slide = {
        id: nanoid(),
        name: `Slide ${state.slides.length + 1}`,
        canvasJSON: null,
      };
      state.slides.push(slide);
      state.currentSlideId = slide.id;
    },
    deleteSlide(state, action: PayloadAction<string>) {
      const idToDelete = action.payload;
      const idx = state.slides.findIndex((s) => s.id === idToDelete);
      if (idx === -1) return;
      state.slides.splice(idx, 1);
      if (state.slides.length === 0) {
        const newSlide = createInitialSlide();
        state.slides.push(newSlide);
        state.currentSlideId = newSlide.id;
        return;
      }
      const nextIdx = Math.min(idx, state.slides.length - 1);
      state.currentSlideId = state.slides[nextIdx].id;
    },
    renameSlide(
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) {
      const slide = state.slides.find((s) => s.id === action.payload.id);
      if (slide) slide.name = action.payload.name;
    },
    setCurrentSlide(state, action: PayloadAction<string>) {
      if (state.slides.some((s) => s.id === action.payload)) {
        state.currentSlideId = action.payload;
      }
    },
    updateSlideCanvas(
      state,
      action: PayloadAction<{ id: string; canvasJSON: unknown; thumbnailDataUrl?: string }>
    ) {
      const slide = state.slides.find((s) => s.id === action.payload.id);
      if (!slide) return;
      slide.canvasJSON = action.payload.canvasJSON;
      if (action.payload.thumbnailDataUrl) {
        slide.thumbnailDataUrl = action.payload.thumbnailDataUrl;
      }
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    loadFromJSON(_state, action: PayloadAction<PresentationState>) {
      return action.payload;
    },
    reset(state) {
      const s = createInitialSlide();
      state.presentationId = nanoid();
      state.title = "Untitled Presentation";
      state.slides = [s];
      state.currentSlideId = s.id;
    },
  },
});

export const {
  addSlide,
  deleteSlide,
  renameSlide,
  setCurrentSlide,
  updateSlideCanvas,
  setTitle,
  loadFromJSON,
  reset,
} = presentationSlice.actions;

export default presentationSlice.reducer; 