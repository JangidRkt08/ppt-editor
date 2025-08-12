export type Slide = {
  id: string;
  name: string;
  // Fabric.js JSON for this slide's canvas
  canvasJSON: unknown | null;
  // Data URL preview for thumbnails
  thumbnailDataUrl?: string;
};

export type PresentationState = {
  presentationId: string;
  title: string;
  slides: Slide[];
  currentSlideId: string;
}; 