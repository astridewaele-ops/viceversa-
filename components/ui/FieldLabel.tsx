import type { ReactNode } from "react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "#777",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}
