export interface Slide {
  id: string;
  name: string;
  canvasJSON: any;
  thumbnailDataUrl?: string;
}

export interface PresentationState {
  presentationId: string;
  title: string;
  slides: Slide[];
  currentSlideId: string;
}
