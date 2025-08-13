import { useState } from "react";
import { Plus, Trash2, Edit3, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addSlide,
  deleteSlide,
  renameSlide,
  setCurrentSlide,
} from "@/store/presentationSlice";

interface SlidesSidebarProps {
  onClose?: () => void;
}

export default function SlidesSidebar({ onClose }: SlidesSidebarProps) {
  const { slides, currentSlideId } = useAppSelector((s) => s.presentation);
  const dispatch = useAppDispatch();

  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddSlide = () => {
    dispatch(addSlide());
  };

  const handleDeleteSlide = (slideId: string) => {
    dispatch(deleteSlide(slideId));
  };

  const handleRenameStart = (slide: { id: string; name: string }) => {
    setEditingSlideId(slide.id);
    setEditingName(slide.name);
  };

  const handleRenameSave = (slideId: string) => {
    if (editingName.trim()) {
      dispatch(renameSlide({ id: slideId, name: editingName.trim() }));
    }
    setEditingSlideId(null);
    setEditingName("");
  };

  const handleRenameCancel = () => {
    setEditingSlideId(null);
    setEditingName("");
  };

  const handleSlideClick = (slideId: string) => {
    dispatch(setCurrentSlide(slideId));
    if (onClose) onClose();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Slides</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAddSlide}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          <span className="sm:inline hidden">New</span>
          <span className="sm:hidden">+</span>
        </button>

        <button
          onClick={() => handleDeleteSlide(currentSlideId)}
          disabled={slides.length <= 1}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 size={16} />
          <span className="sm:inline hidden">Delete</span>
          <span className="sm:hidden">-</span>
        </button>
      </div>

      <div className="space-y-3">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`p-3 rounded border transition-all cursor-pointer ${
              currentSlideId === slide.id
                ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50"
                : "hover:border-gray-300 bg-white"
            }`}
            onClick={() => handleSlideClick(slide.id)}
          >
            {editingSlideId === slide.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSave(slide.id);
                    if (e.key === "Escape") handleRenameCancel();
                  }}
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameSave(slide.id);
                    }}
                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameCancel();
                    }}
                    className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{slide.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameStart(slide);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // View slide functionality could be added here
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </div>

                <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden">
                  {slide.thumbnailDataUrl ? (
                    <img
                      src={slide.thumbnailDataUrl}
                      alt={slide.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No preview
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No slides yet</p>
            <p className="text-xs mt-1">
              Click &quot;New&quot; to create your first slide
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
