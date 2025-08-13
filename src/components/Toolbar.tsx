import { Save, Upload, ImageDown } from "lucide-react";
import { downloadJSON, downloadDataUrl, readJSONFile } from "@/utils/file";
import { useAppDispatch, useAppSelector } from "@/store";
import { loadFromJSON } from "@/store/presentationSlice";

interface ToolbarProps {
  onSaveJSON: () => void;
  onLoadJSON: (file: File) => void;
  onExportImage: () => void;
}

export default function Toolbar({
  onSaveJSON,
  onLoadJSON,
  onExportImage,
}: ToolbarProps) {
  const state = useAppSelector((s) => s.presentation);
  const dispatch = useAppDispatch();

  const handleLoadJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const json = await readJSONFile(file);
        dispatch(loadFromJSON(json));
      } catch (error) {
        alert(
          "Error loading file. Please check if it's a valid presentation file."
        );
      }
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white overflow-x-auto">
      <button
        onClick={onSaveJSON}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-shrink-0"
      >
        <Save size={16} />
        <span className="sm:inline hidden">Save JSON</span>
        <span className="sm:hidden">Save</span>
      </button>

      <label className="cursor-pointer flex-shrink-0">
        <input
          type="file"
          accept=".json"
          onChange={handleLoadJSON}
          className="hidden"
        />
        <span className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          <Upload size={16} />
          <span className="sm:inline hidden">Load JSON</span>
          <span className="sm:hidden">Load</span>
        </span>
      </label>

      <button
        onClick={onExportImage}
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex-shrink-0"
      >
        <ImageDown size={16} />
        <span className="sm:inline hidden">Export PNG</span>
        <span className="sm:hidden">Export</span>
      </button>
    </div>
  );
}
