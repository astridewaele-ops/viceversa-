import type { CoverPattern } from "@/lib/types";

interface FolderCoverProps {
  name: string;
  seed: string;
  count: number;
  itemLabel: { singular: string; plural: string };
  w?: number;
  h?: number;
  disabled?: boolean;
}

const FOLDER_PALETTE: Array<{
  bg: string;
  accent: string;
  pattern: CoverPattern;
}> = [
  { bg: "#d4b888", accent: "#5a3a1f", pattern: "horizontal" }, // manilakarton
  { bg: "#8a6a4a", accent: "#f0e0c0", pattern: "ornate" }, // kraftbruin
  { bg: "#7a8a5a", accent: "#f0e8d5", pattern: "vertical" }, // archiefgroen
  { bg: "#a85a45", accent: "#f0e8d5", pattern: "horizontal" }, // dossierrood
  { bg: "#5a7a9a", accent: "#f0e8d5", pattern: "modern" }, // dossierblauw
  { bg: "#c4a045", accent: "#3a2f1f", pattern: "horizontal" }, // dossiergeel
  { bg: "#9a8a6a", accent: "#3a2f1f", pattern: "ornate" }, // beige
  { bg: "#5a6a5a", accent: "#e8d5a8", pattern: "wavy" }, // donkergroen
  { bg: "#b87a5a", accent: "#f0e8d5", pattern: "vertical" }, // terra
  { bg: "#3a4a5a", accent: "#d4b888", pattern: "modern" }, // staalgrijs
];

function paletteFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return FOLDER_PALETTE[Math.abs(h) % FOLDER_PALETTE.length];
}

export function FolderCover({
  name,
  seed,
  count,
  itemLabel,
  w = 140,
  h = 210,
  disabled = false,
}: FolderCoverProps) {
  const { bg, accent, pattern } = paletteFor(seed);
  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: bg,
        color: accent,
        position: "relative",
        overflow: "hidden",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {pattern === "horizontal" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage: `repeating-linear-gradient(0deg, ${accent}, ${accent} 1px, transparent 1px, transparent 14px)`,
          }}
        />
      )}
      {pattern === "ornate" && (
        <div
          style={{
            position: "absolute",
            inset: 12,
            border: `1px solid ${accent}`,
            opacity: 0.4,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 4,
              border: `1px solid ${accent}`,
              opacity: 0.3,
            }}
          />
        </div>
      )}
      {pattern === "tropical" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${accent} 0%, transparent 30%), radial-gradient(circle at 80% 20%, ${accent} 0%, transparent 25%)`,
          }}
        />
      )}
      {pattern === "vertical" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage: `repeating-linear-gradient(90deg, ${accent}, ${accent} 1px, transparent 1px, transparent 10px)`,
          }}
        />
      )}
      {pattern === "wavy" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            backgroundImage: `radial-gradient(ellipse 200% 50% at 50% 0%, ${accent} 0%, transparent 40%), radial-gradient(ellipse 200% 50% at 50% 100%, ${accent} 0%, transparent 40%)`,
          }}
        />
      )}
      {pattern === "modern" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: accent,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: w < 120 ? 11 : 14,
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: w < 120 ? 7 : 9,
            opacity: 0.8,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          {count} {count === 1 ? itemLabel.singular : itemLabel.plural}
        </div>
      </div>
    </div>
  );
}
