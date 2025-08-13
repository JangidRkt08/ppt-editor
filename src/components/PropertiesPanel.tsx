import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateSlideCanvas } from "@/store/presentationSlice";

export default function PropertiesPanel() {
  const { slides, currentSlideId } = useAppSelector((s) => s.presentation);
  const dispatch = useAppDispatch();

  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [fillColor, setFillColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);

  const currentSlide = slides.find((s) => s.id === currentSlideId);

  useEffect(() => {
    if (!currentSlide?.canvasJSON) return;

    // This would need to be implemented with actual canvas reference
    // For now, we'll just show a placeholder
  }, [currentSlide]);

  const handleDeleteObject = () => {
    // This would need to be implemented with actual canvas reference
    // For now, we'll just show a placeholder
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    // This would need to be implemented with actual canvas reference
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    // This would need to be implemented with actual canvas reference
  };

  if (!selectedObject) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Properties</h3>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm mb-2">No object selected</p>
          <p className="text-xs">
            Select an object on the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>

      <div className="space-y-4">
        {/* Object Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <input
            type="text"
            value={selectedObject.type || "Unknown"}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500"
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X Position
            </label>
            <input
              type="number"
              value={selectedObject.left || 0}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Y Position
            </label>
            <input
              type="number"
              value={selectedObject.top || 0}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        {/* Fill Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fill Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => handleFillColorChange(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={fillColor}
              onChange={(e) => handleFillColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Font Size (for text objects) */}
        {selectedObject.type === "i-text" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-16 px-2 py-2 border border-gray-300 rounded text-center"
                min="8"
                max="72"
              />
            </div>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDeleteObject}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} />
          Delete Object
        </button>
      </div>
    </div>
  );
}
