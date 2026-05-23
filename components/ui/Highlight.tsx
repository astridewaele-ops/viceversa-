import type { CSSProperties, ReactNode } from "react";

interface HighlightProps {
  color: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Highlight({ color, children, style }: HighlightProps) {
  return (
    <span
      style={{
        background: `linear-gradient(transparent 38%, ${color} 38%)`,
        padding: "0 0.12em",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
