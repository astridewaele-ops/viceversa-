export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 36,
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div className="cargo-mono mt-2" style={{ color: "#777" }}>
        {label}
      </div>
    </div>
  );
}
