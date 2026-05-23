import type { CoverPattern, Folder } from "@/lib/types";

interface FolderCoverProps {
  folder: Folder;
  count: number;
  itemLabel: { singular: string; plural: string };
  w?: number;
  h?: number;
}

const FOLDER_PALETTE: Array<{
  bg: string;
  accent: string;
  pattern: CoverPattern;
}> = [
  { bg: "#3a2f1f", accent: "#c4a559", pattern: "horizontal" },
  { bg: "#7a1f2b", accent: "#e8d5a8", pattern: "ornate" },
  { bg: "#2a3a2a", accent: "#e8d5a8", pattern: "vertical" },
  { bg: "#5a4a6a", accent: "#f0e8d5", pattern: "wavy" },
  { bg: "#1f2a3a", accent: "#e8a59f", pattern: "modern" },
  { bg: "#d4823a", accent: "#3a1f1a", pattern: "tropical" },
  { bg: "#1a2530", accent: "#e0d5b8", pattern: "horizontal" },
  { bg: "#ede4d3", accent: "#1a1a1a", pattern: "minimal" },
];

function paletteFor(folderId: string) {
  let h = 0;
  for (let i = 0; i < folderId.length; i++) {
    h = (h * 31 + folderId.charCodeAt(i)) | 0;
  }
  return FOLDER_PALETTE[Math.abs(h) % FOLDER_PALETTE.length];
}

export function FolderCover({
  folder,
  count,
  itemLabel,
  w = 280,
  h = 168,
}: FolderCoverProps) {
  const { bg, accent, pattern } = paletteFor(folder.id);
  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: bg,
        color: accent,
        position: "relative",
        overflow: "hidden",
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
          padding: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: w < 200 ? 14 : 18,
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {folder.name}
        </div>
        <div
          style={{
            fontSize: w < 200 ? 8 : 9,
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
