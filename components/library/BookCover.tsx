import type { Book } from "@/lib/types";

interface BookCoverProps {
  book: Book;
  w?: number;
  h?: number;
}

export function BookCover({ book, w = 144, h = 216 }: BookCoverProps) {
  const { bg, accent, pattern } = book.coverStyle;
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
          {book.title}
        </div>
        <div
          style={{
            fontSize: w < 120 ? 7 : 9,
            opacity: 0.8,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          {book.author}
        </div>
      </div>
    </div>
  );
}
