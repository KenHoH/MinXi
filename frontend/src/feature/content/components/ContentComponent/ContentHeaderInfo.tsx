import { Play } from "lucide-react";

interface ContentHeaderInfoProps {
  post_type: string;
  content_id: number;
  thumbnail: string;
}

export function ContentHeaderInfo({
  post_type,
  content_id,
  thumbnail,
}: ContentHeaderInfoProps) {
  const aspectRatios = [
    "aspect-square",
    "aspect-video",
    "aspect-[3/4]",
    "aspect-[4/5]",
  ];
  const randomAspect = aspectRatios[content_id % aspectRatios.length];

  return (
    <div
      className={`relative w-full ${randomAspect} bg-dark-700 overflow-hidden`}
    >
      <img
        src={thumbnail}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
      {post_type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black transition-colors">
          <Play className="w-12 h-12 text-white" />
        </div>
      )}
      <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
        {post_type === "video" ? "Video" : "Image"}
      </span>
    </div>
  );
}
