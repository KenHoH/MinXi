interface PostHeaderInfoProps {
  title: string;
  description: string;
}

export function PostHeaderInfo({ title, description }: PostHeaderInfoProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-100 text-lg">{title}</h3>
      <p className="text-gray-300 line-clamp-3">{description}</p>
    </div>
  );
}
