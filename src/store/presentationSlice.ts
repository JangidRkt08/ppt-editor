import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PresentationState, Slide } from "./types";
import { nanoid } from "nanoid";

const initialState: PresentationState = {
  presentationId: nanoid(),
  title: "My Presentation",
  slides: [
    {
      id: "1",
      name: "Slide 1",
      canvasJSON: null,
      thumbnailDataUrl: undefined,
    },
  ],
  currentSlideId: "1",
};

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    addSlide: (state) => {
      const newSlide: Slide = {
        id: nanoid(),
        name: `Slide ${state.slides.length + 1}`,
        canvasJSON: null,
        thumbnailDataUrl: undefined,
      };
      state.slides.push(newSlide);
      state.currentSlideId = newSlide.id;
    },
    deleteSlide: (state, action: PayloadAction<string>) => {
      const slideId = action.payload;
      if (state.slides.length <= 1) return;

      state.slides = state.slides.filter((s) => s.id !== slideId);

      if (state.currentSlideId === slideId) {
        state.currentSlideId = state.slides[0]?.id || "1";
      }
    },
    renameSlide: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      const slide = state.slides.find((s) => s.id === id);
      if (slide) {
        slide.name = name;
      }
    },
    setCurrentSlide: (state, action: PayloadAction<string>) => {
      state.currentSlideId = action.payload;
    },
    updateSlideCanvas: (
      state,
      action: PayloadAction<{
        slideId: string;
        canvasJSON: any;
        thumbnailDataUrl?: string;
      }>
    ) => {
      const { slideId, canvasJSON, thumbnailDataUrl } = action.payload;
      const slide = state.slides.find((s) => s.id === slideId);
      if (slide) {
        slide.canvasJSON = canvasJSON;
        if (thumbnailDataUrl) {
          slide.thumbnailDataUrl = thumbnailDataUrl;
        }
      }
    },
    loadFromJSON: (state, action: PayloadAction<PresentationState>) => {
      return action.payload;
    },
  },
});

export const {
  addSlide,
  deleteSlide,
  renameSlide,
  setCurrentSlide,
  updateSlideCanvas,
  loadFromJSON,
} = presentationSlice.actions;

export default presentationSlice.reducer;
