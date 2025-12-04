import { Image, Video } from "lucide-react";

interface ContentTypeSelectorProps {
  selectedType: "image" | "video" | null;
  onTypeChange: (type: "image" | "video") => void;
}

export function ContentTypeSelector({
  selectedType,
  onTypeChange,
}: ContentTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Content Type
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => onTypeChange("image")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
            selectedType === "image"
              ? "border-burgundy-600 bg-burgundy-600/10 text-burgundy-400 shadow-lg shadow-burgundy-600/50 ring-2 ring-burgundy-600/30"
              : "border-dark-600 bg-dark-700 text-gray-300 hover:border-burgundy-600"
          }`}
        >
          <Image className="w-5 h-5" />
          Image
        </button>
        <button
          onClick={() => onTypeChange("video")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
            selectedType === "video"
              ? "border-burgundy-600 bg-burgundy-600/10 text-burgundy-400 shadow-lg shadow-burgundy-600/50 ring-2 ring-burgundy-600/30"
              : "border-dark-600 bg-dark-700 text-gray-300 hover:border-burgundy-600"
          }`}
        >
          <Video className="w-5 h-5" />
          Video
        </button>
      </div>
    </div>
  );
}
