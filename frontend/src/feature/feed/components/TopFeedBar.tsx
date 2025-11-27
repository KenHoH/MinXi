import { useState } from "react";

interface TopFeedBarProps {
  userBoards?: string[];
  onFilterChange?: (filter: string) => void;
}

const defaultFilters = ["All", "Followed", "Friends"];

export function TopFeedBar({
  userBoards = [],
  onFilterChange,
}: TopFeedBarProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    ...defaultFilters,
    ...userBoards.map((board) => `Board: ${board}`),
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-dark-700">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
            activeFilter === filter
              ? "bg-burgundy-600 text-white"
              : "bg-dark-800 text-gray-300 border border-dark-700 hover:border-burgundy-600 hover:text-burgundy-400"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
