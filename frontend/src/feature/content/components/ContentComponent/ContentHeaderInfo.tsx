import { Play } from "lucide-react";

interface ContentHeaderInfoProps {
  post_type: string;
  content_id: number;
  thumbnail: string;
}

export function ContentHeaderInfo({
  post_type,
  thumbnail,
}: ContentHeaderInfoProps) {
  const aspectRatios = [
    "aspect-square", // 1:1
    "aspect-video", // 16:9
    "aspect-[3/4]", // 3:4
    "aspect-[4/5]", // 4:5
    "aspect-[2/3]", // 2:3
    "aspect-[9/16]", // 9:16
    "aspect-[1/2]", // 1:2
    "aspect-[5/4]", // 5:4
    "aspect-[4/3]", // 4:3
    "aspect-[21/9]", // 21:9 (ultrawide)
    "aspect-[5/3]", // 5:3
    "aspect-[7/5]", // 7:5
  ];
  const randomAspect =
    aspectRatios[Math.floor(Math.random() * aspectRatios.length)];

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
