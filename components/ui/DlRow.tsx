export function DlRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="cargo-mono" style={{ color: "#777" }}>
        {label}
      </dt>
      <dd style={{ fontFamily: "var(--font-serif)", fontSize: 15 }}>{value}</dd>
    </>
  );
}
