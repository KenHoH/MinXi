import React from "react";

interface MasonryProps {
  children: React.ReactNode;
  columns?: number;
}

export function Masonry({ children, columns = 4 }: MasonryProps) {
  return (
    <div
      style={{
        columnCount: columns,
        columnGap: "1rem",
      }}
    >
      {React.Children.map(children, (child) => (
        <div
          style={{
            breakInside: "avoid",
            pageBreakInside: "avoid",
            marginBottom: "1rem",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
